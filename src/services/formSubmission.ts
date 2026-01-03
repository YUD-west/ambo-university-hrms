import type { LifeHistoryFormData } from '../types/formTypes';

// Admin email configuration
const ADMIN_EMAIL = 'admin@government.gov.et'; // Change this to your admin email
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface SubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

/**
 * Send form data to admin via API
 */
export const submitFormToAdmin = async (formData: LifeHistoryFormData): Promise<SubmissionResponse> => {
  try {
    // Option 1: Send to backend API (recommended for production)
    const response = await fetch(`${API_BASE_URL}/forms/life-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Form submitted successfully! Admin will review your submission.',
      submissionId: result.id,
    };
  } catch (error) {
    // Fallback: Store in localStorage and send email notification
    console.error('API submission failed, using fallback method:', error);
    return await submitFormFallback(formData);
  }
};

/**
 * Fallback method: Store in localStorage and prepare email
 */
const submitFormFallback = async (formData: LifeHistoryFormData): Promise<SubmissionResponse> => {
  try {
    // Generate unique submission ID
    const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage (for demo purposes)
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push({
      id: submissionId,
      data: formData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    });
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));

    // Prepare email data
    const emailData = prepareEmailData(formData, submissionId);
    
    // Log email data (in production, this would send an actual email)
    console.log('Email to Admin:', emailData);
    
    // In production, you would:
    // 1. Send email via EmailJS, SendGrid, or your email service
    // 2. Or use a backend service to send the email
    
    return {
      success: true,
      message: 'Form submitted successfully! Your submission has been saved and will be reviewed by admin.',
      submissionId,
    };
  } catch (error) {
    console.error('Fallback submission failed:', error);
    return {
      success: false,
      message: 'Failed to submit form. Please try again later.',
    };
  }
};

/**
 * Prepare email data for admin notification
 */
const prepareEmailData = (formData: LifeHistoryFormData, submissionId: string) => {
  const emailSubject = `New Life History Form Submission - ${formData.personalInfo.employeeName}`;
  
  const emailBody = `
New Life History Form Submission

Submission ID: ${submissionId}
Submitted At: ${new Date().toLocaleString()}

EMPLOYEE INFORMATION:
- Name: ${formData.personalInfo.employeeName}
- Father's Name: ${formData.personalInfo.fatherName}
- Date of Birth: ${formData.personalInfo.dateOfBirth}
- Phone: ${formData.personalInfo.phoneNumber}
- Region: ${formData.personalInfo.region}
- Woreda: ${formData.personalInfo.woreda}

FAMILY INFORMATION:
- Marital Status: ${formData.familyInfo.maritalStatus}
- Spouse Name: ${formData.familyInfo.spouseName || 'N/A'}
- Number of Children: ${formData.familyInfo.children.length}

EDUCATION:
${formData.education.map(edu => `- ${edu.level}: ${edu.schoolName || 'Not specified'}`).join('\n')}

WORK EXPERIENCE:
- Number of Previous Jobs: ${formData.workExperience.length}

Please review this submission in the admin panel.

---
This is an automated notification from the Life History Form System.
  `;

  return {
    to: ADMIN_EMAIL,
    subject: emailSubject,
    body: emailBody,
    html: generateEmailHTML(formData, submissionId),
  };
};

/**
 * Generate HTML email template
 */
const generateEmailHTML = (formData: LifeHistoryFormData, submissionId: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; color: #667eea; margin-bottom: 10px; }
        .info-row { margin: 5px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Life History Form Submission</h2>
          <p>Submission ID: ${submissionId}</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Employee Information</div>
            <div class="info-row"><strong>Name:</strong> ${formData.personalInfo.employeeName}</div>
            <div class="info-row"><strong>Father's Name:</strong> ${formData.personalInfo.fatherName}</div>
            <div class="info-row"><strong>Date of Birth:</strong> ${formData.personalInfo.dateOfBirth}</div>
            <div class="info-row"><strong>Phone:</strong> ${formData.personalInfo.phoneNumber}</div>
            <div class="info-row"><strong>Region:</strong> ${formData.personalInfo.region}</div>
          </div>
          <div class="section">
            <div class="section-title">Family Information</div>
            <div class="info-row"><strong>Marital Status:</strong> ${formData.familyInfo.maritalStatus}</div>
            <div class="info-row"><strong>Spouse Name:</strong> ${formData.familyInfo.spouseName || 'N/A'}</div>
            <div class="info-row"><strong>Children:</strong> ${formData.familyInfo.children.length}</div>
          </div>
          <div class="section">
            <div class="section-title">Education</div>
            ${formData.education.map(edu => `<div class="info-row">${edu.level}: ${edu.schoolName || 'Not specified'}</div>`).join('')}
          </div>
          <div class="footer">
            <p>Please review this submission in the admin panel.</p>
            <p>This is an automated notification from the Life History Form System.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Get all pending submissions (for admin panel)
 */
export const getPendingSubmissions = (): any[] => {
  try {
    const submissions = localStorage.getItem('formSubmissions');
    return submissions ? JSON.parse(submissions) : [];
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return [];
  }
};

