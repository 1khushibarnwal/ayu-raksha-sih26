export type SupportedLanguage = 'en' | 'hi' | 'bn'

export interface TranslationDictionary {
  appName: string
  subtitle: string
  innovationAnalyzer: string
  analyzeInnovation: string
  traditionalKnowledgeDetector: string
  ipProtectionStrategy: string
  ipRiskCenter: string
  biodiversityABSChecker: string
  regulatoryNavigator: string
  viewEvidence: string
  closeEvidence: string
  status: string
  recommended: string
  investigate: string
  notApplicable: string
  highRisk: string
  mediumRisk: string
  lowRisk: string
  whyThisClassification: string
  whyItMatches: string
  nextStep: string
  demoNotice: string
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'IP-SAKTI Sahayak',
    subtitle: 'Multilingual Source-Cited AI Assistant for Ayurvedic IP & Regulatory Guidance',
    innovationAnalyzer: 'Innovation Analyzer',
    analyzeInnovation: 'Analyze My Innovation',
    traditionalKnowledgeDetector: 'Traditional Knowledge Detector',
    ipProtectionStrategy: 'IP Protection Strategy',
    ipRiskCenter: 'IP Risk Center',
    biodiversityABSChecker: 'Biodiversity & ABS Checker',
    regulatoryNavigator: 'Regulatory Navigator',
    viewEvidence: 'View Evidence & Sources',
    closeEvidence: 'Close Evidence',
    status: 'Status',
    recommended: 'Recommended',
    investigate: 'Investigate',
    notApplicable: 'Not Applicable / Uncertain',
    highRisk: 'HIGH RISK',
    mediumRisk: 'MEDIUM RISK',
    lowRisk: 'LOW RISK',
    whyThisClassification: 'Why this classification?',
    whyItMatches: 'Why it matches:',
    nextStep: 'Recommended Next Step',
    demoNotice: 'Demo / Mock Analysis Layer',
  },
  hi: {
    appName: 'आईपी-शक्ति सहायक',
    subtitle: 'आयुर्वेदिक बौद्धिक संपदा और नियामक मार्गदर्शन हेतु बहुभाषी एआई सहायक',
    innovationAnalyzer: 'नवाचार विश्लेषक (Innovation Analyzer)',
    analyzeInnovation: 'नवाचार का विश्लेषण करें',
    traditionalKnowledgeDetector: 'पारंपरिक ज्ञान संसूचक (TK Detector)',
    ipProtectionStrategy: 'आईपी सुरक्षा रणनीति (IP Protection Strategy)',
    ipRiskCenter: 'आईपी जोखिम केंद्र (IP Risk Center)',
    biodiversityABSChecker: 'जैव विविधता एवं एबीएस जांचकर्ता (ABS Checker)',
    regulatoryNavigator: 'नियामक नेविगेटर (Regulatory Navigator)',
    viewEvidence: 'प्रमाण एवं संदर्भ देखें',
    closeEvidence: 'प्रमाण बंद करें',
    status: 'स्थिति',
    recommended: 'अनुशंसित (Recommended)',
    investigate: 'जांच योग्य (Investigate)',
    notApplicable: 'लागू नहीं / अनिश्चित',
    highRisk: 'उच्च जोखिम (HIGH)',
    mediumRisk: 'मध्यम जोखिम (MEDIUM)',
    lowRisk: 'निम्न जोखिम (LOW)',
    whyThisClassification: 'यह वर्गीकरण क्यों?',
    whyItMatches: 'यह मिलान क्यों करता है:',
    nextStep: 'अनुशंसित अगला कदम',
    demoNotice: 'डेमो / विश्लेषणात्मक पूर्वावलोकन',
  },
  bn: {
    appName: 'আইপি-শক্তি সহায়ক',
    subtitle: 'আয়ুর্বেদিক আইপি এবং নিয়ন্ত্রক নির্দেশিকার জন্য বহুভাষিক এআই সহকারী',
    innovationAnalyzer: 'উদ্ভাবন বিশ্লেষক (Innovation Analyzer)',
    analyzeInnovation: 'উদ্ভাবন বিশ্লেষণ করুন',
    traditionalKnowledgeDetector: 'ঐতিহ্যগত জ্ঞান শনাক্তকারী (TK Detector)',
    ipProtectionStrategy: 'আইপি সুরক্ষা কৌশল (IP Protection Strategy)',
    ipRiskCenter: 'আইপি ঝুঁকি কেন্দ্র (IP Risk Center)',
    biodiversityABSChecker: 'জীববৈচিত্র্য ও এবিএস পরীক্ষক (ABS Checker)',
    regulatoryNavigator: 'নিয়ামক নেভিগেটর (Regulatory Navigator)',
    viewEvidence: 'প্রমাণ এবং সূত্র দেখুন',
    closeEvidence: 'প্রমাণ বন্ধ করুন',
    status: 'স্থিতি',
    recommended: 'সুপারিশকৃত (Recommended)',
    investigate: 'তদন্ত করুন (Investigate)',
    notApplicable: 'প্রযোজ্য নয় / অনিশ্চিত',
    highRisk: 'উচ্চ ঝুঁকি (HIGH)',
    mediumRisk: 'মাঝারি ঝুঁকি (MEDIUM)',
    lowRisk: 'কম ঝুঁকি (LOW)',
    whyThisClassification: 'এই শ্রেণীবিভাগ কেন?',
    whyItMatches: 'কেন এটি মেলে:',
    nextStep: 'সুপারিশকৃত পরবর্তী পদক্ষেপ',
    demoNotice: 'ডেমো / বিশ্লেষণ স্তর',
  },
}
