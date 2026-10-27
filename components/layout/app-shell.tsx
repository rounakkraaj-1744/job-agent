"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState, type FormEvent, type ReactNode } from "react";
import {
  IconBriefcase,
  IconBell,
  IconBuilding,
  IconCalendarEvent,
  IconChartBar,
  IconChevronDown,
  IconCoin,
  IconFileCv,
  IconLayoutDashboard,
  IconMail,
  IconPlug,
  IconSearch,
  IconSettings,
  IconTargetArrow,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoState } from "@/components/shared/demo-state";
import { workspaceSections, type SectionId } from "@/lib/mock-data";
import { authClient } from "@/lib/auth-client";
import { ThemeToggleButton } from "@/components/shared/theme-toggle";

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
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={section.label}
        className="h-9 rounded-md px-3 text-[13px]"
      >
        <Link
          href={`/${section.id}`}
          onClick={() => {
            if (isMobile) setOpenMobile(false);
            onNavigate?.();
          }}
          aria-current={active ? "page" : undefined}
        >
          <Icon size={17} stroke={1.7} aria-hidden="true" />
          <span>{section.label}</span>
          {active ? <span className="ml-auto size-1.5 rounded-full bg-[#34758c]" /> : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const mainLinks = workspaceSections.filter(
    ({ id }) => !personalSections.has(id) && !utilitySections.has(id),
  );
  const personalLinks = workspaceSections.filter(({ id }) => personalSections.has(id));
  const utilityLinks = workspaceSections.filter(({ id }) => utilitySections.has(id));

  return (
    <nav aria-label="Main navigation" className="px-2 py-4">
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
        {mainLinks.map((section) => (
          <NavigationLink
            key={section.id}
            section={section}
            active={currentPath === section.id}
            onNavigate={onNavigate}
          />
        ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Personal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
        {personalLinks.map((section) => (
          <NavigationLink
            key={section.id}
            section={section}
            active={currentPath === section.id}
            onNavigate={onNavigate}
          />
        ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Preferences</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
        {utilityLinks.map((section) => (
          <NavigationLink
            key={section.id}
            section={section}
            active={currentPath === section.id}
            onNavigate={onNavigate}
          />
        ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </nav>
  );
}

function NavigationFallback({ onNavigate }: { onNavigate?: () => void }) {
  const mainLinks = workspaceSections.filter(
    ({ id }) => !personalSections.has(id) && !utilitySections.has(id),
  );
  const personalLinks = workspaceSections.filter(({ id }) => personalSections.has(id));
  const utilityLinks = workspaceSections.filter(({ id }) => utilitySections.has(id));

  return (
    <nav aria-label="Main navigation" className="px-2 py-4">
      <NavigationGroup label="Workspace" sections={mainLinks} onNavigate={onNavigate} />
      <NavigationGroup label="Personal" sections={personalLinks} onNavigate={onNavigate} />
      <NavigationGroup label="Preferences" sections={utilityLinks} onNavigate={onNavigate} />
    </nav>
  );
}

function NavigationGroup({
  label,
  sections,
  onNavigate,
}: {
  label: string;
  sections: typeof workspaceSections;
  onNavigate?: () => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
        {sections.map((section) => (
          <NavigationLink
            key={section.id}
            section={section}
            active={false}
            onNavigate={onNavigate}
          />
        ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function WorkspaceSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { data: session } = authClient.useSession();
  const { profile, settings, applications, contacts } = useDemoState();
  const displayName = session?.user.name || profile.name || settings.displayName;
  const headline = profile.headline;
  return (
    <div className="flex h-full flex-col">
      <SidebarHeader className="h-[68px] flex-row items-center gap-3 border-b border-[#e8ebee] px-4 py-0 group-data-[collapsible=icon]:justify-center">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-label="JobPilot dashboard"
          className="flex min-w-0 items-center gap-3"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#183f53] text-white">
            <IconBriefcase size={18} stroke={1.8} />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block text-[15px] font-semibold tracking-[-0.02em] text-[#18262e]">
              JobPilot
            </span>
            <span className="block text-[11px] text-[#7b858d]">Personal workspace</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <Suspense fallback={<NavigationFallback onNavigate={onNavigate} />}>
          <SidebarNavigation onNavigate={onNavigate} />
        </Suspense>
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
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
            {displayName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2) || "JP"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-[#25343c]">
              {displayName || "Your profile"}
            </span>
            <span className="block truncate text-[10px] text-[#77828a]">
              {headline || "Add a professional headline"}
            </span>
          </span>
          {session ? (
            <button
              type="button"
              onClick={async () => {
                await authClient.signOut();
                onNavigate?.();
              }}
              aria-label="Sign out"
              className="rounded px-2 py-1 text-[11px] font-medium text-[#31586a] hover:bg-white"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onNavigate}
              aria-label="Log in"
              className="rounded px-2 py-1 text-[11px] font-medium text-[#31586a] hover:bg-white"
            >
              Log in
            </Link>
          )}
        </div>
      </SidebarFooter>
    </div>
  );
}

function CurrentPageCrumb() {
  const pathname = usePathname();
  const current = workspaceSections.find(({ id }) => `/${id}` === pathname);
  return <span className="text-[#4d5a62]">{current?.label ?? "Workspace"}</span>;
}

export function AppShell({
  children,
  defaultSidebarOpen = true,
}: {
  children: ReactNode;
  defaultSidebarOpen?: boolean;
}) {
  const router = useRouter();
  const { profile, settings } = useDemoState();
  const displayName = profile.name || settings.displayName;
  const [query, setQuery] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded bg-background px-4 py-2 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Sidebar collapsible="icon" className="border-r border-[#e7eaed]">
        <WorkspaceSidebarContent />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-svh bg-[#f7f8f9]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center gap-2 border-b border-[#e7eaed] bg-white px-3 sm:gap-3 sm:px-6 lg:px-8">
          <SidebarTrigger aria-label="Toggle navigation" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-[#89939a]">
              JobPilot <span className="px-1 text-[#bbc2c7]">/</span>{" "}
              <Suspense fallback={<span>Workspace</span>}>
                <CurrentPageCrumb />
              </Suspense>
            </p>
            <p className="hidden text-[13px] font-semibold text-[#26343c] sm:block">
              Personal workspace
            </p>
          </div>
          <form
            onSubmit={submitSearch}
            className="hidden h-9 w-[min(31vw,300px)] items-center gap-2 rounded-md border border-[#e5e9ec] bg-[#fafbfb] px-2.5 md:flex"
          >
            <IconSearch size={16} className="shrink-0 text-[#929ba2]" />
            <Input
              aria-label="Search jobs and applications"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs, companies..."
              className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
            />
            <kbd className="rounded border border-[#e5e9ec] bg-white px-1 text-[10px] text-[#9aa3a9]">
              Enter
            </kbd>
          </form>
          <ThemeToggleButton />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative text-[#68757d]"
          >
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#34758c]" />
            <IconBell size={18} stroke={1.7} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" className="gap-2 px-1.5">
                <span className="grid size-7 place-items-center rounded-full bg-[#dce7eb] text-[10px] font-semibold text-[#31586a]">
                  {displayName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2) || "JP"}
                </span>
                <span className="hidden text-xs font-medium text-[#4d5a62] sm:inline">Account</span>
                <IconChevronDown size={14} className="text-[#89939a]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login">Log in</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1500px] px-4 py-5 outline-none sm:px-6 sm:py-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
