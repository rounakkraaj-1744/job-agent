export type SectionId =
  | "dashboard"
  | "jobs"
  | "applications"
  | "outreach"
  | "calendar"
  | "follow-ups"
  | "companies"
  | "analytics"
  | "salary"
  | "resumes"
  | "profile"
  | "integrations"
  | "settings";

export type ApplicationStatus =
  | "Saved"
  | "Ready for review"
  | "Applied"
  | "Recruiter contacted"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn"
  | "Closed";

export type Job = {
  id: string;
  title: string;
  companyId: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: "month" | "year";
  currency: "INR" | "USD";
  score: number;
  experience: string;
  posted: string;
  source: string;
  skills: string[];
  missingSkills: string[];
  description: string;
  resumeId: string;
};

export type Application = {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  appliedOn: string;
  resumeId: string;
  activity: string;
  followUp: string;
  note: string;
};

export type Resume = {
  id: string;
  name: string;
  target: string;
  version: string;
  updated: string;
  fileName: string;
  fileType: "PDF";
  default: boolean;
  skills: string[];
  experience: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  companyId: string;
  email: string;
  jobId: string;
  contacted: string;
  status: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  kind: "Interview" | "Recruiter call" | "Assessment" | "Follow-up" | "Reminder";
  note: string;
};

export type FollowUp = {
  id: string;
  jobId: string;
  contactId: string;
  due: string;
  lastInteraction: string;
  action: string;
  priority: "High" | "Normal";
  completed: boolean;
};

export type Profile = {
  name: string;
  headline: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  targetRoles: string;
  graduationYear: string;
  monthlyMinimum: string;
};

export const workspaceSections: { id: SectionId; label: string }[] = [
  { id: "dashboard", label: "Overview" },
  { id: "jobs", label: "Find Jobs" },
  { id: "applications", label: "Applications" },
  { id: "outreach", label: "HR & Outreach" },
  { id: "calendar", label: "Interviews & Calendar" },
  { id: "follow-ups", label: "Follow-ups" },
  { id: "companies", label: "Companies" },
  { id: "analytics", label: "Analytics" },
  { id: "salary", label: "Salary Insights" },
  { id: "resumes", label: "Resumes" },
  { id: "profile", label: "My Profile" },
  { id: "integrations", label: "Integrations" },
  { id: "settings", label: "Settings" },
];

export const companies = [
  {
    id: "northstar",
    name: "Northstar Labs",
    initials: "NL",
    industry: "Developer tools",
    location: "Bengaluru",
    careers: "northstarlabs.example/careers",
    description:
      "A product engineering team building reliable infrastructure for modern software teams.",
  },
  {
    id: "orbit",
    name: "Orbit Cloud",
    initials: "OC",
    industry: "Cloud infrastructure",
    location: "Remote · India",
    careers: "orbitcloud.example/jobs",
    description:
      "An early-stage cloud platform company focused on making deployment workflows simpler.",
  },
  {
    id: "cedar",
    name: "Cedar AI",
    initials: "CA",
    industry: "Applied AI",
    location: "Hyderabad",
    careers: "cedarai.example/careers",
    description:
      "A small applied AI team shipping practical language-model features for business software.",
  },
  {
    id: "linearstack",
    name: "Linear Stack",
    initials: "LS",
    industry: "SaaS",
    location: "Pune",
    careers: "linearstack.example/careers",
    description:
      "A growing SaaS company investing in developer experience and dependable backend systems.",
  },
];

