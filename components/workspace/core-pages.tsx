"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBriefcase,
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconFileCv,
  IconFilter,
  IconPlus,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useDemoState } from "@/components/shared/demo-state";
import {
  companies,
  type Application,
  type ApplicationStatus,
  type Job,
  type Resume,
} from "@/lib/mock-data";
import {
  CompanyMark,
  controlClass,
  EmptyState,
  Field,
  Modal,
  Notice,
  PageTitle,
  Panel,
  StatusBadge,
} from "./primitives";

const formatSalary = (job: Job) => {
  const currency = job.currency === "INR" ? "₹" : "$";
  const start = `${currency}${(job.salaryMin / 1000).toLocaleString("en-IN")}k`;
  const end = `${currency}${(job.salaryMax / 1000).toLocaleString("en-IN")}k`;
  return `${start}–${end} / ${job.salaryPeriod === "month" ? "mo" : "yr"}`;
};

function companyFor(id: string) {
  return companies.find((company) => company.id === id);
}

function Metric({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0 border-r border-[#e8ecee] px-4 py-4 last:border-r-0 sm:px-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-[#77838a]">{label}</p>
        <span className="text-[#82939b]">{icon}</span>
      </div>
      <p className="mt-2 text-[25px] font-semibold tracking-[-0.04em] text-[#21323b]">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-[#89949a]">{note}</p>
    </div>
  );
}

export function DashboardPage() {
  const { applications, jobs, followUps, events } = useDemoState();
  const matchingJobs = jobs.filter((job) => job.score >= 80);
  const activeApplications = applications.filter(
    (application) =>
      !["Rejected", "Withdrawn", "Closed", "Offer"].includes(application.status),
  ).length;
  const responses = applications.filter((application) =>
    ["Recruiter contacted", "Assessment", "Interview", "Offer", "Rejected"].includes(
      application.status,
    ),
  ).length;
  const responseRate = applications.length
    ? Math.round((responses / applications.length) * 100)
    : 0;
  const pipeline: ApplicationStatus[] = [
    "Applied",
    "Assessment",
    "Interview",
    "Offer",
  ];
  const pipelineLabels = ["Applied", "Assessment", "Interview", "Offer"];
  const todayEvents = events.filter((event) => event.date >= "2026-10-27");

  return (
    <>
      <PageTitle
        title="Good morning, Rounak"
        description="Tuesday, October 27, 2026 · A clear view of your search, with the next steps in reach."
        action={
          <Link href="/jobs">
            <Button className="gap-2">
              <IconSearch size={16} />
              Find jobs
            </Button>
          </Link>
        }
      />
      <Panel className="mb-5 overflow-hidden">
        <div className="grid grid-cols-2 divide-y divide-[#e8ecee] sm:grid-cols-4 sm:divide-y-0">
          <Metric
            label="New matching jobs"
            value={matchingJobs.length}
            note="Based on your saved preferences"
            icon={<IconSearch size={16} />}
          />
          <Metric
            label="Active applications"
            value={activeApplications}
            note={`${applications.length} tracked in total`}
            icon={<IconBriefcase size={16} />}
          />
          <Metric
            label="Interviews scheduled"
            value={applications.filter((item) => item.status === "Interview").length}
            note="Next: Northstar Labs · Oct 29"
            icon={<IconCalendarEvent size={16} />}
          />
          <Metric
            label="Responses received"
            value={`${responseRate}%`}
            note={`${responses} of ${applications.length} applications`}
            icon={<IconArrowUpRight size={16} />}
          />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
        <div className="space-y-5">
          <Panel
            title="Recommended jobs"
            description="Strong matches based on your skills and preferences."
            action={
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#37677a] hover:text-[#244e60]"
              >
                View all <IconArrowRight size={14} />
              </Link>
            }
          >
            <div className="divide-y divide-[#edf0f2]">
              {matchingJobs.slice(0, 3).map((job) => {
                const company = companyFor(job.companyId);
                return (
                  <Link
                    key={job.id}
                    href="/jobs"
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#fafbfb] sm:px-5"
                  >
                    <CompanyMark
                      name={company?.name ?? "Company"}
                      initials={company?.initials}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#2c3b43]">
                        {job.title}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-[#7b878e]">
                        {company?.name} · {job.location} · {job.mode}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-[11px] font-semibold text-[#3d6c61]">{job.score}%</p>
                      <p className="mt-0.5 text-[10px] text-[#8a959b]">match</p>
                    </div>
                    <span className="text-[11px] text-[#65737b]">{formatSalary(job)}</span>
                  </Link>
                );
              })}
            </div>
          </Panel>

          <Panel
            title="Application pipeline"
            description="Your current progress by stage."
            action={
              <Link href="/applications" aria-label="View all applications">
                <IconArrowUpRight size={16} className="text-[#839198]" />
              </Link>
            }
          >
            <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4 sm:px-5">
              {pipeline.map((status, index) => {
                const count = applications.filter((item) => item.status === status).length;
                const width = applications.length
                  ? Math.max(8, (count / applications.length) * 100)
                  : 0;
                return (
                  <div key={status} className="rounded-md bg-[#f7f8f9] px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#748088]">
                        {pipelineLabels[index]}
                      </span>
                      <span className="text-sm font-semibold text-[#304149]">{count}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded bg-[#e6ebed]">
                      <div
                        className="h-full rounded bg-[#588294]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Recent activity" description="A short history of the work you've done.">
            <ol className="divide-y divide-[#edf0f2]">
              {[
                ["10:42 AM", "Assessment received", "Cedar AI · Software Engineer, AI Products"],
                ["Yesterday", "Application reviewed", "Orbit Cloud · Cloud Platform Engineer"],
                ["Oct 24", "Interview scheduled", "Northstar Labs · Backend Engineer"],
                ["Oct 22", "Recruiter contacted", "Orbit Cloud · Rohan Mehta"],
              ].map(([date, title, detail]) => (
                <li key={`${date}-${title}`} className="flex gap-3 px-4 py-3 sm:px-5">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#82a3af]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#33434b]">{title}</p>
                    <p className="mt-1 truncate text-[11px] text-[#859097]">{detail}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-[#97a0a5]">{date}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel
            title="Next up"
            description="Interviews and follow-ups to keep on your radar."
            action={
              <Link href="/calendar" className="text-[11px] font-medium text-[#37677a]">
                Calendar
              </Link>
            }
          >
            <div className="divide-y divide-[#edf0f2]">
              {todayEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="flex gap-3 px-4 py-3.5">
                  <span className="flex h-10 w-11 flex-col items-center justify-center rounded-md border border-[#e5eaed] bg-[#fafbfb]">
                    <span className="text-[9px] uppercase text-[#849098]">
                      {event.date.slice(5, 7) === "10" ? "OCT" : "NOV"}
                    </span>
                    <span className="text-sm font-semibold text-[#394951]">
                      {Number(event.date.slice(8, 10))}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#35454d]">{event.title}</p>
                    <p className="mt-1 text-[11px] text-[#849098]">
                      {event.company} · {event.time}
                    </p>
                  </div>
                </div>
              ))}
              {followUps
                .filter((item) => !item.completed)
                .slice(0, 2)
                .map((item) => {
                  const job = jobs.find((record) => record.id === item.jobId);
                  return (
                    <Link
                      key={item.id}
                      href="/follow-ups"
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-[#fafbfb]"
                    >
                      <IconClock size={17} className="mt-0.5 text-[#82919a]" />
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-[#394850]">
                          Follow up · {companyFor(job?.companyId ?? "")?.name}
                        </span>
                        <span className="mt-1 block text-[11px] text-[#869198]">
                          Due {item.due}
                        </span>
                      </span>
                    </Link>
                  );
                })}
            </div>
          </Panel>

          <Panel title="Response rate" description="Responses across your tracked applications.">
            <div className="flex items-center gap-5 px-5 py-5">
              <div
                className="grid size-[92px] shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#4b8295 ${responseRate}%, #e8edef 0)`,
                }}
                aria-label={`${responseRate}% response rate`}
              >
                <span className="grid size-[72px] place-items-center rounded-full bg-white text-lg font-semibold text-[#263a44]">
                  {responseRate}%
                </span>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#34434b]">
                  {responses} responses received
                </p>
                <p className="mt-1.5 leading-5 text-[#808c93]">
                  From {applications.length} tracked applications. This is a sample from
                  your current demo data.
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="AI drafting allowance" description="Assistance stays under your review.">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64727a]">Used today</span>
                <span className="font-medium text-[#35454d]">8 / 25 drafts</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-[#e8edef]">
                <div className="h-full w-[32%] rounded bg-[#588294]" />
              </div>
              <p className="mt-2.5 text-[10px] text-[#89949a]">
                17 drafts remaining · AI suggestions are editable and never sent automatically.
              </p>
            </div>
          </Panel>
          <div className="flex flex-wrap gap-2">
            <Link href="/applications">
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconPlus size={14} /> Add application
              </Button>
            </Link>
            <Link href="/outreach">
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconMailIcon /> Draft outreach
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconFileCv size={14} /> Update profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function IconMailIcon() {
  return <IconArrowRight size={14} />;
}

function MatchScore({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3d6d61]">
      <span className="h-1.5 w-10 overflow-hidden rounded-full bg-[#e7edeb]">
        <span className="block h-full rounded-full bg-[#6b9b88]" style={{ width: `${score}%` }} />
      </span>
      {score}
    </span>
  );
}

function JobReviewDialog({
  jobIds,
  onClose,
}: {
  jobIds: string[];
  onClose: () => void;
}) {
  const { jobs, applications, resumes, setApplications } = useDemoState();
  const [selectedIds, setSelectedIds] = useState(jobIds);
  const [resumeByJob, setResumeByJob] = useState<Record<string, string>>({});
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState("");
  const selectedJobs = jobs.filter((job) => selectedIds.includes(job.id));
  const hasDuplicate = selectedJobs.some((job) =>
    applications.some((application) => application.jobId === job.id),
  );
  const hasResume = selectedJobs.every(
    (job) => resumeByJob[job.id] || job.resumeId || resumes[0]?.id,
  );

  function confirmReview() {
    if (!approved || !selectedJobs.length) return;
    setApplications((current) => [
      ...current,
      ...selectedJobs
        .filter((job) => !current.some((application) => application.jobId === job.id))
        .map((job, index): Application => ({
          id: `app-review-${job.id}-${current.length + index + 1}`,
          jobId: job.id,
          status: "Ready for review",
          appliedOn: "Oct 27, 2026",
          resumeId: resumeByJob[job.id] || job.resumeId,
          activity: "Added to review queue",
          followUp: "Not scheduled",
          note: "Created from the JobPilot review flow. No external application was submitted.",
        })),
    ]);
    setMessage(
      hasDuplicate
        ? "Review complete. Existing applications were left unchanged; new jobs were added to your review queue."
        : "Review complete. Jobs are now in your local review queue; no external application was submitted.",
    );
    window.setTimeout(onClose, 1700);
  }

  return (
    <Modal
      title="Review application details"
      description="Choose a resume and confirm each opportunity before adding it to your local review queue."
      onClose={onClose}
      wide
    >
      <div className="space-y-3">
        <Notice tone="warning">
          JobPilot will not submit applications externally. Confirming only records a
          simulated review state in this browser session.
        </Notice>
        {hasDuplicate ? (
          <Notice>One or more selected jobs already have an application record.</Notice>
        ) : null}
        {selectedJobs.map((job) => {
          const company = companyFor(job.companyId);
          const duplicate = applications.some((item) => item.jobId === job.id);
          return (
            <div key={job.id} className="rounded-md border border-[#e7ebed] p-3.5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked
                  aria-label={`Keep ${job.title} in review`}
                  onChange={() =>
                    setSelectedIds((ids) => ids.filter((id) => id !== job.id))
                  }
                  className="mt-1 accent-[#356b7d]"
                />
                <CompanyMark name={company?.name ?? "Company"} initials={company?.initials} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#33434b]">{job.title}</p>
                  <p className="mt-1 text-[11px] text-[#839097]">
                    {company?.name} · {job.location} · Match {job.score}/100
                  </p>
                  {duplicate ? (
                    <p className="mt-1.5 text-[10px] text-[#8a6847]">
                      Existing application detected; this job will not be added twice.
                    </p>
                  ) : null}
                  <select
                    aria-label={`Resume for ${job.title}`}
                    className={`${controlClass} mt-3 max-w-xs`}
                    value={resumeByJob[job.id] || job.resumeId}
                    onChange={(event) =>
                      setResumeByJob((values) => ({
                        ...values,
                        [job.id]: event.target.value,
                      }))
                    }
                  >
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.name} · {resume.version}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
        <Panel title="Screening answers" description="Review placeholder — no answers are submitted.">
          <div className="grid gap-3 px-4 py-3 sm:grid-cols-2">
            <p className="text-[11px] leading-5 text-[#7c888f]">
              Work authorization and graduation eligibility will need your confirmation.
            </p>
            <p className="text-[11px] leading-5 text-[#7c888f]">
              Your professional profile and selected resume are available for review.
            </p>
          </div>
        </Panel>
        <label className="flex items-start gap-2.5 text-xs leading-5 text-[#4c5a62]">
          <input
            type="checkbox"
            checked={approved}
            onChange={(event) => setApproved(event.target.checked)}
            className="mt-1 accent-[#356b7d]"
          />
          I have reviewed these opportunities, eligibility notes, and resume selections.
        </label>
        {message ? <Notice tone="success">{message}</Notice> : null}
        <div className="flex justify-end gap-2 border-t border-[#edf0f2] pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!approved || !selectedJobs.length || !hasResume}
            onClick={confirmReview}
          >
            Confirm review
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function JobDetails({
  job,
  onClose,
  onApply,
}: {
  job: Job;
  onClose: () => void;
  onApply: (id: string) => void;
}) {
  const company = companyFor(job.companyId);
  return (
    <Modal
      title={job.title}
      description={`${company?.name} · ${job.location} · Posted ${job.posted}`}
      onClose={onClose}
      wide
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-[#e5e9ec] px-2.5 py-1 text-[11px] text-[#64727a]">
            {job.mode}
          </span>
          <span className="rounded border border-[#e5e9ec] px-2.5 py-1 text-[11px] text-[#64727a]">
            {job.experience}
          </span>
          <span className="rounded border border-[#e5e9ec] px-2.5 py-1 text-[11px] text-[#64727a]">
            {formatSalary(job)}
          </span>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-[#33434b]">Role overview</h3>
          <p className="mt-2 text-xs leading-6 text-[#748088]">{job.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold text-[#33434b]">Matching analysis</h3>
            <p className="mt-2 text-[11px] text-[#748088]">
              Match score: <strong className="text-[#3e715e]">{job.score}/100</strong>
              <span className="ml-1">— not a hiring probability</span>
            </p>
            <p className="mt-2 text-[11px] text-[#748088]">Skills match: {job.skills.join(", ")}</p>
            <p className="mt-1.5 text-[11px] text-[#748088]">Experience match: {job.experience}</p>
            <p className="mt-1.5 text-[11px] text-[#748088]">Salary and location: within stated preferences</p>
            <p className="mt-1.5 text-[11px] text-[#8a6e4b]">Weak or missing: {job.missingSkills.join(", ")}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#33434b]">Requirements and skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span key={skill} className="rounded bg-[#f2f5f6] px-2 py-1 text-[10px] text-[#5b6971]">
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[#748088]">Source: {job.source}</p>
            <p className="mt-1 text-[11px] text-[#879198]">Source URL not connected in this demo.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#edf0f2] pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
          <Button type="button" onClick={() => onApply(job.id)}>Review application</Button>
        </div>
      </div>
    </Modal>
  );
}

export function JobsPage({ initialQuery = "" }: { initialQuery?: string }) {
  const { jobs, applications } = useDemoState();
  const [keyword, setKeyword] = useState(initialQuery);
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Any mode");
  const [source, setSource] = useState("Any source");
  const [submittedFilters, setSubmittedFilters] = useState({
    keyword: initialQuery,
    location: "",
    mode: "Any mode",
    source: "Any source",
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sort, setSort] = useState("Relevance");
  const [notice, setNotice] = useState("");

  const filteredJobs = useMemo(() => {
    const query = submittedFilters.keyword.toLowerCase();
    const filtered = jobs.filter((job) => {
      const company = companyFor(job.companyId)?.name ?? "";
      return (
        (!query || `${job.title} ${company} ${job.skills.join(" ")}`.toLowerCase().includes(query)) &&
        (!submittedFilters.location ||
          job.location.toLowerCase().includes(submittedFilters.location.toLowerCase())) &&
        (submittedFilters.mode === "Any mode" || job.mode === submittedFilters.mode) &&
        (submittedFilters.source === "Any source" || job.source === submittedFilters.source)
      );
    });
    if (sort === "Newest") return [...filtered].reverse();
    if (sort === "Salary") return [...filtered].sort((a, b) => b.salaryMax - a.salaryMax);
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [jobs, submittedFilters, sort]);

  function searchJobs(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedFilters({ keyword, location, mode, source });
    setSelected([]);
  }

  function clearFilters() {
    setKeyword("");
    setLocation("");
    setMode("Any mode");
    setSource("Any source");
    setSubmittedFilters({
      keyword: "",
      location: "",
      mode: "Any mode",
      source: "Any source",
    });
    setSelected([]);
  }

  const toggleJob = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  return (
    <>
      <PageTitle
        title="Find jobs"
        description="Search, compare, and review relevant opportunities before taking action."
        action={
          <div className="flex items-center gap-2 text-[11px] text-[#818c93]">
            <span className="size-1.5 rounded-full bg-[#6d9d83]" />
            Refreshed today, 9:15 AM
          </div>
        }
      />
      <Panel className="mb-5">
        <form onSubmit={searchJobs} className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.85fr_0.9fr_auto]">
            <Field label="Title or keywords">
              <div className="relative">
                <IconSearch size={15} className="absolute left-3 top-2.5 text-[#95a0a6]" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Backend engineer, Kubernetes..."
                  className={`${controlClass} pl-9`}
                />
              </div>
            </Field>
            <Field label="Location">
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, region, or remote"
                className={controlClass}
              />
            </Field>
            <Field label="Work mode">
              <select value={mode} onChange={(event) => setMode(event.target.value)} className={controlClass}>
                {["Any mode", "Remote", "Hybrid", "On-site"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Job source">
              <select value={source} onChange={(event) => setSource(event.target.value)} className={controlClass}>
                {["Any source", ...new Set(jobs.map((job) => job.source))].map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <div className="flex items-end gap-2">
              <Button type="submit" className="gap-1.5">
                <IconFilter size={15} /> Search jobs
              </Button>
              <Button type="button" variant="ghost" onClick={clearFilters}>Clear</Button>
            </div>
          </div>
          <details className="group border-t border-[#edf0f2] pt-3">
            <summary className="cursor-pointer list-none text-[11px] font-medium text-[#697780]">
              More filters <span className="ml-1 text-[#9aa4aa]">Salary · experience · eligibility · skills · date posted</span>
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Minimum monthly salary">
                <input type="number" placeholder="₹90,000" className={controlClass} />
              </Field>
              <Field label="Experience">
                <select className={controlClass} defaultValue="Any experience">
                  <option>Any experience</option><option>Internship</option><option>Entry level</option><option>0–2 years</option>
                </select>
              </Field>
              <Field label="Graduation year">
                <select className={controlClass} defaultValue="Any year">
                  <option>Any year</option><option>2025</option><option>2026</option><option>2027</option>
                </select>
              </Field>
              <Field label="Skills">
                <input placeholder="Node.js, AWS..." className={controlClass} />
              </Field>
            </div>
          </details>
        </form>
      </Panel>

      {notice ? <div className="mb-4"><Notice tone="success">{notice}</Notice></div> : null}

      <Panel
        title={`${filteredJobs.length} relevant opportunities`}
        description={`Search: ${submittedFilters.keyword || "Backend, platform, and AI engineering"} · Results are sample listings for review, not live integrations.`}
        action={
          <select
            aria-label="Sort jobs"
            className="h-8 rounded border border-[#e2e7e9] bg-white px-2 text-[11px] text-[#58676f]"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {["Relevance", "Newest", "Salary"].map((value) => <option key={value}>{value}</option>)}
          </select>
        }
      >
        {selected.length ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f2] bg-[#f7f9fa] px-4 py-2.5">
            <p className="text-xs text-[#56656d]">{selected.length} job{selected.length > 1 ? "s" : ""} selected</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelected([])}>Clear selection</Button>
              <Button size="sm" onClick={() => setReviewIds(selected)}>Review selected</Button>
            </div>
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-[#fafbfb] text-[10px] font-medium uppercase tracking-[0.04em] text-[#879198]">
              <tr className="border-b border-[#edf0f2]">
                <th className="w-10 px-4 py-3">
                  <input
                    aria-label="Select all jobs"
                    type="checkbox"
                    checked={Boolean(filteredJobs.length && selected.length === filteredJobs.length)}
                    onChange={() => setSelected(selected.length === filteredJobs.length ? [] : filteredJobs.map((job) => job.id))}
                    className="accent-[#356b7d]"
                  />
                </th>
                <th className="px-3 py-3">Role / company</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Compensation</th>
                <th className="px-3 py-3">Match</th>
                <th className="px-3 py-3">Posted · source</th>
                <th className="px-4 py-3 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f2]">
              {filteredJobs.map((job) => {
                const company = companyFor(job.companyId);
                const existing = applications.find((application) => application.jobId === job.id);
                return (
                  <tr key={job.id} className="align-top transition-colors hover:bg-[#fcfdfd]">
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(job.id)}
                        onChange={() => toggleJob(job.id)}
                        aria-label={`Select ${job.title}`}
                        className="accent-[#356b7d]"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex min-w-[235px] items-start gap-2.5">
                        <CompanyMark name={company?.name ?? ""} initials={company?.initials} size="sm" />
                        <div>
                          <button type="button" onClick={() => setDetailJob(job)} className="text-left text-xs font-semibold text-[#2e3e46] hover:text-[#356b7d]">
                            {job.title}
                          </button>
                          <p className="mt-1 text-[10px] text-[#849098]">{company?.name} · {job.mode}</p>
                          <button type="button" onClick={() => setExpanded(expanded === job.id ? null : job.id)} className="mt-1.5 text-[10px] font-medium text-[#507789]">
                            {expanded === job.id ? "Hide match details" : "Why this match?"}
                          </button>
                        </div>
                      </div>
                      {expanded === job.id ? (
                        <div className="ml-9 mt-3 max-w-[420px] rounded-md bg-[#f5f8f8] p-3 text-[10px] leading-5 text-[#6d7b82]">
                          <p><strong className="text-[#445860]">Skills:</strong> {job.skills.join(", ")}</p>
                          <p><strong className="text-[#445860]">Experience:</strong> {job.experience} · <strong>Salary:</strong> within your preference</p>
                          <p><strong className="text-[#445860]">Eligibility:</strong> graduation year needs your confirmation</p>
                          <p><strong className="text-[#80684a]">Weak match:</strong> {job.missingSkills.join(", ")}</p>
                          <p>Match score indicates preference alignment, not hiring probability.</p>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5 text-[11px] text-[#66747c]">{job.location}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-[#526169]">{formatSalary(job)}</td>
                    <td className="px-3 py-3.5"><MatchScore score={job.score} /></td>
                    <td className="px-3 py-3.5 text-[10px] text-[#77848b]">{job.posted}<span className="mt-1 block">{job.source}</span></td>
                    <td className="px-4 py-3 text-right">
                      {existing ? (
                        <span className="block text-[10px] text-[#748189]">{existing.status}</span>
                      ) : (
                        <Button size="xs" variant="outline" onClick={() => setReviewIds([job.id])}>Apply</Button>
                      )}
                      <button type="button" onClick={() => setDetailJob(job)} className="mt-2 block w-full text-[10px] text-[#5c7e8d] hover:underline">Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filteredJobs.length ? <EmptyState title="No jobs match these filters" description="Adjust your search or clear the filters to see available sample opportunities." /> : null}
        </div>
        <div className="flex items-center justify-between border-t border-[#edf0f2] px-4 py-3 text-[10px] text-[#89949a]">
          <span>Showing {filteredJobs.length} sample opportunities</span>
          <span>Last refreshed today</span>
        </div>
      </Panel>
      {reviewIds ? <JobReviewDialog jobIds={reviewIds} onClose={() => setReviewIds(null)} /> : null}
      {detailJob ? (
        <JobDetails
          job={detailJob}
          onClose={() => setDetailJob(null)}
          onApply={(id) => {
            setDetailJob(null);
            setReviewIds([id]);
          }}
        />
      ) : null}
    </>
  );
}

const statusOptions: ApplicationStatus[] = [
  "Saved",
  "Ready for review",
  "Applied",
  "Recruiter contacted",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Closed",
];

export function ApplicationsPage() {
  const { applications, setApplications, jobs, resumes } = useDemoState();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Application | null>(null);
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  const filtered = applications.filter((application) => {
    const job = jobs.find((record) => record.id === application.jobId);
    const company = companyFor(job?.companyId ?? "")?.name ?? "";
    const matchesText = `${job?.title ?? ""} ${company}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "In progress" && !["Offer", "Rejected", "Withdrawn", "Closed"].includes(application.status)) ||
      (filter === "Interviews" && application.status === "Interview") ||
      (filter === "Offers" && application.status === "Offer") ||
      (filter === "Closed" && ["Rejected", "Withdrawn", "Closed"].includes(application.status));
    return matchesText && matchesFilter;
  });
  const count = (status: ApplicationStatus) =>
    applications.filter((application) => application.status === status).length;

  function updateStatus(applicationId: string, status: ApplicationStatus) {
    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status,
              activity: `Status changed to ${status}`,
            }
          : application,
      ),
    );
    setNotice("Application status updated in your local workspace.");
  }

  return (
    <>
      <PageTitle
        title="Applications"
        description="Track every opportunity and keep your next action visible."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setNotice("Export is a frontend placeholder; no file was created.")}>
              Export
            </Button>
            <Link href="/jobs"><Button className="gap-1.5"><IconPlus size={15} /> Add application</Button></Link>
          </div>
        }
      />
      {notice ? <div className="mb-4"><Notice tone="success">{notice}</Notice></div> : null}
      <Panel className="mb-5 overflow-hidden">
        <div className="grid grid-cols-2 divide-y divide-[#e8ecee] sm:grid-cols-5 sm:divide-y-0">
          {[
            ["Total", applications.length],
            ["In progress", applications.filter((item) => !["Offer", "Rejected", "Withdrawn", "Closed"].includes(item.status)).length],
            ["Interviews", count("Interview")],
            ["Offers", count("Offer")],
            ["Closed / rejected", count("Rejected") + count("Closed")],
          ].map(([label, value]) => (
            <div key={label} className="border-r border-[#e8ecee] px-4 py-3.5 last:border-0 sm:px-5">
              <p className="text-[10px] text-[#859097]">{label}</p>
              <p className="mt-1 text-xl font-semibold text-[#2e3e46]">{value}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title="Application tracker"
        description="Status changes are saved in this workspace session."
        action={
          <div className="relative w-48">
            <IconSearch size={14} className="absolute left-2.5 top-2.5 text-[#98a2a7]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search role or company" className={`${controlClass} pl-8`} />
          </div>
        }
      >
        <div className="flex flex-wrap gap-1.5 border-b border-[#edf0f2] px-4 py-3 sm:px-5">
          {["All", "In progress", "Interviews", "Offers", "Closed"].map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] ${filter === item ? "bg-[#eaf0f3] font-semibold text-[#30586a]" : "text-[#748188] hover:bg-[#f4f6f7]"}`}>
              {item}
              <span className="ml-1.5 text-[10px] opacity-70">
                {item === "All" ? applications.length : item === "Interviews" ? count("Interview") : item === "Offers" ? count("Offer") : item === "Closed" ? count("Rejected") + count("Closed") : applications.filter((app) => !["Offer", "Rejected", "Withdrawn", "Closed"].includes(app.status)).length}
              </span>
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#fafbfb] text-[10px] uppercase tracking-[0.04em] text-[#89939a]">
              <tr className="border-b border-[#edf0f2]">
                <th className="px-5 py-3">Role / company</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Applied</th>
                <th className="px-3 py-3">Resume</th>
                <th className="px-3 py-3">Latest activity</th>
                <th className="px-4 py-3">Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f2]">
              {filtered.map((application) => {
                const job = jobs.find((record) => record.id === application.jobId);
                const company = companyFor(job?.companyId ?? "");
                const resume = resumes.find((item) => item.id === application.resumeId);
                return (
                  <tr key={application.id} className="hover:bg-[#fcfdfd]">
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(application);
                          setNote(application.note);
                        }}
                        className="flex items-center gap-2.5 text-left"
                      >
                        <CompanyMark name={company?.name ?? ""} initials={company?.initials} size="sm" />
                        <span>
                          <span className="block text-xs font-semibold text-[#35444c]">{job?.title}</span>
                          <span className="mt-1 block text-[10px] text-[#879198]">{company?.name}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        aria-label={`Status for ${job?.title}`}
                        value={application.status}
                        onChange={(event) => updateStatus(application.id, event.target.value as ApplicationStatus)}
                        className="h-8 max-w-[150px] rounded-md border border-[#e3e8ea] bg-white px-2 text-[10px] text-[#54636b]"
                      >
                        {statusOptions.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-[11px] text-[#6c7980]">{application.appliedOn}</td>
                    <td className="px-3 py-3 text-[11px] text-[#6c7980]">{resume?.name}</td>
                    <td className="px-3 py-3 text-[11px] text-[#6c7980]">{application.activity}</td>
                    <td className="px-4 py-3 text-[11px] text-[#6c7980]">{application.followUp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length ? <EmptyState title="No applications here yet" description="Try another status or add a new opportunity from Find Jobs." /> : null}
        </div>
        <div className="border-t border-[#edf0f2] px-5 py-3 text-[10px] text-[#89949a]">{filtered.length} of {applications.length} applications</div>
      </Panel>
      {selected ? (
        <Modal
          title={jobs.find((job) => job.id === selected.jobId)?.title ?? "Application"}
          description={`${companyFor(jobs.find((job) => job.id === selected.jobId)?.companyId ?? "")?.name ?? ""} · Application timeline and notes`}
          onClose={() => setSelected(null)}
          wide
        >
          <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
            <div>
              <h3 className="text-xs font-semibold text-[#35444c]">Timeline</h3>
              <ol className="mt-3 space-y-4 border-l border-[#dfe6e9] pl-4">
                {[selected.appliedOn, selected.activity, "Application details reviewed"].map((item, index) => (
                  <li key={`${item}-${index}`} className="relative text-xs text-[#57666e]">
                    <span className="absolute -left-[21px] top-0.5 size-2 rounded-full border-2 border-white bg-[#6f97a5] ring-1 ring-[#d8e2e5]" />
                    <span className="font-medium">{item}</span>
                    <span className="mt-1 block text-[10px] text-[#89949a]">{index === 0 ? "Application created" : index === 1 ? "Latest activity" : "Status history"}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-5">
                <label className="text-xs font-medium text-[#526068]">Application notes</label>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className={`${controlClass} mt-1.5 h-auto py-2`} />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setApplications((items) => items.map((item) => item.id === selected.id ? { ...item, note } : item));
                    setNotice("Application note saved.");
                    setSelected(null);
                  }}
                >
                  Save note
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Panel title="Application details">
                <div className="space-y-2 px-4 py-3 text-[11px] text-[#718087]">
                  <p>Applied: {selected.appliedOn}</p>
                  <p>Resume: {resumes.find((item) => item.id === selected.resumeId)?.name}</p>
                  <p>Source: {jobs.find((item) => item.id === selected.jobId)?.source}</p>
                  <p>Next follow-up: {selected.followUp}</p>
                </div>
              </Panel>
              <Panel title="Related records">
                <div className="flex flex-col gap-2 px-4 py-3">
                  <Link href="/outreach" className="text-[11px] text-[#426f80] hover:underline">Recruiter and outreach history</Link>
                  <Link href="/calendar" className="text-[11px] text-[#426f80] hover:underline">Interview and calendar events</Link>
                  <Link href="/follow-ups" className="text-[11px] text-[#426f80] hover:underline">Follow-up reminders</Link>
                </div>
              </Panel>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
