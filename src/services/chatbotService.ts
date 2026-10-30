/**
 * Ambo University HRMS - Enterprise Multilingual AI Assistant Service
 * Provides comprehensive knowledge retrieval and AI communication in English, Afaan Oromoo, and Amharic.
 */

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  topic?: string;
}

export type SupportedLanguage = 'en' | 'om' | 'am';

// Comprehensive Domain Knowledge Base
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
  // 1. Project Purpose & Objectives
  {
    id: 'project_purpose',
    keywords: {
      en: ['purpose', 'about project', 'objective', 'what is this', 'hrms', 'ambo university'],
      om: ['kaayyoo', 'waa\'ee pirojektii', 'faayidaa', 'maali kun', 'yunivarsiitii amboo'],
      am: ['ዓላማ', 'ስለ ፕሮጀክቱ', 'የሥርዓቱ ጥቅም', 'ምንድን ነው', 'አምቦ ዩኒቨርሲቲ'],
    },
    responses: {
      en: 'Ambo University HRMS is the official digital Human Resource Management System & Federal Government Employees Portal. It digitizes employee life history documentation, pension and social security registrations, daily attendance tracking, leave applications, and performance reviews for federal civil servants.',
      om: 'Sirni HRMS Yuunivarsiitii Amboo poortaalii dijitaalaa hojjattoota mootummaa federaalaati. Sirni kun unka seenaa jireenyaa, wabii hawaasummaa (penshinii), to\'annoo argamaa guyyaa, eeyyama bahaa fi gamaaggama raawwii hojjattootaa ammayyeessuuf kan tolfameedha.',
      am: 'የአምቦ ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ሥርዓት (HRMS) የፌዴራል መንግሥት ሠራተኞች ይፋዊ ዲጂታል ፖርታል ነው። ይህ ሥርዓት የሠራተኞችን የሕይወት ታሪክ፣ የጡረታና የማኅበራዊ ዋስትና ምዝገባን፣ የዕለት ተዕለት መገኘትን፣ የፈቃድ አሰጣጥንና የሥራ አፈጻጸም ምዘናን በዘመናዊ መንገድ ያከናውናል።',
    },
  },

  // 2. Life History Form (Unka Seenaa Jireenyaa / የሕይወት ታሪክ ቅጽ)
  {
    id: 'life_history_form',
    keywords: {
      en: ['life history', 'form', 'personal info', 'how to fill', 'family details', 'education history'],
      om: ['seenaa jireenyaa', 'unka', 'odeeffannoo dhuunfaa', 'akkamiin guutama', 'maatii', 'barnoota'],
      am: ['የሕይወት ታሪክ', 'ቅጽ', 'የግል መረጃ', 'እንዴት ይሞላል', 'ቤተሰብ', 'ትምህርት'],
    },
    responses: {
      en: 'To complete the Ethiopian Federal Civil Service Life History Form:\n1. Click "Life History Form" from the public portal or digital forms menu.\n2. Complete Section 1: Personal particulars (Name, Birth details, Region, Kebele, Phone, Photo).\n3. Fill Section 2 & 3: Marital status, children, and emergency contacts.\n4. Fill Section 4 & 5: Educational qualifications and previous public service experience.\n5. Confirm legal accuracy and click "Submit". Your form will receive a unique Tracking ID and be routed to the HR review queue.',
      om: 'Unka Seenaa Jireenyaa Hojjattoota Mootummaa Federaalaa guutuuf:\n1. Fuula duraa irraa "Unka Seenaa Jireenyaa" filadhaa.\n2. Kutaa 1ffaa: Odeeffannoo dhuunfaa (Maqaa, Iddoo dhalootaa, Naannoo, Ganda, Bilbila, Suuraa) guutaa.\n3. Kutaa 2ffaa fi 3ffaa: Haala gaa\'ilaa, daa\'imman, fi nama yeroo balaa qunnamamu galchaa.\n4. Kutaa 4ffaa fi 5ffaa: Sadarkaa barnootaa fi muuxannoo hojii mootummaa duraanii guutaa.\n5. Dhugummaa isaa mirkaneessuun "Galchi" kan jedhu cuqqaalaa. Lakkoofsi eenyummaa (Tracking ID) battalumatti isiniif kennama.',
      am: 'የፌዴራል መንግሥት ሠራተኞች የሕይወት ታሪክ ቅጽ ለመሙላት:\n1. ከዋናው ገጽ ላይ "የሕይወት ታሪክ ቅጽ" የሚለውን ይጫኑ።\n2. ክፍል 1: የግል መረጃዎችን (ሙሉ ስም፣ የትውልድ ቦታና ቀን፣ ክልል፣ ቀበሌ፣ ስልክና ፎቶ) ይሙሉ。\n3. ክፍል 2 እና 3: የጋብቻ ሁኔታ፣ የልጆች ዝርዝርና በአደጋ ጊዜ የሚጠራ ተጠሪ ያስገቡ。\n4. ክፍል 4 እና 5: የትምህርት ደረጃ ማስረጃዎችና የቀድሞ የመንግሥት ሥራ ልምዶችን ያካትቱ。\n5. ሕጋዊነቱን አረጋግጠው "አስገባ" የሚለውን ይጫኑ። የሰነድ መለያ ቁጥር ወዲያውኑ ይሰጥዎታል።',
    },
  },

  // 3. Social Security & Pension (Wabii Hawaasummaa / ማኅበራዊ ዋስትናና ጡረታ)
  {
    id: 'social_security',
    keywords: {
      en: ['social security', 'pension', 'psssa', 'pension id', 'pension form', 'beneficiaries'],
      om: ['wabii hawaasummaa', 'penshinii', 'psssa', 'lakkoofsa penshinii', 'unka penshinii', 'dhaaltota'],
      am: ['ማኅበራዊ ዋስትና', 'ጡረታ', 'የጡረታ መለያ', 'የጡረታ ቅጽ', 'ተጠቃሚዎች', 'ወራሾች'],
    },
    responses: {
      en: 'The Public Servants Social Security Agency (PSSSA) Form (Form SS-1):\n• Purpose: Official registration for federal pension schemes and service computation.\n• Requirements: Pension ID Number, Employer Institution ID, Service History Ledger, and Nominated Beneficiaries.\n• How to access: Click "Social Security Form" from the navigation, input your credentials and dependents, and submit for institutional HR verification.',
      om: 'Unka Ejensii Wabii Hawaasummaa Hojjattoota Mootummaa (Unka WH-1):\n• Kaayyoo: Galmee sirna penshinii federaalaa fi herrega tajaajila mootummaa mirkaneessuuf.\n• Kan barbaachisu: Lakkoofsa eenyummaa penshinii, lakkoofsa dhaabbata hojjechiisaa, seenaa tajaajila duraanii fi ragaa dhaaltotaa.\n• Akkaataa itti dhiyaatu: "Unka Wabii Hawaasummaa" cuqqaaluun ragaa keessanii fi maatii guuttanii galchaa.',
      am: 'የመንግሥት ሠራተኞች የማኅበራዊ ዋስትና ኤጀንሲ ቅጽ (ቅጽ ጡ-1):\n• ዓላማ: የፌዴራል መንግሥት ሠራተኞች የጡረታ ዕቅድ ምዝገባና የአገልግሎት ዘመን ስሌት።\n• የሚያስፈልጉ መረጃዎች: የጡረታ መለያ ቁጥር፣ የአሠሪው መሥሪያ ቤት ቁጥር፣ የቀድሞ አገልግሎት ዝርዝርና የተመዘገቡ ወራሾች።\n• አሞላል: ከማውጫው "የማኅበራዊ ዋስትና ቅጽ" የሚለውን በመምረጥ መረጃዎን ሞልተው ለአስተዳዳሪው ይላኩ።',
    },
  },

  // 4. Leave Policy & Requests (Eeyyama Bahaa / የፈቃድ አሰጣጥ)
  {
    id: 'leave_policy',
    keywords: {
      en: ['leave', 'vacation', 'sick leave', 'maternity', 'request leave', 'how many days'],
      om: ['baha', 'eeyyama', 'boqonnaa', 'dhukkubaa', 'dahumsaa', 'gaaffii bahaa'],
      am: ['ፈቃድ', 'ዕረፍት', 'የሕመም ፈቃድ', 'የወሊድ ፈቃድ', 'ፈቃድ መጠየቅ', 'ስንት ቀን'],
    },
    responses: {
      en: 'Ambo University Leave Policies:\n• Annual Statutory Leave: Earned based on federal civil service tenure.\n• Sick / Medical Leave: Granted upon certified physician documentation.\n• Maternity & Paternity Leave: Provided in accordance with Ethiopian Federal Civil Service proclamations.\n• How to request: Authorized staff log in to the Staff Portal → Go to "Leave Management" → Click "+ Add Leave Request" → Select dates and reason. The supervisor reviews and approves directly in the portal.',
      om: 'Imaammata Eeyyama Bahaa Yuunivarsiitii Amboo:\n• Boqonnaa Waggaa: Tajaajila siivil sarviisii irratti hundaa\'ee kennama.\n• Baha Dhukkubaa/Yaalaa: Ragaa ogeessa fayyaa seera qabeessaan dhiyaata.\n• Baha Dahumsaa fi Abbummaa: Akka labsii siivil sarviisii mootummaa federaalaatti kennama.\n• Gaaffii dhiheessuuf: Hojjattoonni poortaalii erga seenanii booda "Bulchiinsa Bahaa" deemuun "+ Gaaffii Bahaa Dhiheessi" filatu.',
      am: 'የአምቦ ዩኒቨርሲቲ የፈቃድ አሰጣጥ መመሪያዎች:\n• የዓመት መደበኛ ዕረፍት: እንደ ሠራተኛው የአገልግሎት ዘመን የሚሰላ ሕጋዊ ዕረፍት።\n• የሕመም ፈቃድ: በሕክምና ባለሙያ የተረጋገጠ የሕክምና ማስረጃ ሲቀርብ ይሰጣል።\n• የወሊድና የአባትነት ፈቃድ: በኢትዮጵያ ፌዴራል ሲቪል ሰርቪስ አዋጅ መሠረት ይሰጣል።\n• ማመልከቻ: ሠራተኞች ወደ ፖርታሉ ገብተው "የፈቃድ አስተዳደር" → "+ የፈቃድ ማመልከቻ አስገባ" በመጫን ቀናትንና ምክንያትን አስገብተው ያመለክታሉ።',
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
      en: 'Attendance & Working Hours Guidelines:\n• Official Operating Hours: Monday to Friday, 8:30 AM to 5:30 PM (Lunch break 12:30 PM - 1:30 PM).\n• Duty Logging: Staff attendance is tracked daily under HR Portal → "Attendance".\n• Hours Computation: Automatic calculation of total working hours, punctuality tracking, and absence alerts.',
      om: 'Qajeelfama Sa\'aatii Hojii fi Argamaa:\n• Sa\'aatii Hojii Idilee: Wiixata hanga Jimaataa, ganama sa\'aatii 2:30 hanga waaree booda 11:30.\n• Galmee Argamaa: Argamni guyyaa guyyaan HR Portal → "Galmee Argamaa" jalatti to\'atama.\n• Herrega Sa\'aatii: Sa\'aatiin hojjatame ofumaan herregamee kanneen barfatan adda baasa.',
      am: 'የሥራ ሰዓትና የመገኘት መመሪያ:\n• መደበኛ የሥራ ሰዓት: ከሰኞ እስከ ዓርብ ከጠዋቱ 2:30 እስከ 11:30 (የምሳ ዕረፍት ከ6:30 - 7:30).\n• የመገኘት ምዝገባ: የዕለት ተዕለት መገኘት በHR Portal → "የመገኘት መቆጣጠሪያ" ውስጥ ይመዘገባል።\n• የሰዓት ስሌት: የተሰራው ጠቅላላ ሰዓት፣ ማርፈድና መቅረት በራስ-ሰር ይሰላል።',
    },
  },

  // 6. Security, Login & Access Control (Nageenya & Seensa / ደህንነትና መግቢያ)
  {
    id: 'security_access',
    keywords: {
      en: ['login', 'admin portal', 'hr portal', 'access denied', 'credentials', 'password', 'role'],
      om: ['seensa', 'admin paaneelii', 'hr poortaalii', 'hayyama', 'jecha darbiinsaa', 'gahee'],
      am: ['መግቢያ', 'አስተዳዳሪ', 'የሰው ኃይል ፖርታል', 'ፍቃድ', 'የይለፍ ቃል', 'ሚና'],
    },
    responses: {
      en: 'Security & Role-Based Access Control (RBAC):\n• Public Visitors: Can explore the portal and fill official Life History and Social Security forms.\n• Admin Portal (/admin): Strictly restricted to System Administrators for reviewing, approving, and exporting employee submissions.\n• HR Management Portal (/hr): Restricted to HR Officers and Administrators for staff directory, departments, attendance, and leave management.\n• Access: Click "Staff Login" from the public menu and enter your institutional credentials.',
      om: 'Eegumsa Nageenyaa fi To\'annoo Hayyamaa (RBAC):\n• Daawwattoota: Poortaalicha daawwachuu fi unkaalee seenaa jireenyaa fi penshinii guutuu danda\'u.\n• Paaneelii Admin (/admin): Bulchitoota sirnaatiif qofa kan eeyyamame yoo ta\'u unkaalee qorachuu fi mirkaneessuuf fayyada.\n• Poortaalii HR (/hr): Ogeessota Qabeenya Namaatiif kan eeyyamame yoo ta\'u hojjattoota, gareewwan, argamaa fi baha to\'ata.\n• Seensaf: Fuula duraa irraa "Seensa Hojjattootaa" cuqqaaluun ragaa keessan galchaa.',
      am: 'የደህንነትና የተጠቃሚ ፈቃድ ቁጥጥር (RBAC):\n• የሕዝብ ጎብኝዎች: ፖርታሉን መጎብኘትና የሕይወት ታሪክ እንዲሁም የማኅበራዊ ዋስትና ቅጾችን መሙላት ይችላሉ።\n• የአስተዳዳሪ ማዕከል (/admin): ለሥርዓቱ አስተዳዳሪዎች ብቻ የተፈቀደ ሲሆን ቅጾችን ለመመርመር፣ ለማጽደቅና ለማውረድ ያገለግላል።\n• የሰው ኃይል ፖርታል (/hr): ለሰው ኃይል ባለሙያዎች የተፈቀደ ሲሆን የሠራተኞች ማውጫን፣ የሥራ ክፍሎችን፣ መገኘትንና ፈቃድን ያስተዳድራል።\n• መግቢያ: ከዋናው ገጽ "የሠራተኞች መግቢያ" በመጫን የተመደበልዎትን ይለፍ ቃል ያስገቡ።',
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
      en: 'Ambo University Contact & Institutional Location:\n• Campus: Woliso Business and Economics Campus, Woliso, Ethiopia.\n• Directorate: Human Resource Development & Administration Directorate.\n• Email: hr@ambou.edu.et | info@government.gov.et\n• Direct Telephone: +251 11 342 3128 / +251 11 123 4567\n• Postal Address: P.O. Box 217, Woliso, Ethiopia',
      om: 'Teessoo fi Quunnamtii Yuunivarsiitii Amboo:\n• Kaampaasii: Kaampaasii Daldalaa fi Dinagdee Walisoo, Walisoo, Itoophiyaa.\n• Daarektoreetii: Daarektoreetii Misooma fi Bulchiinsa Qabeenya Namaa.\n• Imeelii: hr@ambou.edu.et | info@government.gov.et\n• Bilbila Kallattii: +251 11 342 3128 / +251 11 123 4567\n• Saanduqa Postaa: Lakk. Saan. Pos. 217, Walisoo, Itoophiyaa',
      am: 'የአምቦ ዩኒቨርሲቲ ይፋዊ አድራሻና ግንኙነት:\n• ካምፓስ: ወሊሶ ቢዝነስና ኢኮኖሚክስ ካምፓስ፣ ወሊሶ፣ ኢትዮጵያ።\n• ዳይሬክቶሬት: የሰው ኃይል ልማትና አስተዳደር ዳይሬክቶሬት።\n• ኢሜይል: hr@ambou.edu.et | info@government.gov.et\n• የቀጥታ ስልክ: +251 11 342 3128 / +251 11 123 4567\n• የፖስታ ሣጥን: የፖ.ሣ.ቁ 217፣ ወሊሶ፣ ኢትዮጵያ',
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
      return 'Dhiifama, gaaffiin keessan sirriitti hin hubatamne. Waa\'ee dhimmoota armaan gadii na gaafachuu dandeessu:\n• Unka Seenaa Jireenyaa akkamiin akka guuttan\n• Unka Wabii Hawaasummaa fi Penshinii\n• Eeyyama bahaa fi boqonnaa gaafachuu\n• Galmee argamaa fi sa\'aatii hojii\n• Teessoo fi quunnamtii Yuunivarsiitii Amboo';
    }
    if (lang === 'am') {
      return 'ይቅርታ፣ ጥያቄዎ በደንብ አልተረዳኝም። ስለሚከተሉት ጉዳዮች መጠየቅ ይችላሉ:\n• የሕይወት ታሪክ ቅጽ አሞላል መመሪያ\n• የማኅበራዊ ዋስትናና የጡረታ ምዝገባ\n• የፈቃድ አሰጣጥና ማመልከቻ\n• የሥራ ሰዓትና የመገኘት መቆጣጠሪያ\n• የአምቦ ዩኒቨርሲቲ አድራሻና የቀጥታ ስልክ';
    }
    return 'I can assist you with:\n• How to complete the Life History Form\n• Public Servants Pension & Social Security registration\n• Leave policies and submission workflows\n• Daily attendance tracking & working hours\n• Ambo University HR contact details and campus location\n\nPlease select one of the topics above or rephrase your question.';
  },
};
