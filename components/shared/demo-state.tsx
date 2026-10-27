"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  initialApplications,
  initialContacts,
  initialEvents,
  initialFollowUps,
  initialJobs,
  initialProfile,
  initialResumes,
  type Application,
  type CalendarEvent,
  type Contact,
  type FollowUp,
  type Job,
  type Profile,
  type Resume,
} from "@/lib/mock-data";

type DemoState = {
  applications: Application[];
  contacts: Contact[];
  events: CalendarEvent[];
  followUps: FollowUp[];
  jobs: Job[];
  profile: Profile;
  resumes: Resume[];
};

type DemoStateContextValue = DemoState & {
  setApplications: Dispatch<SetStateAction<Application[]>>;
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  setFollowUps: Dispatch<SetStateAction<FollowUp[]>>;
  setJobs: Dispatch<SetStateAction<Job[]>>;
  setProfile: Dispatch<SetStateAction<Profile>>;
  setResumes: Dispatch<SetStateAction<Resume[]>>;
};

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState(initialApplications);
  const [contacts, setContacts] = useState(initialContacts);
  const [events, setEvents] = useState(initialEvents);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [jobs, setJobs] = useState(initialJobs);
  const [profile, setProfile] = useState(initialProfile);
  const [resumes, setResumes] = useState(initialResumes);

  return (
    <DemoStateContext.Provider
      value={{
        applications,
        contacts,
        events,
        followUps,
        jobs,
        profile,
        resumes,
        setApplications,
        setContacts,
        setEvents,
        setFollowUps,
        setJobs,
        setProfile,
        setResumes,
      }}
    >
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState() {
  const value = useContext(DemoStateContext);

  if (!value) {
    throw new Error("useDemoState must be used inside DemoStateProvider.");
  }

  return value;
}
