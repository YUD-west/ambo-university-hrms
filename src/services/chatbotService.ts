/**
 * Ambo University HRMS - Intelligent Multilingual Domain Knowledge Engine
 * Supports trilingual AI inquiries (English, Afaan Oromoo, Amharic).
 */

export type SupportedLanguage = 'en' | 'om' | 'am';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface KnowledgeTopic {
  id: string;
  keywords: {
    en: string[];
    om: string[];
    am: string[];
  };
  responses: {
    en: string;
    om: string;
    am: string;
  };
}

const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // 1. Project Purpose & System Overview (Kaayyoo & Ibsa / ዓላማና መግለጫ)
  {
    id: 'project_overview',
    keywords: {
      en: ['what is this', 'about project', 'purpose', 'system overview', 'features', 'what can i do'],
      om: ['sirni kun maali', 'waa\'ee pirojektii', 'faayidaa', 'kaayyoo', 'tajaajila'],
      am: ['ይህ ምንድን ነው', 'ስለ ሲስተሙ', 'ዓላማ', 'አገልግሎቶች', 'ምን ማድረግ እችላለሁ'],
    },
    responses: {
      en: 'Ambo University Employee Documentation Portal is a secure, multilingual platform. It digitizes Federal Public Service documentation, including the official Life History Form, Social Security and Pension documentation, and administrative management workflows.',
      om: 'Poortaaliin Galmee Hojjattoota Yuunivarsiitii Amboo sirna eegumsa qabu fi afaanota hedduun tajaajiludha. Unkaalee Siivil Sarviisii Federaalaa kanneen akka Seenaa Jireenyaa fi Penshinii bifa dijitaalaan qabachuuf gargaara.',
      am: 'የአምቦ ዩኒቨርሲቲ የሠራተኞች ሰነድ ፖርታል ዘመናዊና ባለብዙ ቋንቋ ሥርዓት ነው። የፌዴራል ሲቪል ሰርቪስ ሰነዶችን፣ የሕይወት ታሪክ ቅጽንና የማኅበራዊ ዋስትና ምዝገባን በዲጂታል መንገድ ለማስተዳደር ያገለግላል።',
    },
  },

  // 2. Life History Form Guidance (Unka Seenaa Jireenyaa / የሕይወት ታሪክ ቅጽ)
  {
    id: 'life_history_form',
    keywords: {
      en: ['life history', 'form instructions', 'how to register', 'civil service form', 'personal information'],
      om: ['seenaa jireenyaa', 'unka', 'akkamitti galmaa\'a', 'odeeffannoo dhuunfaa', 'qajeelfama unkaa'],
      am: ['የሕይወት ታሪክ', 'ቅጽ', 'እንዴት መመዝገብ እችላለሁ', 'የግል መረጃ', 'የሲቪል ሰርቪስ ቅጽ'],
    },
    responses: {
      en: 'The Life History Form includes:\n1. Personal details & birthplace\n2. Family, marital status & dependents\n3. Academic credentials & education\n4. Language proficiencies & skills\n5. Civil service work history\n6. Official verification\n\nClick "Fill Life History Form" on the home page to begin.',
      om: 'Unki Seenaa Jireenyaa kanneen of keessaa qaba:\n1. Ragaa Dhuunfaa fi bakka dhalootaa\n2. Maatii, gaa\'ela fi ijoollee\n3. Sadarkaa barumsaa fi waraqaa ragaa\n4. Dandeettii afaanii fi ogummaa addaa\n5. Muuxannoo hojii siivil sarviisii\n6. Mirkaneessa dhumaa\n\nJalqabuuf fuula duraa irraa "Unka Seenaa Jireenyaa Guuti" kan jedhu cuqqaalaa.',
      am: 'የሕይወት ታሪክ ቅጽ የሚከተሉትን ያካትታል:\n1. የግል መረጃና የትውልድ ቦታ\n2. የቤተሰብ ሁኔታና ልጆች\n3. የትምህርት ደረጃና ማስረጃዎች\n4. የቋንቋ ችሎታና ልዩ ሙያዎች\n5. የመንግሥት የሥራ ልምድ\n6. ይፋዊ ማረጋገጫ\n\nለመጀመር ከዋናው ገጽ ላይ "የሕይወት ታሪክ ቅጽ ሙላ" የሚለውን ይጫኑ።',
    },
  },

  // 3. Social Security & Pension Guidance (Wabii Hawaasummaa / ማኅበራዊ ዋስትና)
  {
    id: 'social_security',
    keywords: {
      en: ['social security', 'pension', 'psssa', 'retirement', 'pension scheme', 'beneficiary'],
      om: ['wabii hawaasummaa', 'penshinii', 'soorrama', 'fayyadamtoota', 'lakk penshinii'],
      am: ['ማኅበራዊ ዋስትና', 'ጡረታ', 'የጡረታ መለያ', 'ተጠቃሚዎች', 'የጡረታ አበል'],
    },
    responses: {
      en: 'The Social Security & Pension Form captures Public Servants Social Security Agency (PSSSA) records:\n• Pension scheme registration numbers\n• Total accumulated public service years\n• Designated legal beneficiaries & children under 18\n\nClick "Social Security Form" on the home page to complete your submission.',
      om: 'Unki Wabii Hawaasummaa fi Penshinii ragaalee Ejensii Wabii Hawaasummaa Hojjattoota Mootummaa (PSSSA) qabata:\n• Lakk. Galmee penshinii\n• Waggoota tajaajila mootummaa walitti qabame\n• Dhaaltota seeraa fi daa\'imman waggaa 18 gadii\n\nGuutuuf fuula duraa irraa "Unka Wabii Hawaasummaa" cuqqaalaa.',
      am: 'የማኅበራዊ ዋስትናና የጡረታ ቅጽ የመንግሥት ሠራተኞች ማኅበራዊ ዋስትና ኤጀንሲ (PSSSA) መረጃዎችን ይይዛል:\n• የጡረታ መለያ ቁጥር\n• የተጠቃለለ የመንግሥት አገልግሎት ዘመን\n• ሕጋዊ ወራሾችና ከ18 ዓመት በታች የሆኑ ልጆች\n\nቅጹን ለማጠናቀቅ በዋናው ገጽ ላይ "የማኅበራዊ ዋስትና ቅጽ" የሚለውን ይጫኑ።',
    },
  },

  // 4. Leave Policy Guidance (Imaammata Bahaa / የፈቃድ መመሪያ)
  {
    id: 'leave_policy',
    keywords: {
      en: ['leave', 'vacation', 'sick leave', 'maternity', 'request leave', 'how many days'],
      om: ['baha', 'eeyyama', 'boqonnaa', 'dhukkubaa', 'dahumsaa', 'gaaffii bahaa'],
      am: ['ፈቃድ', 'ዕረፍት', 'የሕመም ፈቃድ', 'የወሊድ ፈቃድ', 'ፈቃድ መጠየቅ', 'ስንት ቀን'],
    },
    responses: {
      en: 'Ambo University Leave Policies:\n• Annual Statutory Leave: Earned based on federal civil service tenure.\n• Sick / Medical Leave: Granted upon certified physician documentation.\n• Maternity & Paternity Leave: Provided in accordance with Ethiopian Federal Civil Service proclamations.\n• Inquiries: Contact your designated department head or institutional administration.',
      om: 'Imaammata Eeyyama Bahaa Yuunivarsiitii Amboo:\n• Boqonnaa Waggaa: Tajaajila siivil sarviisii irratti hundaa\'ee kennama.\n• Baha Dhukkubaa/Yaalaa: Ragaa ogeessa fayyaa seera qabeessaan dhiyaata.\n• Baha Dahumsaa fi Abbummaa: Akka labsii siivil sarviisii mootummaa federaalaatti kennama.\n• Gaaffiif: Hoggansa kutaa hojii keessanii yookiin bulchiinsa quunnamaa.',
      am: 'የአምቦ ዩኒቨርሲቲ የፈቃድ አሰጣጥ መመሪያዎች:\n• የዓመት መደበኛ ዕረፍት: እንደ ሠራተኛው የአገልግሎት ዘመን የሚሰላ ሕጋዊ ዕረፍት።\n• የሕመም ፈቃድ: በሕክምና ባለሙያ የተረጋገጠ የሕክምና ማስረጃ ሲቀርብ ይሰጣል።\n• የወሊድና የአባትነት ፈቃድ: በኢትዮጵያ ፌዴራል ሲቪል ሰርቪስ አዋጅ መሠረት ይሰጣል።\n• ለበለጠ መረጃ: የቅርብ የሥራ ኃላፊዎን ወይም የዩኒቨርሲቲውን አስተዳደር ያነጋግሩ።',
    },
  },

  // 5. Attendance & Working Hours (Galmee Argamaa / የመገኘት ቁጥጥር)
  {
    id: 'attendance_policy',
    keywords: {
      en: ['attendance', 'working hours', 'check in', 'check out', 'late', 'office hours'],
      om: ['argama', 'sa\'aatii hojii', 'seensa', 'ba\'insa', 'barfachuu', 'waajjira'],
      am: ['መገኘት', 'የሥራ ሰዓት', 'መግቢያ', 'መውጫ', 'ማርፈድ', 'የሥራ ገበታ'],
    },
    responses: {
      en: 'Attendance & Working Hours Guidelines:\n• Official Operating Hours: Monday to Friday, 8:30 AM to 5:30 PM (Lunch break 12:30 PM - 1:30 PM).\n• Duty Logging: Employee attendance is verified through official civil service time records.',
      om: 'Qajeelfama Sa\'aatii Hojii fi Argamaa:\n• Sa\'aatii Hojii Idilee: Wiixata hanga Jimaataa, ganama sa\'aatii 2:30 hanga waaree booda 11:30.\n• Galmee Argamaa: Argamni galmee seera qabeessaan to\'atama.',
      am: 'የሥራ ሰዓትና የመገኘት መመሪያ:\n• መደበኛ የሥራ ሰዓት: ከሰኞ እስከ ዓርብ ከጠዋቱ 2:30 እስከ 11:30 (የምሳ ዕረፍት ከ6:30 - 7:30).\n• የመገኘት ምዝገባ: የሥራ ገበታ መገኘት በይፋዊ መዝገብ ይረጋገጣል።',
    },
  },

  // 6. Security & Access Control (Nageenya & Seensa / ደህንነትና መግቢያ)
  {
    id: 'security_access',
    keywords: {
      en: ['login', 'admin portal', 'hr portal', 'access denied', 'credentials', 'password', 'role'],
      om: ['seensa', 'admin paaneelii', 'hr poortaalii', 'hayyama', 'jecha darbiinsaa', 'gahee'],
      am: ['መግቢያ', 'አስተዳዳሪ', 'የሰው ኃይል ፖርታል', 'ፍቃድ', 'የይለፍ ቃል', 'ሚና'],
    },
    responses: {
      en: 'Security & Access Control:\n• Public Visitors: Can explore the portal and submit official Life History and Social Security forms.\n• Administrative Dashboards: Strictly restricted and protected with cryptographic verification and role-based access control (RBAC).\n• Access: Authorized personnel authenticate via secure institutional credentials verification.',
      om: 'Eegumsa Nageenyaa fi To\'annoo Hayyamaa:\n• Daawwattoota: Poortaalicha daawwachuu fi unkaalee seenaa jireenyaa fi penshinii guutuu danda\'u.\n• Paaneelota Bulchiinsaa: Eegumsa cimaa kan qaban yoo ta\'u ragaa qondaaltotaatiin qofa kan banamanidha.\n• Seensaf: Qondaaltonni eeyyaman ragaa seensaatiin qofa seenu.',
      am: 'የደህንነትና የተጠቃሚ ፈቃድ ቁጥጥር:\n• የሕዝብ ጎብኝዎች: ፖርታሉን መጎብኘትና የሕይወት ታሪክ እንዲሁም የማኅበራዊ ዋስትና ቅጾችን መሙላት ይችላሉ።\n• የአስተዳደር ክፍሎች: በጥብቅ የተጠበቁና በተፈቀደላቸው ሠራተኞች ብቻ የሚከፈቱ ናቸው።\n• መግቢያ: የተፈቀደላቸው ሠራተኞች ብቻ በተመደበላቸው ይለፍ ቃል መግባት ይችላሉ።',
    },
  },

  // 7. Campus Location, Contact & Support (Iddoo & Quunnamtii / አድራሻና ግንኙነት)
  {
    id: 'contact_support',
    keywords: {
      en: ['contact', 'email', 'phone', 'location', 'campus', 'woliso', 'address', 'support'],
      om: ['quunnamtii', 'imeelii', 'bilbila', 'iddoo', 'kaampaasii', 'walisoo', 'teessoo', 'deggersa'],
      am: ['አግኙን', 'ኢሜይል', 'ስልክ', 'አድራሻ', 'ካምፓስ', 'ወሊሶ', 'እርዳታ', 'ድጋፍ'],
    },
    responses: {
      en: 'Ambo University Contact & Institutional Location:\n• Campus: Woliso Business and Economics Campus, Woliso, Ethiopia.\n• Directorate: Academic & Administrative Affairs.\n• Email: contact@ambou.edu.et\n• Direct Telephone: +251 11 342 3128\n• Postal Address: P.O. Box 217, Woliso, Ethiopia',
      om: 'Teessoo fi Quunnamtii Yuunivarsiitii Amboo:\n• Kaampaasii: Kaampaasii Daldalaa fi Dinagdee Walisoo, Walisoo, Itoophiyaa.\n• Daarektoreetii: Dhimmoota Barnootaa fi Bulchiinsaa.\n• Imeelii: contact@ambou.edu.et\n• Bilbila Kallattii: +251 11 342 3128\n• Saanduqa Postaa: Lakk. Saan. Pos. 217, Walisoo, Itoophiyaa',
      am: 'የአምቦ ዩኒቨርሲቲ ይፋዊ አድራሻና ግንኙነት:\n• ካምፓስ: ወሊሶ ቢዝነስና ኢኮኖሚክስ ካምፓስ፣ ወሊሶ፣ ኢትዮጵያ።\n• ዳይሬክቶሬት: የአካዳሚክና አስተዳደር ጉዳዮች።\n• ኢሜይል: contact@ambou.edu.et\n• የቀጥታ ስልክ: +251 11 342 3128\n• የፖስታ ሣጥን: የፖ.ሣ.ቁ 217፣ ወሊሶ፣ ኢትዮጵያ',
    },
  },
];

