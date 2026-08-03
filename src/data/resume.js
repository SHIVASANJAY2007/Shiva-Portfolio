/**
 * Resume/Content Data
 * Extract from PDF for use throughout the application
 */

export const resumeData = {
  personal: {
    name: 'Shiva Sanjay N D',
    title: 'Fresher, AI & Web Developer, Technical and Non-Technical Trainer',
    email: 'shivasanjay9255@gmail.com',
    phone: '+91 7373382999',
    location: 'Perundurai, Tamilnadu, India',
    summary:
      'What drives me is building solutions that work in the real world. I have a strong foundation in programming and web development, with knowledge of Odoo, Salesforce (CRM), n8n workflows, and Cybersecurity. I enjoy exploring emerging technologies to build practical, user-focused solutions. Beyond development, I stay consistent with fitness and Kho Kho, where I actively lead a team, strengthening leadership, discipline, and teamwork.',
  },
  profiles: {
    github: 'https://github.com/SHIVASANJAY2007/',
    linkedin: 'https://www.linkedin.com/in/shiva-sanjay-610512320/',
    portfolio: 'https://shivasanjay.vercel.app/',
    instagram: 'https://www.instagram.com/',
  },
  education: [
    {
      institution: 'Kongu engineering college, Perundurai',
      degree: 'B.Sc Information Systems',
      status: 'Pursuing',
      score: '8.54 CGPA',
    },
    {
      institution: 'Kongu vellaler matriculation higher secondary school, Perundurai',
      program: 'He. Sec - CS-Maths',
      score: '82%',
      date: 'March 2024',
    },
    {
      institution: 'Kongu vellaler matriculation higher secondary school, Perundurai',
      program: 'SSLC',
      score: '83.4',
      date: 'May 2022',
    },
  ],
  projects: [
    {
      id: 'fitlee',
      name: 'Fitlee',
      image: '/projects/fitlee.webp',
      year: 2025,
      description:
        'Prize-winning fitness web application featuring an NFT-based reward system to gamify user engagement and milestone tracking. Integrated an AI chatbot for interactive fitness guidance and enhanced user experience. Designed with a focus on usability, innovation, and practical implementation.',
      highlights: [
        'NFT-based reward system',
        'AI fitness chatbot',
        'Gamified milestones',
        '1st Prize in POC',
      ],
    },
    {
      id: 'zyvox',
      name: 'Zyvox AI',
      image: '/projects/zyvox.webp',
      year: 2025,
      description:
        'Team-developed AI travel assistant built using n8n to automate personalized trip planning workflows. Deployed as a WhatsApp Business bot to provide users with real-time travel suggestions and itinerary generation.',
      highlights: [
        'n8n workflow automation',
        'WhatsApp Business integration',
        'Real-time itinerary generation',
        'Xackathon 2k25 Winner',
      ],
    },
    {
      id: 'fade',
      name: 'FADE',
      image: '/projects/fade.webp',
      year: 2025,
      description:
        'Instagram Fake Account Detection Engine with advanced ML algorithms and immersive 3D UI. Features cyberpunk-inspired visual effects with glitch animations, real-time risk scoring, and profile authenticity analysis. Combines cutting-edge frontend technology with security intelligence for safer social media navigation.',
      highlights: [
        'ML-BASED DETECTION ENGINE',
        '3D GLITCH ANIMATIONS',
        '97%+ ACCURACY'
      ]
    },
    {
      id: 'verishield',
      name: 'VeriShield',
      image: '/projects/verishield.webp',
      year: 2025,
      description:
        'High-throughput AI misinformation detection pipeline processing 2,100+ posts per minute with 97% accuracy. Integrates Google Fact Check Tools API with intelligent claim extraction, semantic analysis, and proprietary FakeMeter™ risk assessment. Glassmorphic premium UI for real-time monitoring and vernacular news sanitization.',
      highlights: [
        'AI-POWERED PIPELINE',
        'GOOGLE FACT CHECK API',
        'REAL-TIME MONITORING'
      ]
    },
    {
      id: 'studymate',
      name: 'StudyMate',
      image: '/projects/studymate.webp',
      year: 2025,
      description:
        'AI-powered academic assistant revolutionizing learning through intelligent tutoring and personalized study guidance. Combines machine learning with educational technology to provide adaptive learning paths, real-time assistance, and comprehensive academic support for students.',
      highlights: [
        'AI ACADEMIC ASSISTANT',
        'ADAPTIVE LEARNING',
        'INTELLIGENT TUTORING'
      ]
    },
    {
      id: 'gojo-lens',
      name: 'GOJO SNAPCHAT LENS',
      image: '/projects/gojo.webp',
      year: 2025,
      description:
        'Immersive Augmented Reality face filter lens inspired by Jujutsu Kaisen\'s Gojo Satoru. Features advanced shader effects, head mesh deformation, face mask integration, and real-time rendering. Cross-platform compatible with dynamic visual effects using Snap Lens Studio for mobile and web.',
      highlights: [
        'AR FACE FILTER',
        'CUSTOM SHADERS',
        'REAL-TIME RENDERING'
      ]
    },
    {
      id: 'ingres',
      name: 'INGRES',
      image: '/projects/ingres.webp',
      year: 2026,
      description:
        'Modern TypeScript-based web application built with cutting-edge development practices. Features rapid development setup, modular architecture, and optimized build configuration using Vite. Designed for scalability and maintainability with TypeScript type safety.',
      highlights: [
        'TYPESCRIPT ARCHITECTURE',
        'VITE BUILD TOOL',
        'MODULAR DESIGN'
      ]
    }
  ],
  skills: {
    programming: [
      { name: 'Java', level: 4 },
      { name: 'Full Stack Dev', level: 4 },
      { name: 'C', level: 3 },
      { name: 'Python', level: 3 },
      { name: 'n8n', level: 2 },
      { name: 'Salesforce', level: 2 },
    ],
    other: [
      'Odoo',
      'Salesforce (CRM)',
      'Cybersecurity Fundamentals',
      'Prompt Engineering',
      'Workflow Automation',
    ],
  },
  experience: [
    {
      title: 'Class Representative',
      organization: 'Kongu Engineering College',
      period: '2024',
      location: 'Erode'
    },
    {
      title: 'Kho Kho Team Captain',
      organization: 'Kongu Engineering College',
      period: '2024',
      location: 'Erode'
    },
    {
      title: 'Association Joint Secretary',
      organization: 'Kongu Engineering College',
      period: '2025',
      location: 'Erode'
    },
    {
      title: 'Intern',
      organization: 'Xenovex Technologies',
      period: '2026',
      location: 'Chennai (1 Month)'
    }
  ],
  awards: [
    {
      title: 'Winners in Kho Kho',
      organization: 'Colleges around Tamilnadu',
      achievement: 'Multiple Winners in State Level Tournaments',
      date: '2024-2027'
    },
    {
      title: 'Proof of Concept (1st Prize)',
      organization: 'Dept. HOD / Kongu Engineering College',
      project: 'Fitlee',
      date: '2025'
    },
    {
      title: 'Xackathon-2025 Winner',
      organization: 'Xenovex Technologies',
      project: 'Zyvox AI',
      date: '2025'
    },
    {
      title: 'Winners in Marketing Events',
      organization: 'KEC Faculty',
      achievement: 'Back-to-back victories',
      date: '2025'
    },
    {
      title: 'Java Certified Foundations Associate',
      organization: 'Oracle',
      date: '2026'
    }
  ],
  interests: [
    'Fitness and Sports',
    'Cybersecurity',
    'Indie Game Testing',
    'Notion & Note Making',
    'Mentoring & Coaching',
    'Playing Kho Kho',
  ],
  languages: [
    { name: 'Tamil', level: 5 },
    { name: 'English', level: 4 },
  ],
};

export default resumeData;
