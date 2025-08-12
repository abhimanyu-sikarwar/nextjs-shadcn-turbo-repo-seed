import i18next from "i18next";
// import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      common: {
        loading: "Loading...",
        error: "Error occurred",
        search: "Search",
        filters: "Filters",
        apply: "Apply",
        reset: "Reset",
        view: "View",
        download: "Download",
        share: "Share",

        // Help section
        help: {
          title: "Need Help?",
          description:
            "Our support team is available 24/7 to assist you with any queries",
          faq: "FAQs",
          contact: "Contact Support",
        },
        helpButton: "Contact Helpdesk",

        // Common
        accessService: "Access Service",
        learnMore: "Learn More",

        lastUpdated: "Last Updated",
        status: "Status",
        category: "Category",
        progress: "Progress",
        completed: "Completed",
        inProgress: "In Progress",
        pending: "Pending",
        viewMore: "View More",
        success: "Success",
        trending: "Trending",
      },
      candidate: {
        details: "Candidate Details",
        name: "Name",
        party: "Party",
        constituency: "Constituency",
        state: "State",
        status: "Status",
      },
      affidavits: {
        summary: "Summary",
        views: "Views",
        downloads: "Downloads",
        lastUpdated: "Last updated",
        allDocuments: "All documents",
        document: "Document",
        uploaded: "Uploaded",
        fileSize: "File size",
        format: "Format",
        verified: "Verified",
        types: {
          "Primary Affidavit": "Primary Affidavit",
          "Supplementary Affidavit": "Supplementary Affidavit",
        },
      },
      landing: {
        // Hero section
        title: "Your One-Stop Voter Services Portal",
        subtitle:
          "Access all electoral services, check your registration, and stay informed about elections",
        registerButton: "Register Now",

        // Service sections
        mainServices: "Main Services",
        additionalServices: "Additional Services",
        politicalDirectory: "Political Directory",

        // Voter services
        voterServices: {
          registration: {
            title: "Voter Registration",
            description:
              "Register as a new voter or modify your existing details",
          },
          searchRoll: {
            title: "Search Electoral Roll",
            description: "Check your name and details in the electoral roll",
          },
          epic: {
            title: "Download e-EPIC",
            description: "Get your digital Voter ID card instantly",
          },
          pollingStation: {
            title: "Find Polling Station",
            description: "Locate your polling booth and get directions",
          },
        },

        // Other services
        otherServices: {
          complaints: {
            title: "File Complaint",
            description: "Register electoral complaints or suggestions",
          },
          electionOffice: {
            title: "Election Office",
            description: "Contact your local election officials",
          },
          education: {
            title: "Voter Education",
            description: "Learn about the electoral process",
          },
          updates: {
            title: "Election Updates",
            description: "Get latest election news and schedules",
          },
        },
      },
      leadership: {
        title: "Leadership Overview",
        description: "Key party leaders and management",
        topLeadership: "Top Leadership",
        risingStars: "Rising Stars",
        mostPopular: "Most Popular",
        approval: "Approval",
        years: "years",
      },

      // Election Performance
      electoral: {
        title: "Election Performance",
        description: "Comprehensive electoral performance across all levels",
        totalSeats: "Total Seats",
        voteShare: "Vote Share",
        states: "States",
        localBodies: "Local Bodies",
        national: "National (Lok Sabha)",
        stateAssemblies: "State Assemblies",
        municipal: "Municipal Bodies",
        panchayat: "Panchayat Raj",
        seatConversion: "Seat Conversion Rate",
        victoryMargin: "Average Victory Margin",
      },

      // Manifesto Progress
      manifesto: {
        title: "Manifesto Progress",
        description: "Current term promises and their implementation status",
        allProjects: "All Projects",
        nationwide: "Nationwide",
        stateLevel: "State-level",
        local: "Local",
        timeline: "Timeline",
        budget: "Budget",
        beneficiaries: "Beneficiaries",
        impact: "Impact",
        tendersAwarded: "Tenders Awarded",
        totalBudget: "Total Budget",
        overallProgress: "Overall Progress",
      },
    },
  },
  hi: {
    translation: {
      common: {
        loading: "लोड हो रहा है...",
        error: "त्रुटि हुई",
        search: "खोजें",
        filters: "फ़िल्टर",
        apply: "लागू करें",
        reset: "रीसेट",
        view: "देखें",
        download: "डाउनलोड",
        share: "साझा करें",

        help: {
          title: "सहायता चाहिए?",
          description: "हमारी सहायता टीम किसी भी प्रश्न के लिए 24/7 उपलब्ध है",
          faq: "सामान्य प्रश्न",
          contact: "सहायता से संपर्क करें",
        },

        helpButton: "हेल्पडेस्क से संपर्क करें",
        accessService: "सेवा का उपयोग करें",
        learnMore: "और जानें",
      },
      candidate: {
        details: "उम्मीदवार विवरण",
        name: "नाम",
        party: "पार्टी",
        constituency: "निर्वाचन क्षेत्र",
        state: "राज्य",
        status: "स्थिति",
      },
      affidavits: {
        summary: "सारांश",
        views: "दृश्य",
        downloads: "डाउनलोड",
        lastUpdated: "अंतिम अपडेट",
        allDocuments: "सभी दस्तावेज़",
        document: "दस्तावेज़",
        uploaded: "अपलोड किया गया",
        fileSize: "फ़ाइल का आकार",
        format: "स्वरूप",
        verified: "सत्यापित",
        types: {
          "Primary Affidavit": "प्राथमिक घोषणापत्र",
          "Supplementary Affidavit": "पूरक घोषणापत्र",
        },
      },
      landing: {
        title: "आपका वन-स्टॉप मतदाता सेवा पोर्टल",
        subtitle:
          "सभी चुनावी सेवाओं का उपयोग करें, अपना पंजीकरण जांचें, और चुनावों के बारे में जानकारी प्राप्त करें",
        registerButton: "अभी पंजीकरण करें",

        mainServices: "मुख्य सेवाएं",
        additionalServices: "अतिरिक्त सेवाएं",

        voterServices: {
          registration: {
            title: "मतदाता पंजीकरण",
            description:
              "नए मतदाता के रूप में पंजीकरण करें या अपने मौजूदा विवरण में संशोधन करें",
          },
          searchRoll: {
            title: "मतदाता सूची में खोजें",
            description: "मतदाता सूची में अपना नाम और विवरण देखें",
          },
          epic: {
            title: "ई-एपिक डाउनलोड करें",
            description: "अपना डिजिटल मतदाता पहचान पत्र तुरंत प्राप्त करें",
          },
          pollingStation: {
            title: "मतदान केंद्र खोजें",
            description:
              "अपने मतदान केंद्र का पता लगाएं और दिशा-निर्देश प्राप्त करें",
          },
        },

        otherServices: {
          complaints: {
            title: "शिकायत दर्ज करें",
            description: "चुनावी शिकायतें या सुझाव दर्ज करें",
          },
          electionOffice: {
            title: "चुनाव कार्यालय",
            description: "अपने स्थानीय चुनाव अधिकारियों से संपर्क करें",
          },
          education: {
            title: "मतदाता शिक्षा",
            description: "चुनावी प्रक्रिया के बारे में जानें",
          },
          updates: {
            title: "चुनाव अपडेट",
            description: "नवीनतम चुनाव समाचार और कार्यक्रम प्राप्त करें",
          },
        },
      },
      leadership: {
        title: "नेतृत्व अवलोकन",
        description: "प्रमुख पार्टी नेता और प्रबंधन",
        topLeadership: "शीर्ष नेतृत्व",
        risingStars: "उभरते सितारे",
        mostPopular: "सबसे लोकप्रिय",
        approval: "स्वीकृति",
        years: "वर्ष",
      },
    },
  },
  mr: {
    translation: {
      common: {
        loading: "लोड होत आहे...",
        error: "त्रुटी आली",
        search: "शोधा",
        filters: "फिल्टर्स",
        apply: "लागू करा",
        reset: "रीसेट",
        view: "पहा",
        download: "डाउनलोड",
        share: "शेअर करा",
      },
      candidate: {
        details: "उमेदवार तपशील",
        name: "नाव",
        party: "पक्ष",
        constituency: "मतदारसंघ",
        state: "राज्य",
        status: "स्थिती",
      },
      affidavits: {
        summary: "सारांश",
        views: "दृश्य",
        downloads: "डाउनलोड",
        lastUpdated: "अंतिम अपडेट",
        allDocuments: "सर्व दस्तऐवज",
        document: "दस्तऐवज",
        uploaded: "अपलोड केले",
        fileSize: "फाइल का आकार",
        format: "स्वरूप",
        verified: "सत्यापित",
        types: {
          "Primary Affidavit": "प्राथमिक घोषणापत्र",
          "Supplementary Affidavit": "पूरक घोषणापत्र",
        },
      },
      leadership: {
        title: "नेतृत्व आढावा",
        description: "प्रमुख पक्षनेते आणि व्यवस्थापन",
        topLeadership: "शीर्ष नेतृत्व",
        risingStars: "उदयोन्मुख तारे",
        mostPopular: "सर्वाधिक लोकप्रिय",
        approval: "मान्यता",
        years: "वर्षे",
      },
    },
  },
};

export const i18nResources = resources;

i18next
  .use(LanguageDetector)
  // .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18next;
