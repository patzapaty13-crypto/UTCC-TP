export const MOCK_INTERNSHIPS = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "Google Thailand",
    location: "Bangkok, Thailand",
    description: "Join our core Search ranking team.",
    slots: 3,
    status: "OPEN",
    createdAt: "2026-04-10T10:00:00Z"
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Agoda",
    location: "Bangkok, Thailand",
    description: "Analyze booking trends using ML.",
    slots: 2,
    status: "OPEN",
    createdAt: "2026-04-12T09:30:00Z"
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    company: "Line Man Wongnai",
    location: "Chiang Mai, Thailand",
    description: "Build Next.js web experiences.",
    slots: 5,
    status: "OPEN",
    createdAt: "2026-04-14T14:15:00Z"
  }
];

export let MOCK_APPLICATIONS = [
  {
    id: 101,
    studentId: 2,
    studentName: "Demo Student",
    internshipId: 1,
    positionTitle: "Software Engineer Intern",
    company: "Google Thailand",
    status: "REVIEWING",
    matchScore: 92,
    skillsDetected: "Java, Spring Boot, React",
    appliedAt: "2026-04-11T08:00:00Z",
    interviewScheduledAt: null,
    notes: ""
  },
  {
    id: 102,
    studentId: 2,
    studentName: "Demo Student",
    internshipId: 2,
    positionTitle: "Data Science Intern",
    company: "Agoda",
    status: "INTERVIEW_SCHEDULED",
    matchScore: 78,
    skillsDetected: "Python, SQL, Tableau",
    appliedAt: "2026-04-13T10:00:00Z",
    interviewScheduledAt: "2026-04-20T14:00:00Z",
    notes: "Please prepare a portfolio."
  }
];

// Helper to simulate network latency
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const updateMockApplicationStatus = async (id, status, interviewDate = null) => {
  await delay(800);
  const appIndex = MOCK_APPLICATIONS.findIndex(app => app.id === parseInt(id));
  if (appIndex === -1) throw new Error("Application not found");
  
  MOCK_APPLICATIONS[appIndex] = {
    ...MOCK_APPLICATIONS[appIndex],
    status,
    ...(interviewDate && { interviewScheduledAt: interviewDate })
  };
  
  return MOCK_APPLICATIONS[appIndex];
};

export const createMockApplication = async (internshipId, student) => {
  await delay(600);
  const internship = MOCK_INTERNSHIPS.find(i => i.id === parseInt(internshipId));
  const newApp = {
    id: Math.floor(Math.random() * 10000) + 200,
    studentId: student.id || 99,
    studentName: student.displayName || "Unknown Student",
    internshipId: internship.id,
    positionTitle: internship.title,
    company: internship.company,
    status: "PENDING",
    matchScore: Math.floor(Math.random() * 30) + 70, // Mock AI Match
    skillsDetected: "Next.js, Tailwind, Node.js",
    appliedAt: new Date().toISOString(),
    interviewScheduledAt: null,
    notes: ""
  };
  MOCK_APPLICATIONS.push(newApp);
  return newApp;
};
