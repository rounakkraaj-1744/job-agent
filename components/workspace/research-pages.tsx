"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowUpRight, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useDemoState } from "@/components/shared/demo-state";
import { companies } from "@/lib/mock-data";
import { CompanyMark, controlClass, EmptyState, Field, Modal, Notice, PageTitle, Panel } from "./primitives";

const companyFor = (id: string) => companies.find((company) => company.id === id);

export function CompaniesPage() {
  const { jobs, applications, contacts } = useDemoState();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [researchOpen, setResearchOpen] = useState(false);
  const filtered = companies.filter((company) => `${company.name} ${company.industry} ${company.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = companies.find((company) => company.id === selectedId);
  const selectedJobs = jobs.filter((job) => job.companyId === selectedId);
  const selectedApplications = applications.filter((application) =>
    selectedJobs.some((job) => job.id === application.jobId),
  );
  const selectedContacts = contacts.filter((contact) => contact.companyId === selectedId);

  return (
    <>
      <PageTitle title="Companies" description="Research teams, open roles, and the people you have already contacted."/>
      <Panel title="Company research" description={`${filtered.length} companies in your local workspace.`}
        action={
          <div className="relative w-48">
            <IconSearch size={14} className="absolute left-2.5 top-2.5 text-[#98a2a7]" />
            <Input aria-label="Search companies" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies" className={`${controlClass} pl-8`} />
          </div>
        } >
        <div className="grid gap-px bg-[#edf0f2] sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => {
            const companyJobs = jobs.filter((job) => job.companyId === company.id);
            const applicationsForCompany = applications.filter((application) =>
              companyJobs.some((job) => job.id === application.jobId),
            );
            const contactsForCompany = contacts.filter(
              (contact) => contact.companyId === company.id,
            );
            return (
              <button key={company.id} type="button" onClick={() => setSelectedId(company.id)} className="bg-white p-4 text-left transition-colors hover:bg-[#fbfcfc] sm:p-5" >
                <div className="flex items-start gap-3">
                  <CompanyMark name={company.name} initials={company.initials} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-[#35454d]">
                      {company.name}
                    </span>
                    <span className="mt-1 block text-[10px] text-[#879198]">
                      {company.industry} · {company.location}
                    </span>
                  </span>
                  <IconArrowUpRight size={15} className="text-[#9ba5aa]" />
                </div>
                <div className="mt-5 grid grid-cols-3 border-t border-[#edf0f2] pt-3">
                  <span>
                    <span className="block text-sm font-semibold text-[#3d4d55]">
                      {companyJobs.length}
                    </span>
                    <span className="text-[9px] text-[#8a959b]">jobs</span>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#3d4d55]">
                      {applicationsForCompany.length}
                    </span>
                    <span className="text-[9px] text-[#8a959b]">applications</span>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#3d4d55]">
                      {contactsForCompany.length}
                    </span>
                    <span className="text-[9px] text-[#8a959b]">contacts</span>
                  </span>
                </div>
                <span className="mt-3 block truncate text-[10px] text-[#5c7f8e]">
                  {company.careers}
                </span>
              </button>
            );
          })}
        </div>
        {!filtered.length ? (
          <EmptyState title="No companies found" description="Try a different search term." />
        ) : null}
      </Panel>
      {selected ? (
        <Modal
          title={selected.name}
          description={`${selected.industry} · ${selected.location}`}
          onClose={() => setSelectedId(null)}
          wide
        >
          <div className="space-y-5">
            <p className="text-xs leading-6 text-[#6e7c83]">{selected.description}</p>
            <div className="flex flex-wrap gap-2">
              <a href={`https://${selected.careers}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md border border-[#dfe5e8] px-3 text-[11px] text-[#426f80] hover:bg-[#f5f8f8]" >
                Careers <IconArrowUpRight size={13} />
              </a>
              <a href={`https://${selected.name.toLowerCase().replaceAll(" ", "")}.example`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md border border-[#dfe5e8] px-3 text-[11px] text-[#426f80] hover:bg-[#f5f8f8]" >
                Company website <IconArrowUpRight size={13} />
              </a>
              <Button size="sm" onClick={() => setResearchOpen(true)}>
                Research company
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Open jobs">
                <div className="divide-y divide-[#edf0f2]">
                  {selectedJobs.length ? (
                    selectedJobs.map((job) => (
                      <Link key={job.id} href="/jobs" className="block px-4 py-3 hover:bg-[#fafbfb]" >
                        <span className="block text-xs font-medium text-[#42525a]">
                          {job.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#8a959b]">
                          {job.location} · Match {job.score}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <EmptyState
                      title="No tracked openings"
                      description="Use Find Jobs to discover roles at this company."
                    />
                  )}
                </div>
              </Panel>
              <Panel title="Application history">
                <div className="divide-y divide-[#edf0f2]">
                  {selectedApplications.length ? (
                    selectedApplications.map((application) => (
                      <div key={application.id} className="px-4 py-3">
                        <span className="block text-xs text-[#536169]">
                          {selectedJobs.find((job) => job.id === application.jobId)?.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#879198]">
                          {application.status} · {application.appliedOn}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No applications yet"
                      description="Applications associated with this company will show here."
                    />
                  )}
                </div>
              </Panel>
              <Panel title="Recruiter contacts">
                <div className="divide-y divide-[#edf0f2]">
                  {selectedContacts.length ? (
                    selectedContacts.map((contact) => (
                      <div key={contact.id} className="px-4 py-3">
                        <span className="block text-xs text-[#536169]">{contact.name}</span>
                        <span className="mt-1 block text-[10px] text-[#879198]">
                          {contact.role} · {contact.email}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No contacts yet"
                      description="Add recruiters from HR & Outreach."
                    />
                  )}
                </div>
              </Panel>
              <Panel title="Research notes">
                <div className="space-y-2 px-4 py-3 text-[11px] text-[#75828a]">
                  <p>Source: company profile and locally tracked opportunities.</p>
                  <p>Last researched: Oct 27, 2026</p>
                  <p>Salary observations are illustrative mock data, not market intelligence.</p>
                </div>
              </Panel>
            </div>
          </div>
        </Modal>
      ) : null}
      {researchOpen ? (
        <Modal title="Simulated company research" description="This is a mock research panel. No external sources were queried." onClose={() => setResearchOpen(false)} >
          <div className="space-y-4">
            <Notice>
              Research integrations are not enabled. Review the existing sample information before
              making decisions.
            </Notice>
            <div className="rounded-md border border-[#e7ebed] p-3 text-xs leading-5 text-[#69777e]">
              <p className="font-semibold text-[#3b4b53]">Research summary</p>
              <p className="mt-2">{selected?.description}</p>
              <p className="mt-2">
                Tracked openings: {selectedJobs.length} · Related applications:{" "}
                {selectedApplications.length} · Recruiter contacts: {selectedContacts.length}
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setResearchOpen(false)}>Done</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function CompactBar({ label, value, max, detail }: {
  label: string;
  value: number;
  max: number;
  detail: string;
}) {
  const width = max > 0 ? Math.max(value > 0 ? 6 : 0, (value / max) * 100) : 0;
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <span className="truncate text-[#68767d]">{label}</span>
        <span className="shrink-0 font-medium text-[#42525a]">{detail}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-[#edf1f2]">
        <div className="h-full rounded bg-[#6b94a2]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { applications, jobs, resumes, contacts } = useDemoState();
  const [range, setRange] = useState("Last 90 days");
  const responded = applications.filter((application) =>
    ["Recruiter contacted", "Assessment", "Interview", "Offer", "Rejected"].includes(
      application.status,
    ),
  ).length;
  const interviewed = applications.filter(
    (application) => application.status === "Interview" || application.status === "Offer",
  ).length;
  const rejected = applications.filter((application) => application.status === "Rejected").length;
  const rate = (value: number) =>
    applications.length ? Math.round((value / applications.length) * 100) : 0;
  const bySource = useMemo(() => {
    const counts = new Map<string, number>();
    applications.forEach((application) => {
      const source = jobs.find((job) => job.id === application.jobId)?.source ?? "Unknown";
      counts.set(source, (counts.get(source) ?? 0) + 1);
    });
    return [...counts.entries()];
  }, [applications, jobs]);
  const maxSource = Math.max(0, ...bySource.map(([, value]) => value));
  const backendResume = resumes.find((resume) => resume.id === "resume-backend-ai");
  const resumeInterviews = applications.filter(
    (application) =>
      application.resumeId === backendResume?.id &&
      ["Interview", "Offer"].includes(application.status),
  ).length;

  return (
    <>
      <PageTitle
        title="Analytics"
        description="Understand the activity in your job search using the same records as your tracker."
        action={
          <NativeSelect
            aria-label="Analytics date range"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-9 rounded-md border border-[#dfe5e8] bg-white px-3 text-xs text-[#5d6b73]"
          >
            {["Last 30 days", "Last 90 days", "This year", "All time"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </NativeSelect>
        }
      />
      <Notice>
        Insights use a small illustrative sample ({applications.length} applications). Treat rates
        as directional, not statistically meaningful.
      </Notice>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Response rate",
            `${rate(responded)}%`,
            `${responded} responses / ${applications.length} applications`,
          ],
          [
            "Interview conversion",
            `${rate(interviewed)}%`,
            `${interviewed} interview or offer stages`,
          ],
          ["Rejection rate", `${rate(rejected)}%`, `${rejected} recorded rejections`],
          ["Outreach contacts", contacts.length, "Recruiter and hiring contacts tracked"],
        ].map(([label, value, note]) => (
          <Panel key={label} className="p-4">
            <p className="text-[11px] text-[#829097]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#2e3e46]">{value}</p>
            <p className="mt-1 text-[10px] text-[#929ca2]">{note}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel
          title="Applications by stage"
          description="Current distribution from your application records."
        >
          <div className="px-5 py-3">
            {["Applied", "Assessment", "Interview", "Offer", "Rejected", "Ready for review"].map(
              (status) => {
                const value = applications.filter(
                  (application) => application.status === status,
                ).length;
                return (
                  <CompactBar
                    key={status}
                    label={status}
                    value={value}
                    max={Math.max(1, ...applications.map(() => 0), value, applications.length)}
                    detail={`${value}`}
                  />
                );
              },
            )}
          </div>
        </Panel>
        <Panel
          title="Applications by source"
          description={`Source counts for ${range.toLowerCase()}.`}
        >
          {bySource.length ? (
            <div className="px-5 py-3">
              {bySource.map(([source, value]) => (
                <CompactBar
                  key={source}
                  label={source}
                  value={value}
                  max={maxSource}
                  detail={`${value}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No application data"
              description="Add applications to see source trends."
            />
          )}
        </Panel>
        <Panel
          title="Applications over time"
          description="Four-week view derived from the tracked sample."
        >
          <div className="flex h-40 items-end justify-around gap-3 px-6 pb-5 pt-4">
            {[
              [
                "Oct 1–7",
                applications.filter(
                  (item) =>
                    item.appliedOn.startsWith("Oct") && Number(item.appliedOn.slice(4, 6)) <= 7,
                ).length,
              ],
              [
                "Oct 8–14",
                applications.filter(
                  (item) =>
                    Number(item.appliedOn.slice(4, 6)) >= 8 &&
                    Number(item.appliedOn.slice(4, 6)) <= 14,
                ).length,
              ],
              [
                "Oct 15–21",
                applications.filter(
                  (item) =>
                    Number(item.appliedOn.slice(4, 6)) >= 15 &&
                    Number(item.appliedOn.slice(4, 6)) <= 21,
                ).length,
              ],
              [
                "Oct 22–31",
                applications.filter((item) => Number(item.appliedOn.slice(4, 6)) >= 22).length,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] text-[#718087]">{value}</span>
                <div
                  className="w-full max-w-12 rounded-t bg-[#84a5b0]"
                  style={{
                    height: `${Math.max(8, (Number(value) / Math.max(1, applications.length)) * 100)}%`,
                  }}
                />
                <span className="text-center text-[9px] text-[#8a959b]">{label}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title="Resume variant performance"
          description="Interview and offer outcomes from linked resumes."
        >
          <div className="divide-y divide-[#edf0f2]">
            {resumes.map((resume) => {
              const linked = applications.filter(
                (application) => application.resumeId === resume.id,
              );
              const outcomes = linked.filter((application) =>
                ["Interview", "Offer"].includes(application.status),
              ).length;
              return (
                <div
                  key={resume.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div>
                    <p className="text-xs font-medium text-[#42525a]">{resume.name}</p>
                    <p className="mt-1 text-[10px] text-[#8b969c]">
                      {linked.length} linked applications
                    </p>
                  </div>
                  <span className="text-[11px] text-[#627179]">
                    {outcomes} interview{outcomes === 1 ? "" : "s"}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel
          title="Evidence-based observations"
          description="No hiring or market conclusions are inferred from this sample."
        >
          <div className="space-y-3 px-5 py-4">
            {applications.length ? (
              <Notice tone="info">
                {backendResume?.name ?? "Backend + GenAI"} has generated {resumeInterviews}{" "}
                interview or offer outcomes across{" "}
                {
                  applications.filter((application) => application.resumeId === backendResume?.id)
                    .length
                }{" "}
                linked application(s) in this sample.
              </Notice>
            ) : (
              <EmptyState
                title="Not enough data yet"
                description="Track a few applications to start comparing outcomes."
              />
            )}
            <p className="text-[10px] leading-5 text-[#89949a]">
              Time-to-first-response and outreach conversion need dated response events; the current
              sample does not contain enough evidence to calculate them reliably.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}

export function SalaryPage() {
  const { jobs } = useDemoState();
  const [minimum, setMinimum] = useState("90000");
  const [preferred, setPreferred] = useState("140000");
  const [query, setQuery] = useState("");
  const matching = jobs.filter((job) =>
    `${job.title} ${companyFor(job.companyId)?.name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const formatRange = (job: (typeof jobs)[number]) => {
    const symbol = job.currency === "INR" ? "₹" : "$";
    if (job.salaryPeriod === "month") {
      return `${symbol}${job.salaryMin.toLocaleString("en-IN")}–${symbol}${job.salaryMax.toLocaleString("en-IN")} / month`;
    }
    if (job.currency === "INR") {
      return `₹${(job.salaryMin / 100000).toFixed(1)}–₹${(job.salaryMax / 100000).toFixed(1)} LPA / year`;
    }
    return `${symbol}${(job.salaryMin / 1000).toFixed(0)}k–${symbol}${(job.salaryMax / 1000).toFixed(0)}k / year`;
  };
  const monthlyJobs = jobs.filter((job) => job.salaryPeriod === "month" && job.currency === "INR");
  const maxSalary = Math.max(...monthlyJobs.map((job) => job.salaryMax), Number(preferred));

  return (
    <>
      <PageTitle
        title="Salary insights"
        description="Compare clearly labeled compensation ranges across your saved opportunities."
        action={
          <span className="text-[11px] text-[#75828a]">Default preference · INR / month</span>
        }
      />
      <Notice>
        Illustrative mock salary data only. It is not market intelligence or a compensation
        recommendation. Currency reflects the job record, not a converted estimate.
      </Notice>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Panel
          title="Your compensation preferences"
          description="Monthly targets are separate from annual compensation."
        >
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-1">
            <Field label="Target minimum · per month">
              <Input
                value={minimum}
                onChange={(event) => setMinimum(event.target.value)}
                type="number"
                className={controlClass}
              />
            </Field>
            <Field label="Preferred compensation · per month">
              <Input
                value={preferred}
                onChange={(event) => setPreferred(event.target.value)}
                type="number"
                className={controlClass}
              />
            </Field>
            <div className="rounded-md bg-[#f7f9fa] p-3 sm:col-span-2 xl:col-span-1">
              <p className="text-[10px] font-medium text-[#58676f]">
                Annual equivalent at preferred monthly target
              </p>
              <p className="mt-1 text-lg font-semibold text-[#35454d]">
                ₹{((Number(preferred || 0) * 12) / 100000).toFixed(1)} LPA
              </p>
              <p className="mt-1 text-[10px] text-[#8a959b]">
                Simple 12× estimate; not total compensation.
              </p>
            </div>
          </div>
        </Panel>
        <Panel
          title="Monthly salary distribution"
          description="INR monthly ranges only; annual records are not mixed into this view."
        >
          <div className="space-y-1 px-5 py-3">
            {monthlyJobs.length ? (
              monthlyJobs.map((job) => {
                const company = companyFor(job.companyId);
                return (
                  <div key={job.id} className="py-2">
                    <div className="mb-1.5 flex justify-between gap-2 text-[10px]">
                      <span className="truncate text-[#68767d]">
                        {job.title} · {company?.name}
                      </span>
                      <span className="shrink-0 text-[#4f646f]">{formatRange(job)}</span>
                    </div>
                    <div className="relative h-2 rounded bg-[#edf1f2]">
                      <span
                        className="absolute inset-y-0 left-0 rounded bg-[#7b9eaa]"
                        style={{ width: `${Math.min(100, (job.salaryMax / maxSalary) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No monthly salary observations"
                description="Monthly salary ranges will appear when your job sample includes them."
              />
            )}
          </div>
        </Panel>
      </div>
      <Panel
        className="mt-5"
        title="Opportunity comparison"
        description="Ranges are shown with each job's original period and currency."
        action={
          <div className="relative w-44">
            <IconSearch size={14} className="absolute left-2.5 top-2.5 text-[#98a2a7]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities"
              className={`${controlClass} pl-8`}
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left">
            <thead className="bg-[#fafbfb] text-[10px] uppercase tracking-[0.04em] text-[#89939a]">
              <tr className="border-b border-[#edf0f2]">
                <th className="px-5 py-3">Role / company</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Salary range</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0f2]">
              {matching.map((job) => {
                const company = companyFor(job.companyId);
                return (
                  <tr key={job.id}>
                    <td className="px-5 py-3.5">
                      <span className="block text-xs font-medium text-[#42525a]">{job.title}</span>
                      <span className="mt-1 block text-[10px] text-[#89949a]">{company?.name}</span>
                    </td>
                    <td className="px-3 py-3.5 text-[11px] text-[#6e7b82]">{job.location}</td>
                    <td className="px-3 py-3.5 text-[11px] text-[#53636b]">{formatRange(job)}</td>
                    <td className="px-3 py-3.5 text-[11px] text-[#77848a]">{job.source}</td>
                    <td className="px-4 py-3.5 text-[10px] text-[#89949a]">Oct 27, 2026</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!matching.length ? (
            <EmptyState
              title="No salary records match"
              description="Change your search to see other sample opportunities."
            />
          ) : null}
        </div>
      </Panel>
    </>
  );
}
