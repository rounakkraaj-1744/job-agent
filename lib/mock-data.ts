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
  employmentType: "Full-time" | "Internship";
  graduationEligibility: string;
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
  linkedinUrl?: string;
  source: string;
  jobId: string;
  contacted: string;
  status: string;
};

export type OutreachDraft = {
  id: string;
  contactId: string;
  jobId: string;
  subject: string;
  body: string;
  resumeId: string;
  updated: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  kind: "Interview" | "Recruiter call" | "Assessment" | "Follow-up" | "Reminder";
  note: string;
  durationMinutes: number;
  meetingUrl: string;
  reminder: string;
  applicationId: string;
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

export type SkillCategory =
  | "Programming languages"
  | "Backend frameworks"
  | "Databases"
  | "Cloud platforms"
  | "DevOps & infrastructure"
  | "AI & GenAI"
  | "Other skills";

export type ProfileSkill = {
  id: string;
  name: string;
  category: SkillCategory;
};

export type Profile = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  leetcode: string;
  otherLinks: string;
  targetRoles: string;
  graduationYear: string;
  monthlyMinimum: string;
  education: string;
  experience: string;
  internships: string;
  projects: string;
  skills: ProfileSkill[];
  reviewedFacts: string[];
};

export type DemoSettings = {
  displayName: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  defaultRole: string;
  targetCompensation: string;
  preferredLocations: string;
  workMode: string;
  jobSources: string;
  graduationEligibility: string;
  searchSchedule: string;
  aiProvider: string;
  minimumScore: number;
  discoveryEnabled: boolean;
  draftingEnabled: boolean;
  matchExplanations: boolean;
  reviewBeforeSubmit: boolean;
  dailyReviewLimit: number;
  dailyAiLimit: number;
  interviewReminders: boolean;
  followUpReminders: boolean;
  newMatchingJobs: boolean;
  integrationErrors: boolean;
  emailNotifications: boolean;
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
    fileName: "Backend_GenAI.pdf",
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
    fileName: "Cloud_DevOps.pdf",
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
    fileName: "Platform_Engineering.pdf",
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
    employmentType: "Full-time",
    graduationEligibility: "2025–2027 graduates",
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
    salaryMin: 1600000,
    salaryMax: 2400000,
    salaryPeriod: "year",
    currency: "INR",
    score: 89,
    experience: "Entry level",
    employmentType: "Full-time",
    graduationEligibility: "2025–2027 graduates",
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
    employmentType: "Full-time",
    graduationEligibility: "2026 graduates",
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
    employmentType: "Full-time",
    graduationEligibility: "2025–2026 graduates",
    posted: "1 week ago",
    source: "Indeed",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    missingSkills: ["Redis"],
    description: "Join a small backend team improving product APIs and engineering foundations.",
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
    employmentType: "Internship",
    graduationEligibility: "Current students and 2027 graduates",
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
    linkedinUrl: "https://linkedin.example/in/ananya-rao",
    source: "Recruiter referral",
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
    source: "Company website",
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
    source: "LinkedIn research",
    jobId: "job-cedar-ai",
    contacted: "Oct 25, 2026",
    status: "Draft",
  },
];

export const initialDrafts: OutreachDraft[] = [
  {
    id: "draft-northstar-follow-up",
    contactId: "contact-ananya",
    jobId: "job-northstar-backend",
    subject: "Following up on the Backend Engineer role",
    body: "Hi Ananya,\n\nI wanted to follow up on the Backend Engineer opportunity and confirm the interview details. Please let me know if there is anything you would like me to prepare.\n\nBest,\nYour name",
    resumeId: "resume-backend-ai",
    updated: "Oct 26, 2026",
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
    durationMinutes: 45,
    meetingUrl: "https://meet.example/northstar-interview",
    reminder: "30 minutes before",
    applicationId: "app-northstar",
  },
  {
    id: "event-cedar",
    title: "Assessment deadline",
    company: "Cedar AI",
    date: "2026-11-01",
    time: "17:00",
    kind: "Assessment",
    note: "Submit take-home assessment",
    durationMinutes: 60,
    meetingUrl: "",
    reminder: "1 day before",
    applicationId: "app-cedar",
  },
  {
    id: "event-orbit",
    title: "Recruiter follow-up",
    company: "Orbit Cloud",
    date: "2026-10-30",
    time: "14:00",
    kind: "Follow-up",
    note: "Send a short progress check-in",
    durationMinutes: 15,
    meetingUrl: "",
    reminder: "10 minutes before",
    applicationId: "app-orbit",
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
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  leetcode: "",
  otherLinks: "",
  targetRoles: "Backend Engineer, Platform Engineer, AI Engineer",
  graduationYear: "",
  monthlyMinimum: "",
  education: "",
  experience: "",
  internships: "",
  projects: "",
  skills: [],
  reviewedFacts: [],
};

export const initialSettings: DemoSettings = {
  displayName: "",
  timezone: "Asia/Kolkata",
  dateFormat: "DD MMM YYYY",
  currency: "INR",
  defaultRole: "Backend Engineer",
  targetCompensation: "",
  preferredLocations: "",
  workMode: "Any mode",
  jobSources: "",
  graduationEligibility: "Any year",
  searchSchedule: "Manual only",
  aiProvider: "Not configured",
  minimumScore: 75,
  discoveryEnabled: false,
  draftingEnabled: true,
  matchExplanations: true,
  reviewBeforeSubmit: true,
  dailyReviewLimit: 5,
  dailyAiLimit: 25,
  interviewReminders: true,
  followUpReminders: true,
  newMatchingJobs: false,
  integrationErrors: true,
  emailNotifications: false,
};
