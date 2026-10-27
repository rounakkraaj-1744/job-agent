"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendarEvent,
  IconChartBar,
  IconChevronDown,
  IconCoin,
  IconFileCv,
  IconLayoutDashboard,
  IconMail,
  IconMenu2,
  IconPlug,
  IconSearch,
  IconSettings,
  IconTargetArrow,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useDemoState } from "@/components/shared/demo-state";
import { workspaceSections, type SectionId } from "@/lib/mock-data";

const iconBySection = {
  dashboard: IconLayoutDashboard,
  jobs: IconSearch,
  applications: IconBriefcase,
  outreach: IconMail,
  calendar: IconCalendarEvent,
  "follow-ups": IconTargetArrow,
  companies: IconBuilding,
  analytics: IconChartBar,
  salary: IconCoin,
  resumes: IconFileCv,
  profile: IconUsers,
  integrations: IconPlug,
  settings: IconSettings,
} satisfies Record<SectionId, typeof IconBriefcase>;

const personalSections = new Set<SectionId>(["resumes", "profile"]);
const utilitySections = new Set<SectionId>(["integrations", "settings"]);

function NavigationLink({
  section,
  active,
  onNavigate,
}: {
  section: (typeof workspaceSections)[number];
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = iconBySection[section.id];

  return (
    <Link
      href={`/${section.id}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex h-9 items-center gap-3 rounded-md px-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        active
          ? "bg-[#eaf0f4] font-semibold text-[#183f53]"
          : "text-[#606b74] hover:bg-[#f1f3f5] hover:text-[#17232b]"
      }`}
    >
      <Icon size={17} stroke={1.7} aria-hidden="true" />
      <span>{section.label}</span>
      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#34758c]" /> : null}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { profile, applications, contacts } = useDemoState();
  const currentPath = pathname.split("/")[1] as SectionId;
  const mainLinks = workspaceSections.filter(
    ({ id }) => !personalSections.has(id) && !utilitySections.has(id),
  );
  const personalLinks = workspaceSections.filter(({ id }) =>
    personalSections.has(id),
  );
  const utilityLinks = workspaceSections.filter(({ id }) =>
    utilitySections.has(id),
  );

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex h-[68px] items-center gap-3 border-b border-[#e8ebee] px-5"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-[#183f53] text-white">
          <IconBriefcase size={18} stroke={1.8} />
        </span>
        <span>
          <span className="block text-[15px] font-semibold tracking-[-0.02em] text-[#18262e]">
            JobPilot
          </span>
          <span className="block text-[11px] text-[#7b858d]">Personal workspace</span>
        </span>
      </Link>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#929ba2]">
          Workspace
        </p>
        <div className="space-y-1">
          {mainLinks.map((section) => (
            <NavigationLink
              key={section.id}
              section={section}
              active={currentPath === section.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#929ba2]">
          Personal
        </p>
        <div className="space-y-1">
          {personalLinks.map((section) => (
            <NavigationLink
              key={section.id}
              section={section}
              active={currentPath === section.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#929ba2]">
          Preferences
        </p>
        <div className="space-y-1">
          {utilityLinks.map((section) => (
            <NavigationLink
              key={section.id}
              section={section}
              active={currentPath === section.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-[#e8ebee] p-3">
        <div className="mb-3 grid grid-cols-2 gap-2 px-2 text-[11px]">
          <div>
            <span className="block text-[#879199]">Active applications</span>
            <span className="font-semibold text-[#26343c]">{applications.length}</span>
          </div>
          <div>
            <span className="block text-[#879199]">Contacts</span>
            <span className="font-semibold text-[#26343c]">{contacts.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-md bg-[#f3f5f6] p-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#dce7eb] text-xs font-semibold text-[#31586a]">
            {profile.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#25343c]">
              {profile.name}
            </span>
            <span className="block truncate text-[10px] text-[#77828a]">
              {profile.headline}
            </span>
          </span>
          <Link
            href="/login"
            onClick={onNavigate}
            aria-label="Log in"
            className="rounded px-2 py-1 text-[11px] font-medium text-[#31586a] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = workspaceSections.find(
    ({ id }) => `/${id}` === pathname,
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="min-h-screen bg-[#f7f8f9] text-[#202b32]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] border-r border-[#e7eaed] bg-white lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(84vw,300px)] border-r border-[#e7eaed] bg-white shadow-xl">
            <div className="absolute right-2 top-4 z-10">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
              >
                <IconX size={18} />
              </Button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="min-h-screen lg:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center gap-3 border-b border-[#e7eaed] bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <IconMenu2 size={19} />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-[#89939a]">
              JobPilot <span className="px-1 text-[#bbc2c7]">/</span>{" "}
              <span className="text-[#4d5a62]">{current?.label ?? "Workspace"}</span>
            </p>
            <p className="hidden text-[13px] font-semibold text-[#26343c] sm:block">
              {current?.label ?? "Workspace"}
            </p>
          </div>
          <form
            onSubmit={submitSearch}
            className="hidden h-9 w-[min(31vw,300px)] items-center gap-2 rounded-md border border-[#e5e9ec] bg-[#fafbfb] px-2.5 md:flex"
          >
            <IconSearch size={16} className="shrink-0 text-[#929ba2]" />
            <input
              aria-label="Search jobs and applications"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs, companies..."
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#9aa3a9]"
            />
            <kbd className="rounded border border-[#e5e9ec] bg-white px-1 text-[10px] text-[#9aa3a9]">
              ↵
            </kbd>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative text-[#68757d]"
          >
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#34758c]" />
            <IconMail size={18} stroke={1.7} />
          </Button>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              className="gap-2 px-1.5"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="grid size-7 place-items-center rounded-full bg-[#dce7eb] text-[10px] font-semibold text-[#31586a]">
                RK
              </span>
              <span className="hidden text-xs font-medium text-[#4d5a62] sm:inline">
                Account
              </span>
              <IconChevronDown size={14} className="text-[#89939a]" />
            </Button>
            {profileOpen ? (
              <div className="absolute right-0 top-11 z-30 w-44 rounded-lg border border-[#e5e9ec] bg-white p-1.5 shadow-lg">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded px-2.5 py-2 text-xs text-[#35434a] hover:bg-[#f4f6f7]"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded px-2.5 py-2 text-xs text-[#35434a] hover:bg-[#f4f6f7]"
                >
                  Settings
                </Link>
                <Link
                  href="/login"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded px-2.5 py-2 text-xs text-[#35434a] hover:bg-[#f4f6f7]"
                >
                  Log in
                </Link>
              </div>
            ) : null}
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