export const initialResumes: Resume[] = [
  {
    id: "resume-backend-ai",
    name: "Backend + GenAI",
    target: "Backend / AI Engineer",
    version: "v3",
    updated: "Oct 18, 2026",
    fileName: "Rounak_Backend_GenAI.pdf",
    fileType: "PDF",
    default: true,
    skills: ["TypeScript", "Node.js", "PostgreSQL", "Python", "LLM APIs"],
    experience: "Backend systems, API design, and applied generative AI projects.",
  },
  {
    id: "resume-cloud",
    name: "Cloud + DevOps",
    target: "Cloud / DevOps Engineer",
    version: "v2",
    updated: "Sep 30, 2026",
    fileName: "Rounak_Cloud_DevOps.pdf",
    fileType: "PDF",
    default: false,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    experience: "Infrastructure automation, cloud deployments, and observability.",
  },
  {
    id: "resume-platform",
    name: "Backend + Cloud/DevOps",
    target: "Platform Engineer",
    version: "v1",
    updated: "Sep 12, 2026",
    fileName: "Rounak_Platform.pdf",
    fileType: "PDF",
    default: false,
    skills: ["Go", "PostgreSQL", "AWS", "Docker", "Redis"],
    experience: "Platform APIs, cloud foundations, and service reliability.",
  },
];

export const initialJobs: Job[] = [
  {
    id: "job-northstar-backend",
    title: "Backend Engineer, Developer Platform",
    companyId: "northstar",
    location: "Bengaluru, India",
    mode: "Hybrid",
    salaryMin: 120000,
    salaryMax: 180000,
    salaryPeriod: "month",
    currency: "INR",
    score: 94,
    experience: "0–2 years",
    posted: "2 days ago",
    source: "Wellfound",
    skills: ["TypeScript", "Node.js", "PostgreSQL", "AWS"],
    missingSkills: ["Kafka"],
    description:
      "Build APIs and internal platform services that help product teams ship safely. You will work closely with infrastructure and application engineers.",
    resumeId: "resume-backend-ai",
  },
  {
    id: "job-orbit-cloud",
    title: "Cloud Platform Engineer",
    companyId: "orbit",
    location: "Remote, India",
    mode: "Remote",
    salaryMin: 16,
    salaryMax: 24,
    salaryPeriod: "year",
    currency: "INR",
    score: 89,
    experience: "Entry level",
    posted: "Yesterday",
    source: "Company careers",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes"],
    missingSkills: ["GCP"],
    description:
      "Contribute to cloud automation and deployment tooling across a distributed engineering team.",
    resumeId: "resume-cloud",
  },
  {
    id: "job-cedar-ai",
    title: "Software Engineer, AI Products",
    companyId: "cedar",
    location: "Hyderabad, India",
    mode: "On-site",
    salaryMin: 100000,
    salaryMax: 150000,
    salaryPeriod: "month",
    currency: "INR",
    score: 86,
    experience: "0–1 years",
    posted: "4 days ago",
    source: "Cutshort",
    skills: ["Python", "FastAPI", "PostgreSQL", "LLM APIs"],
    missingSkills: ["Vector search"],
    description:
      "Ship customer-facing AI workflows with a focus on quality, observability, and clear product outcomes.",
    resumeId: "resume-backend-ai",
  },
  {
    id: "job-linearstack-api",
    title: "Associate Backend Developer",
    companyId: "linearstack",
    location: "Pune, India",
    mode: "Hybrid",
    salaryMin: 90000,
    salaryMax: 130000,
    salaryPeriod: "month",
    currency: "INR",
    score: 82,
    experience: "Graduate",
    posted: "1 week ago",
    source: "Indeed",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    missingSkills: ["Redis"],
    description:
      "Join a small backend team improving product APIs and engineering foundations.",
    resumeId: "resume-platform",
  },
  {
    id: "job-northstar-intern",
    title: "Platform Engineering Intern",
    companyId: "northstar",
    location: "Bengaluru, India",
    mode: "Hybrid",
    salaryMin: 45000,
    salaryMax: 65000,
    salaryPeriod: "month",
    currency: "INR",
    score: 78,
    experience: "Internship",
    posted: "5 days ago",
    source: "Naukri",
    skills: ["Python", "Linux", "Docker", "Git"],
    missingSkills: ["Kubernetes"],
    description:
      "Support platform engineers with internal tooling, automation, and service operations.",
    resumeId: "resume-cloud",
  },
];

