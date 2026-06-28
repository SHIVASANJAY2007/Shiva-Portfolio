/**
 * Resume/Content Data
 * Extract from PDF for use throughout the application
 */

export const resumeData = {
  personal: {
    name: 'Shiva Sanjay N D',
    title: 'Fresher',
    email: 'sanjudragon2007@gmail.com',
    phone: '+91 7373382999',
    location: 'ERODE',
    summary:
      'Tech-driven individual with strong foundations in programming languages and hands-on experience in web development and building practical digital solutions. Familiar with Odoo, Salesforce (CRM basics), cybersecurity fundamentals, prompt engineering, and workflow automation using n8n. Active state-level Kho Kho player demonstrating leadership, discipline, and strong team collaboration skills. Passionate about innovation, problem-solving, and continuous professional growth.',
  },
  profiles: {
    github: 'https://github.com/Shiva_Sanjay',
    linkedin: 'https://linkedin.com/in/shiva-sanjay-n-d',
  },
  education: [
    {
      institution: 'Kongu engineering college, Perundurai',
      degree: 'B.Sc Information Systems',
      status: 'Pursuing',
      score: '8.74 CGPA',
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
  ],
  skills: {
    programming: [
      { name: 'Java', level: 3 },
      { name: 'C', level: 2 },
      { name: 'Python', level: 2 },
      { name: 'n8n', level: 2 },
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
      title: 'Prize-winning Project Lead',
      organization: 'Kongu Engineering College',
      focus: 'Fitlee - NFT Fitness Platform',
      achievements: ['1st Prize in POC', 'Dept. HOD Recognition'],
    },
    {
      title: 'Team Lead',
      organization: 'Xenovex Technologies',
      focus: 'Zyvox AI - Travel Assistant',
      achievements: ['Xackathon 2k25 Winner', 'WhatsApp Bot Deployment'],
    },
    {
      title: 'Marketing Event Champion',
      organization: 'Xenovex Technologies',
      focus: 'Back-to-back marketing victories',
      achievements: ['2 consecutive wins', 'Team leadership'],
    },
  ],
  awards: [
    {
      title: '1st Prize in POC',
      organization: 'Kongu Engineering College',
      project: 'Fitlee',
      date: '2025',
    },
    {
      title: 'Department HOD Award',
      organization: 'Kongu Engineering College',
      date: '2025',
    },
    {
      title: 'Xackathon 2k25 Winner',
      organization: 'Xenovex Technologies',
      project: 'Zyvox AI',
      date: '2025',
    },
    {
      title: 'Marketing Event Winner',
      organization: 'Xenovex Technologies',
      achievement: 'Back-to-back victories',
      date: '2025',
    },
    {
      title: 'State-Level Kho Kho Champion',
      achievement: 'Multiple tournament victories',
    },
  ],
  interests: ['Playing Kho Kho', 'Innovation', 'Problem-solving', 'Web Development'],
  languages: [
    { name: 'Tamil', level: 5 },
    { name: 'English', level: 3 },
  ],
};

export default resumeData;
