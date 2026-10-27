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
  initialDrafts,
  initialEvents,
  initialFollowUps,
  initialJobs,
  initialProfile,
  initialResumes,
  initialSettings,
  type Application,
  type CalendarEvent,
  type Contact,
  type OutreachDraft,
  type DemoSettings,
  type FollowUp,
  type Job,
  type Profile,
  type Resume,
} from "@/lib/mock-data";

type DemoState = {
  applications: Application[];
  contacts: Contact[];
  drafts: OutreachDraft[];
  events: CalendarEvent[];
  followUps: FollowUp[];
  jobs: Job[];
  profile: Profile;
  resumes: Resume[];
  settings: DemoSettings;
};

type DemoStateContextValue = DemoState & {
  setApplications: Dispatch<SetStateAction<Application[]>>;
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  setDrafts: Dispatch<SetStateAction<OutreachDraft[]>>;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  setFollowUps: Dispatch<SetStateAction<FollowUp[]>>;
  setJobs: Dispatch<SetStateAction<Job[]>>;
  setProfile: Dispatch<SetStateAction<Profile>>;
  setResumes: Dispatch<SetStateAction<Resume[]>>;
  setSettings: Dispatch<SetStateAction<DemoSettings>>;
};

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState(initialApplications);
  const [contacts, setContacts] = useState(initialContacts);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [events, setEvents] = useState(initialEvents);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [jobs, setJobs] = useState(initialJobs);
  const [profile, setProfile] = useState(initialProfile);
  const [resumes, setResumes] = useState(initialResumes);
  const [settings, setSettings] = useState(initialSettings);

  return (
    <DemoStateContext.Provider
      value={{
        applications,
        contacts,
        drafts,
        events,
        followUps,
        jobs,
        profile,
        resumes,
        settings,
        setApplications,
        setContacts,
        setDrafts,
        setEvents,
        setFollowUps,
        setJobs,
        setProfile,
        setResumes,
        setSettings,
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
