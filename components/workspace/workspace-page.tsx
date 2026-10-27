"use client";

import dynamic from "next/dynamic";
import type { SectionId } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

const pageLoading = () => (
  <div role="status" aria-label="Loading page" className="space-y-5">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-36 rounded-lg" />
    <Skeleton className="h-72 rounded-lg" />
  </div>
);

const DashboardPage = dynamic(
  () => import("./core-pages").then((module) => module.DashboardPage),
  { loading: pageLoading },
);
const JobsPage = dynamic(
  () => import("./core-pages").then((module) => module.JobsPage),
  { loading: pageLoading },
);
const ApplicationsPage = dynamic(
  () => import("./core-pages").then((module) => module.ApplicationsPage),
  { loading: pageLoading },
);
const OutreachPage = dynamic(
  () => import("./people-pages").then((module) => module.OutreachPage),
  { loading: pageLoading },
);
const CalendarPage = dynamic(
  () => import("./people-pages").then((module) => module.CalendarPage),
  { loading: pageLoading },
);
const FollowUpsPage = dynamic(
  () => import("./people-pages").then((module) => module.FollowUpsPage),
  { loading: pageLoading },
);
const CompaniesPage = dynamic(
  () => import("./research-pages").then((module) => module.CompaniesPage),
  { loading: pageLoading },
);
const AnalyticsPage = dynamic(
  () => import("./research-pages").then((module) => module.AnalyticsPage),
  { loading: pageLoading },
);
const SalaryPage = dynamic(
  () => import("./research-pages").then((module) => module.SalaryPage),
  { loading: pageLoading },
);
const ResumesPage = dynamic(
  () => import("./account-pages").then((module) => module.ResumesPage),
  { loading: pageLoading },
);
const ProfilePage = dynamic(
  () => import("./account-pages").then((module) => module.ProfilePage),
  { loading: pageLoading },
);
const IntegrationsPage = dynamic(
  () => import("./account-pages").then((module) => module.IntegrationsPage),
  { loading: pageLoading },
);
const SettingsPage = dynamic(
  () => import("./account-pages").then((module) => module.SettingsPage),
  { loading: pageLoading },
);

export function WorkspacePage({
  section,
  searchQuery,
}: {
  section: SectionId;
  searchQuery?: string;
}) {
  switch (section) {
    case "dashboard":
      return <DashboardPage />;
    case "jobs":
      return <JobsPage key={searchQuery} initialQuery={searchQuery} />;
    case "applications":
      return <ApplicationsPage />;
    case "outreach":
      return <OutreachPage />;
    case "calendar":
      return <CalendarPage />;
    case "follow-ups":
      return <FollowUpsPage />;
    case "companies":
      return <CompaniesPage />;
    case "analytics":
      return <AnalyticsPage />;
    case "salary":
      return <SalaryPage />;
    case "resumes":
      return <ResumesPage />;
    case "profile":
      return <ProfilePage />;
    case "integrations":
      return <IntegrationsPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return null;
  }
}
