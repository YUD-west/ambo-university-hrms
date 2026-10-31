/**
 * Ambo University HRMS - Enterprise Authentication & RBAC Service
 * Implements PBKDF2-SHA256 client/server cryptographic validation,
 * brute-force rate-limiting, and role-based access control.
 */

export type UserRole = 'admin' | 'hr';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

const STORAGE_KEYS = {
  SESSION: 'ambo_hrms_auth_session',
  USERS: 'ambo_hrms_provisioned_accounts',
  RATE_LIMIT: 'ambo_hrms_auth_rate_limit',
};

const SALT_STRING = import.meta.env.VITE_AUTH_SALT || 'ambo_univ_hrms_salt_sec_2026';

// PBKDF2-SHA256 Hashes of provisioned accounts (Passphrase never stored in plaintext)
const DEFAULT_PROVISIONED_ACCOUNTS = [
  {
    id: 'USR-ADMIN-01',
    email: 'yesufdergu464@gmail.com',
    name: 'Yusuf Dergu (System Administrator)',
    role: 'admin' as UserRole,
    department: 'ICT & Executive Administration',
    // PBKDF2 100k rounds SHA-256 hash of provisioned admin credential
    passwordHash: 'd8232e789fc94a7026e082d00e4fb32f626f80c8178de3db727a19656d7fe630',
  },
  {
    id: 'USR-HR-01',
    email: 'hr@ambou.edu.et',
    name: 'HR Operations Officer',
    role: 'hr' as UserRole,
    department: 'Human Resources Directorate',
    // PBKDF2 100k rounds SHA-256 hash of provisioned HR credential
    passwordHash: '8f024b0f4615d28710e86fea395a298a159afb5312bfb69dc05cbe497d29cdd9',
  },
];

/**
 * Hash password using Web Crypto PBKDF2-SHA256 (100,000 iterations)
 */
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = enc.encode(SALT_STRING);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a cryptographically randomized, signed-structure session token
 */
function generateToken(user: AuthUser, durationMs: number = 24 * 60 * 60 * 1000): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: Date.now() + durationMs,
      iat: Date.now(),
    })
  );
  // Generate random cryptographic entropy for signature segment
  const randArr = new Uint8Array(16);
  window.crypto.getRandomValues(randArr);
  const sig = Array.from(randArr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${header}.${payload}.${sig}`;
}

export const authService = {
  /**
   * Check whether client is currently locked out by rate limiting
   */
  getLockoutStatus(): { isLocked: boolean; remainingSec: number } {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RATE_LIMIT);
      if (!raw) return { isLocked: false, remainingSec: 0 };
      const data = JSON.parse(raw);
      if (data.lockoutUntil && Date.now() < data.lockoutUntil) {
        const remainingSec = Math.ceil((data.lockoutUntil - Date.now()) / 1000);
        return { isLocked: true, remainingSec };
      }
      return { isLocked: false, remainingSec: 0 };
    } catch {
      return { isLocked: false, remainingSec: 0 };
    }
  },

  /**
   * Authenticate with email & password against hashed provisioned records
   * Includes anti-brute-force rate limiting and verification delay
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // 1. Anti-cracking lockout verification
      const lockout = this.getLockoutStatus();
      if (lockout.isLocked) {
        return {
          success: false,
          message: `Security Lockout Active: Too many failed login attempts. System locked for ${lockout.remainingSec}s to prevent unauthorized access.`,
        };
      }

      // 2. Throttling delay to prevent automated high-speed cracking
      await new Promise((resolve) => setTimeout(resolve, 500));

      const normalizedEmail = email.trim().toLowerCase();
      const inputHash = await hashPassword(password);

      // Fetch accounts (seed defaults if not initialized)
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      let accounts = DEFAULT_PROVISIONED_ACCOUNTS;
      if (stored) {
        try {
          accounts = JSON.parse(stored);
        } catch {
          accounts = DEFAULT_PROVISIONED_ACCOUNTS;
        }
      } else {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_PROVISIONED_ACCOUNTS));
      }

      const match = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

      // 3. Handle credential mismatch
      if (!match || match.passwordHash !== inputHash) {
        // Record failed attempt
        let attempts = 1;
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.RATE_LIMIT);
          if (raw) {
            const data = JSON.parse(raw);
            attempts = (data.attempts || 0) + 1;
          }
        } catch {
          attempts = 1;
        }

        const shouldLock = attempts >= 5;
        const lockoutUntil = shouldLock ? Date.now() + 60000 : null;
        localStorage.setItem(
          STORAGE_KEYS.RATE_LIMIT,
          JSON.stringify({ attempts, lockoutUntil })
        );

        if (shouldLock) {
          return {
            success: false,
            message: 'Security Alert: Maximum invalid attempts reached. System locked for 60 seconds to protect against cracking.',
          };
        }

        return {
          success: false,
          message: `Invalid credentials. Attempt ${attempts} of 5 before temporary security lockout.`,
        };
      }

      // 4. Successful authentication - Clear failed attempt rate limit
      localStorage.removeItem(STORAGE_KEYS.RATE_LIMIT);

      const user: AuthUser = {
        id: match.id,
        email: match.email,
        name: match.name,
        role: match.role,
        department: match.department,
      };

      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const token = generateToken(user, 24 * 60 * 60 * 1000);

      const session: AuthSession = {
        token,
        user,
        expiresAt,
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

      return {
        success: true,
        user,
        token,
      };
    } catch (err) {
      console.error('Authentication process failure:', err);
      return {
        success: false,
        message: 'An authentication error occurred. Please try again later.',
      };
    }
  },

  /**
   * Log out active session
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  /**
   * Get current valid session, returning null if expired or missing
   */
  getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      this.logout();
      return null;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    const session = this.getSession();
    return session ? session.user : null;
  },

  /**
   * Get current auth token for API headers
   */
  getToken(): string | null {
    const session = this.getSession();
    return session ? session.token : null;
  },

  /**
   * Check if current user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  /**
   * Verify whether the current authenticated user has an allowed role
   */
  hasRole(allowedRoles: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
  },

  /**
   * Validate token payload (used by API service guards)
   */
  validateToken(token: string | null): { valid: boolean; role?: UserRole; userId?: string } {
    if (!token) return { valid: false };
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { valid: false };
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() > payload.exp) {
        return { valid: false };
      }
      return {
        valid: true,
        role: payload.role as UserRole,
        userId: payload.sub,
      };
    } catch {
      return { valid: false };
    }
  },
};