/**
 * Detect language of user query or use selected interface language
 */
function resolveLanguage(query: string, currentLang: string): SupportedLanguage {
  const q = query.trim().toLowerCase();
  // Check Ethiopic script for Amharic
  if (/[\u1200-\u137F]/.test(q)) {
    return 'am';
  }
  // Check Afaan Oromoo indicators
  if (
    q.includes('akkam') ||
    q.includes('maal') ||
    q.includes('unka') ||
    q.includes('hojjetaa') ||
    q.includes('baha') ||
    q.includes('eeyyama')
  ) {
    return 'om';
  }
  // Default to active UI language
  if (currentLang.startsWith('am')) return 'am';
  if (currentLang.startsWith('om')) return 'om';
  return 'en';
}

export const chatbotService = {
  /**
   * Send user message to AI backend or domain knowledge engine
   */
  async sendMessage(
    message: string,
    currentLang: string,
    _history: ChatMessage[] = []
  ): Promise<string> {
    const lang = resolveLanguage(message, currentLang);
    const q = message.trim().toLowerCase();

    // 1. Check if backend AI API endpoint is configured in environment
    const aiApiUrl = import.meta.env.VITE_AI_API_URL;
    if (aiApiUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`${aiApiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            language: lang,
            history: _history.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            return data.reply;
          }
        }
      } catch (err) {
        console.warn('Backend AI API unavailable, engaging domain knowledge base:', err);
      }
    }

    // 2. Intelligent Matcher against Comprehensive Knowledge Base
    let bestTopic: KnowledgeTopic | null = null;
    let maxMatches = 0;

    for (const topic of KNOWLEDGE_BASE) {
      let matches = 0;
      const allKeywords = [
        ...topic.keywords.en,
        ...topic.keywords.om,
        ...topic.keywords.am,
      ];

      for (const kw of allKeywords) {
        if (q.includes(kw.toLowerCase())) {
          matches += kw.length > 5 ? 2 : 1;
        }
      }

      if (matches > maxMatches) {
        maxMatches = matches;
        bestTopic = topic;
      }
    }

    if (bestTopic && maxMatches > 0) {
      return bestTopic.responses[lang];
    }

    // 3. Contextual Default Guidance
    if (lang === 'om') {
      return 'Dhiifama, gaaffiin keessan sirriitti hin hubatamne. Waa\'ee dhimmoota armaan gadii na gaafachuu dandeessu:\n• Unka Seenaa Jireenyaa akkamiin akka guuttan\n• Unka Wabii Hawaasummaa fi Penshinii\n• Teessoo fi quunnamtii Yuunivarsiitii Amboo';
    }
    if (lang === 'am') {
      return 'ይቅርታ፣ ጥያቄዎ በደንብ አልተረዳኝም። ስለሚከተሉት ጉዳዮች መጠየቅ ይችላሉ:\n• የሕይወት ታሪክ ቅጽ አሞላል መመሪያ\n• የማኅበራዊ ዋስትናና የጡረታ ምዝገባ\n• የአምቦ ዩኒቨርሲቲ አድራሻና የቀጥታ ስልክ';
    }
    return 'I can assist you with:\n• How to complete the Life History Form\n• Public Servants Pension & Social Security registration\n• Ambo University institutional contact details and campus location\n\nPlease select one of the topics above or rephrase your question.';
  },
};