export const initialApplications: Application[] = [
  {
    id: "app-northstar",
    jobId: "job-northstar-backend",
    status: "Interview",
    appliedOn: "Oct 18, 2026",
    resumeId: "resume-backend-ai",
    activity: "Technical interview scheduled",
    followUp: "Oct 30, 2026",
    note: "Prepare a concise walkthrough of the platform API project.",
  },
  {
    id: "app-orbit",
    jobId: "job-orbit-cloud",
    status: "Applied",
    appliedOn: "Oct 21, 2026",
    resumeId: "resume-cloud",
    activity: "Application reviewed",
    followUp: "Oct 29, 2026",
    note: "Highlight Terraform and deployment automation experience.",
  },
  {
    id: "app-cedar",
    jobId: "job-cedar-ai",
    status: "Assessment",
    appliedOn: "Oct 23, 2026",
    resumeId: "resume-backend-ai",
    activity: "Take-home assessment received",
    followUp: "Nov 1, 2026",
    note: "Assessment due in one week.",
  },
  {
    id: "app-linearstack",
    jobId: "job-linearstack-api",
    status: "Ready for review",
    appliedOn: "Oct 26, 2026",
    resumeId: "resume-platform",
    activity: "Resume selected for review",
    followUp: "Nov 2, 2026",
    note: "Review role requirements before confirming application.",
  },
];

export const initialContacts: Contact[] = [
  {
    id: "contact-ananya",
    name: "Ananya Rao",
    role: "Technical Recruiter",
    companyId: "northstar",
    email: "ananya@northstarlabs.example",
    jobId: "job-northstar-backend",
    contacted: "Oct 20, 2026",
    status: "Replied",
  },
  {
    id: "contact-rohan",
    name: "Rohan Mehta",
    role: "Engineering Manager",
    companyId: "orbit",
    email: "rohan@orbitcloud.example",
    jobId: "job-orbit-cloud",
    contacted: "Oct 22, 2026",
    status: "Awaiting reply",
  },
  {
    id: "contact-meera",
    name: "Meera Shah",
    role: "People Partner",
    companyId: "cedar",
    email: "meera@cedarai.example",
    jobId: "job-cedar-ai",
    contacted: "Oct 25, 2026",
    status: "Draft",
  },
];

export const initialEvents: CalendarEvent[] = [
  {
    id: "event-northstar",
    title: "Technical interview",
    company: "Northstar Labs",
    date: "2026-10-29",
    time: "10:30",
    kind: "Interview",
    note: "Video call · Backend Engineer",
  },
  {
    id: "event-cedar",
    title: "Assessment deadline",
    company: "Cedar AI",
    date: "2026-11-01",
    time: "17:00",
    kind: "Assessment",
    note: "Submit take-home assessment",
  },
  {
    id: "event-orbit",
    title: "Recruiter follow-up",
    company: "Orbit Cloud",
    date: "2026-10-30",
    time: "14:00",
    kind: "Follow-up",
    note: "Send a short progress check-in",
  },
];

export const initialFollowUps: FollowUp[] = [
  {
    id: "follow-northstar",
    jobId: "job-northstar-backend",
    contactId: "contact-ananya",
    due: "2026-10-28",
    lastInteraction: "Interview scheduled · Oct 24",
    action: "Confirm interview details and ask about the format.",
    priority: "High",
    completed: false,
  },
  {
    id: "follow-orbit",
    jobId: "job-orbit-cloud",
    contactId: "contact-rohan",
    due: "2026-10-29",
    lastInteraction: "Application reviewed · Oct 25",
    action: "Share a brief note about your Terraform experience.",
    priority: "Normal",
    completed: false,
  },
  {
    id: "follow-cedar",
    jobId: "job-cedar-ai",
    contactId: "contact-meera",
    due: "2026-10-24",
    lastInteraction: "Outreach draft created · Oct 22",
    action: "Check whether the team can clarify assessment expectations.",
    priority: "Normal",
    completed: false,
  },
];

export const initialProfile: Profile = {
  name: "Rounak Kumar",
  headline: "Software Engineer · Backend & Cloud",
  email: "rounak@example.com",
  location: "Bengaluru, India",
  linkedin: "linkedin.com/in/rounakkumar",
  github: "github.com/rounakkumar",
  targetRoles: "Backend Engineer, Platform Engineer, AI Engineer",
  graduationYear: "2026",
  monthlyMinimum: "90000",
};
