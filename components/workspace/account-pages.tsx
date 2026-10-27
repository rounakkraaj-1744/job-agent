"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { IconCheck, IconFileCv, IconLink, IconShieldCheck, IconUpload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useDemoState } from "@/components/shared/demo-state";
import {
  companies,
  type DemoSettings,
  type SkillCategory,
  type ProfileSkill,
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
} from "./primitives";

export function ResumesPage() {
  const { resumes, setResumes, applications, jobs } = useDemoState();
  const [selected, setSelected] = useState<Resume | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingArchive, setPendingArchive] = useState<Resume | null>(null);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setNotice("Choose a PDF file. The file stays in this browser and is not uploaded.");
      event.target.value = "";
      return;
    }
    const record: Resume = {
      id: `resume-local-${resumes.length + 1}`,
      name: file.name.replace(/\.pdf$/i, ""),
      target: "New resume variant",
      version: "v1",
      updated: "Oct 27, 2026",
      fileName: file.name,
      fileType: "PDF",
      default: false,
      skills: [],
      experience: "Add an experience summary to this resume record.",
    };
    setResumes((items) => [...items, record]);
    setNotice(`${file.name} was selected locally. No upload or parsing occurred.`);
    event.target.value = "";
  }

  function setDefault(id: string) {
    setResumes((items) => items.map((resume) => ({ ...resume, default: resume.id === id })));
    setNotice("Default resume changed in the local workspace.");
  }

  function saveName() {
    if (!selected || !nameDraft.trim()) return;
    setResumes((items) =>
      items.map((resume) =>
        resume.id === selected.id ? { ...resume, name: nameDraft.trim() } : resume,
      ),
    );
    setSelected((resume) => (resume ? { ...resume, name: nameDraft.trim() } : null));
    setNotice("Resume name updated.");
  }

  function archiveSelected() {
    if (!selected) return;
    if (selected.default) {
      setNotice("Choose another default resume before archiving this one.");
      return;
    }
    setPendingArchive(selected);
    setSelected(null);
  }

  function confirmArchive() {
    if (!pendingArchive) return;
    setResumes((items) => items.filter((resume) => resume.id !== pendingArchive.id));
    setPendingArchive(null);
    setNotice("Resume removed from this local demo workspace.");
  }

  function replaceFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !selected) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setNotice("Choose a PDF file. The file stays in this browser and is not uploaded.");
      event.target.value = "";
      return;
    }
    const versionNumber = Number.parseInt(selected.version.slice(1), 10) || 1;
    const updatedResume = {
      ...selected,
      fileName: file.name,
      version: `v${versionNumber + 1}`,
      updated: "Oct 27, 2026",
    };
    setResumes((items) =>
      items.map((resume) => (resume.id === selected.id ? updatedResume : resume)),
    );
    setSelected(updatedResume);
    setNotice(`${file.name} was selected as a local replacement. No upload occurred.`);
    event.target.value = "";
  }

  return (
    <>
      <PageTitle
        title="Resumes"
        description="Keep focused resume variants ready for review. Your master profile remains separate from these files."
        action={
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-[#244f63] px-3 text-xs font-medium text-white hover:bg-[#1d4355]">
            <IconUpload size={15} /> Select PDF
            <Input
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={chooseFile}
              aria-label="Select resume PDF"
            />
          </label>
        }
      />
      {notice ? (
        <div className="mb-4">
          <Notice
            tone={
              notice.startsWith("Choose a PDF")
                ? "warning"
                : notice.includes("selected locally") || notice.includes("local replacement")
                  ? "info"
                  : "success"
            }
          >
            {notice}
          </Notice>
        </div>
      ) : null}
      <Notice>
        Files are selected locally for this prototype. JobPilot does not upload, parse, or store
        resume documents on a server.
      </Notice>
      <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {resumes.map((resume) => {
          const linked = applications.filter((application) => application.resumeId === resume.id);
          return (
            <Panel key={resume.id}>
              <div className="flex items-start gap-3 p-4 sm:p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f0f4f5] text-[#527789]">
                  <IconFileCv size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-[#33434b]">{resume.name}</h2>
                    {resume.default ? (
                      <span className="rounded border border-[#d9e7dc] bg-[#f1f7f2] px-1.5 py-0.5 text-[9px] text-[#507258]">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] text-[#7b878e]">{resume.target}</p>
                  <p className="mt-3 truncate text-[10px] text-[#88939a]">
                    {resume.fileName} · {resume.fileType} · {resume.version}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 border-t border-[#edf0f2] px-4 py-3.5 text-[10px] sm:px-5">
                <span className="text-[#8a959b]">Last updated</span>
                <span className="text-right text-[#5e6d74]">{resume.updated}</span>
                <span className="text-[#8a959b]">Linked applications</span>
                <span className="text-right text-[#5e6d74]">{linked.length}</span>
                <span className="text-[#8a959b]">Target</span>
                <span className="text-right text-[#5e6d74]">{resume.target}</span>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-[#edf0f2] px-4 py-3 sm:px-5">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setSelected(resume);
                    setNameDraft(resume.name);
                  }}
                >
                  View details
                </Button>
                {!resume.default ? (
                  <Button size="xs" variant="ghost" onClick={() => setDefault(resume.id)}>
                    Set as default
                  </Button>
                ) : null}
              </div>
            </Panel>
          );
        })}
      </div>
      {selected ? (
        <Modal
          title={selected.name}
          description={`${selected.target} · ${selected.version}`}
          onClose={() => setSelected(null)}
          wide
        >
          <div className="grid gap-5 md:grid-cols-[1fr_0.85fr]">
            <div className="space-y-4">
              <Field label="Resume name">
                <Input
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  className={controlClass}
                />
              </Field>
              <div className="rounded-md border border-[#e7ebed] p-3">
                <p className="text-[10px] font-medium text-[#68767d]">File details</p>
                <p className="mt-1.5 text-xs text-[#45555d]">{selected.fileName}</p>
                <p className="mt-1 text-[10px] text-[#8a959b]">
                  {selected.fileType} · {selected.version} · Updated {selected.updated}
                </p>
              </div>
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[#dfe5e8] px-2.5 text-[10px] text-[#58676f] hover:bg-[#f7f9fa]">
                <IconUpload size={13} /> Replace PDF
                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={replaceFile}
                  aria-label={`Replace ${selected.name} PDF`}
                />
              </label>
              <div>
                <p className="text-[10px] font-medium text-[#68767d]">Target roles</p>
                <p className="mt-1.5 text-xs text-[#45555d]">{selected.target}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#68767d]">Associated skills</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.skills.length ? (
                    selected.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-[#f1f4f5] px-2 py-1 text-[10px] text-[#5e6c73]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-[#929ca2]">No skills added</span>
                  )}
                </div>
              </div>
              <p className="text-[11px] leading-5 text-[#748188]">{selected.experience}</p>
            </div>
            <div>
              <Panel title="Linked applications">
                {applications.filter((application) => application.resumeId === selected.id)
                  .length ? (
                  <div className="divide-y divide-[#edf0f2]">
                    {applications
                      .filter((application) => application.resumeId === selected.id)
                      .map((application) => {
                        const job = jobs.find((record) => record.id === application.jobId);
                        const company = companies.find((record) => record.id === job?.companyId);
                        return (
                          <div key={application.id} className="flex items-center gap-2.5 px-4 py-3">
                            <CompanyMark
                              name={company?.name ?? ""}
                              initials={company?.initials}
                              size="sm"
                            />
                            <span>
                              <span className="block text-[11px] text-[#4c5c64]">{job?.title}</span>
                              <span className="mt-1 block text-[10px] text-[#89949a]">
                                {application.status}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <EmptyState
                    title="No linked applications"
                    description="Select this resume when reviewing a job to link it to an application."
                  />
                )}
              </Panel>
              <Panel title="Version history" className="mt-4">
                <div className="px-4 py-3 text-[11px] leading-5 text-[#738087]">
                  {selected.version} · {selected.updated}
                  <br />
                  Earlier versions are sample records for this prototype.
                </div>
              </Panel>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-[#edf0f2] pt-4">
            <Button size="sm" variant="destructive" onClick={archiveSelected}>
              Archive resume
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button size="sm" onClick={saveName}>
                Save name
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
      {pendingArchive ? (
        <Modal
          title="Archive resume?"
          description="This removes the resume from the local demo list. Applications that reference it will retain their record."
          onClose={() => setPendingArchive(null)}
        >
          <div className="space-y-4">
            <Notice tone="warning">
              This action affects only local demo state. The file itself was never uploaded.
            </Notice>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPendingArchive(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmArchive}>
                Archive resume
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

const profileFields = [
  { key: "name", label: "Full name" },
  { key: "headline", label: "Professional headline" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone (optional)" },
  { key: "location", label: "Location" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "github", label: "GitHub URL" },
  { key: "portfolio", label: "Portfolio URL" },
  { key: "leetcode", label: "LeetCode URL" },
  { key: "otherLinks", label: "Other professional links" },
  { key: "targetRoles", label: "Target roles" },
  { key: "graduationYear", label: "Graduation year" },
  { key: "monthlyMinimum", label: "Minimum monthly compensation (INR)" },
  { key: "education", label: "Education history" },
  { key: "experience", label: "Work experience" },
  { key: "internships", label: "Internships" },
  { key: "projects", label: "Projects" },
] as const;

const skillCategories: SkillCategory[] = [
  "Programming languages",
  "Backend frameworks",
  "Databases",
  "Cloud platforms",
  "DevOps & infrastructure",
  "AI & GenAI",
  "Other skills",
];

export function ProfilePage() {
  const { profile, setProfile } = useDemoState();
  const [draft, setDraft] = useState(profile);
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Programming languages");
  const filled = profileFields.filter((field) => draft[field.key].trim()).length;
  const completion = Math.round((filled / profileFields.length) * 100);

  function updateField(key: (typeof profileFields)[number]["key"], value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function discard() {
    setDraft(profile);
    setDirty(false);
    setNotice("Unsaved profile changes were discarded.");
  }

  function save() {
    if (!draft.name.trim() || !draft.email.includes("@")) {
      setNotice("Enter a name and a valid email address before saving.");
      return;
    }
    setProfile(draft);
    setDirty(false);
    setNotice("Profile changes saved in the local workspace.");
  }

  return (
    <>
      <PageTitle
        title="My profile"
        description="Review the professional facts used to tailor job matches and application materials."
        action={
          <div className="flex gap-2">
            <Button variant="outline" disabled={!dirty} onClick={discard}>
              Discard changes
            </Button>
            <Button disabled={!dirty} onClick={save}>
              Save changes
            </Button>
          </div>
        }
      />
      {notice ? (
        <div className="mb-4">
          <Notice tone={notice.includes("valid") ? "warning" : "success"}>{notice}</Notice>
        </div>
      ) : null}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.65fr)]">
        <div className="space-y-5">
          <Panel
            title="Professional identity"
            description="Your master profile is separate from resume variants."
          >
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
              {profileFields.map((field) => (
                <Field key={field.key} label={field.label}>
                  {["education", "experience", "internships", "projects"].includes(field.key) ? (
                    <Textarea
                      value={draft[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      rows={3}
                      placeholder="Add dates, responsibilities, and outcomes you can verify."
                      className={`${controlClass} h-auto py-2`}
                    />
                  ) : (
                    <Input
                      value={draft[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      type={
                        field.key === "email"
                          ? "email"
                          : field.key === "monthlyMinimum" || field.key === "graduationYear"
                            ? "number"
                            : "text"
                      }
                      className={controlClass}
                    />
                  )}
                </Field>
              ))}
            </div>
          </Panel>
          <Panel
            title="Technical skills"
            description="Skills are user-provided; no proficiency levels are inferred."
          >
            <div className="space-y-4 px-4 py-4 sm:px-5">
              {skillCategories.map((category) => {
                const categorySkills = draft.skills.filter((skill) => skill.category === category);
                return (
                  <div key={category}>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[#859198]">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-2 rounded border border-[#e4e9eb] bg-[#fafbfb] px-2.5 py-1.5 text-[11px] text-[#56656d]"
                        >
                          {skill.name}
                          <button
                            type="button"
                            aria-label={`Remove ${skill.name}`}
                            onClick={() => {
                              setDraft((current) => ({
                                ...current,
                                skills: current.skills.filter((item) => item.id !== skill.id),
                              }));
                              setDirty(true);
                            }}
                            className="text-[#87939a] hover:text-[#3e515a]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {!categorySkills.length ? (
                        <span className="text-[10px] text-[#9aa3a8]">No skills added</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <form
                className="flex flex-wrap gap-2 border-t border-[#edf0f2] pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const value = newSkill.trim();
                  const exists = draft.skills.some(
                    (skill) =>
                      skill.name.toLowerCase() === value.toLowerCase() &&
                      skill.category === newSkillCategory,
                  );
                  if (value && !exists) {
                    const skill: ProfileSkill = {
                      id: `${newSkillCategory}-${value.toLowerCase().replaceAll(" ", "-")}`,
                      name: value,
                      category: newSkillCategory,
                    };
                    setDraft((current) => ({ ...current, skills: [...current.skills, skill] }));
                    setDirty(true);
                    setNewSkill("");
                  }
                }}
              >
                <Input
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  placeholder="Add skill"
                  className="h-8 w-36 rounded-md border border-[#dfe5e8] px-2 text-[11px] outline-none focus:border-[#7da4b2]"
                />
                <NativeSelect
                  value={newSkillCategory}
                  onChange={(event) => {
                    const category = skillCategories.find((item) => item === event.target.value);
                    if (category) setNewSkillCategory(category);
                  }}
                  className="h-8 rounded-md border border-[#dfe5e8] bg-white px-2 text-[11px]"
                >
                  {skillCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </NativeSelect>
                <Button size="sm" variant="outline" type="submit">
                  Add skill
                </Button>
              </form>
            </div>
          </Panel>
          <Panel
            title="Experience & education"
            description="Add or review your own dates, responsibilities, and achievements."
          >
            <div className="px-4 py-4 text-[11px] leading-5 text-[#7d898f] sm:px-5">
              Enter only verified education, work, internship, and project details in the editable
              fields above. Include dates and concrete responsibilities or outcomes where
              applicable.
            </div>
          </Panel>
          <Panel
            title="Verified profile facts"
            description="Review details before using them in application materials."
          >
            <div className="divide-y divide-[#edf0f2]">
              {[
                {
                  id: "identity",
                  label: "Name and contact details",
                  complete: Boolean(draft.name && draft.email),
                },
                {
                  id: "preferences",
                  label: "Target role preferences",
                  complete: Boolean(draft.targetRoles),
                },
                {
                  id: "education",
                  label: "Education and graduation year",
                  complete: Boolean(draft.education && draft.graduationYear),
                },
                { id: "skills", label: "Technical skills", complete: draft.skills.length > 0 },
              ].map((fact) => {
                const reviewed = draft.reviewedFacts.includes(fact.id);
                return (
                  <div
                    key={fact.id}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
                  >
                    <span className="text-xs text-[#536169]">{fact.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#728087]">
                        {!fact.complete ? "Incomplete" : reviewed ? "Reviewed" : "Needs review"}
                      </span>
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        disabled={!fact.complete}
                        onClick={() => {
                          setDraft((current) => ({
                            ...current,
                            reviewedFacts: reviewed
                              ? current.reviewedFacts.filter((id) => id !== fact.id)
                              : [...current.reviewedFacts, fact.id],
                          }));
                          setDirty(true);
                        }}
                      >
                        {reviewed ? "Undo" : "Mark reviewed"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel
            title="Profile completion"
            description="A guide to information that can improve matching."
          >
            <div className="px-4 py-4 sm:px-5">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-[#2e3e46]">{completion}%</span>
                <span className="text-[10px] text-[#89949a]">
                  {filled} of {profileFields.length} key fields
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded bg-[#edf1f2]">
                <div className="h-full rounded bg-[#6f98a6]" style={{ width: `${completion}%` }} />
              </div>
              <ul className="mt-4 space-y-2 text-[11px] text-[#69777e]">
                <li className="flex gap-2">
                  <IconCheck size={14} className="text-[#6b927d]" /> Add technical skills so role
                  matches are more relevant.
                </li>
                <li className="flex gap-2">
                  <IconLink size={14} className="text-[#8b969c]" /> Add a portfolio link if you want
                  to share projects.
                </li>
                <li className="flex gap-2">
                  <IconShieldCheck size={14} className="text-[#8b969c]" /> Review education and
                  eligibility details.
                </li>
              </ul>
            </div>
          </Panel>
          <Panel title="Career preferences">
            <div className="space-y-3 px-4 py-4 text-[11px] sm:px-5">
              <p>
                <span className="text-[#8a959b]">Work mode</span>
                <span className="float-right text-[#536169]">Remote · Hybrid</span>
              </p>
              <p>
                <span className="text-[#8a959b]">Employment</span>
                <span className="float-right text-[#536169]">Full-time · Internship</span>
              </p>
              <p>
                <span className="text-[#8a959b]">Availability</span>
                <span className="float-right text-[#536169]">Open to opportunities</span>
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

const integrationItems = [
  ["Google Calendar", "Calendar events and interview reminders", "Not connected"],
  ["Gmail", "Email drafting and conversation references", "Not connected"],
  ["Google sign-in", "Account authentication", "Not connected"],
  ["LinkedIn", "Professional profile links where supported", "Limited support"],
  ["GitHub", "Public project profile references", "Not connected"],
  ["Job sources", "Search discovery across supported job boards", "Mock data only"],
  ["Gemini", "Optional AI-assisted drafting", "Not configured"],
  ["Groq", "Optional AI-assisted drafting", "Not configured"],
];

export function IntegrationsPage() {
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageTitle
        title="Integrations"
        description="Manage optional connections. Availability depends on provider access, permissions, and supported APIs."
      />
      {notice ? (
        <div className="mb-4">
          <Notice>{notice}</Notice>
        </div>
      ) : null}
      <Notice>
        All connection, configuration, and sync controls are placeholders. No OAuth or external
        account connection is performed.
      </Notice>
      <div className="mt-5 space-y-3">
        {integrationItems.map(([name, purpose, status], index) => (
          <Panel key={name}>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f1f4f5] text-[#597989]">
                <span className="text-xs font-semibold">
                  {name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xs font-semibold text-[#36464e]">{name}</h2>
                  <span className="rounded border border-[#e4e9eb] bg-[#fafbfb] px-1.5 py-0.5 text-[9px] text-[#77848a]">
                    {status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#818d94]">{purpose}</p>
                <p className="mt-1 text-[10px] text-[#9aa3a8]">
                  {index < 3
                    ? "Requested scopes: account access only after provider approval"
                    : "Last sync: not available"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() =>
                    setNotice(`${name} is not connected. No provider authorization was started.`)
                  }
                >
                  Connect
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() =>
                    setNotice(
                      `${name} settings are placeholders until integration support is available.`,
                    )
                  }
                >
                  Configure
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Panel
        className="mt-5"
        title="AI provider usage"
        description="Mock quota details; API keys are never displayed here."
      >
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-3 sm:px-5">
          <div>
            <p className="text-[10px] text-[#89949a]">Configured provider</p>
            <p className="mt-1 text-xs font-medium text-[#47575f]">Not configured</p>
          </div>
          <div>
            <p className="text-[10px] text-[#89949a]">Usage today</p>
            <p className="mt-1 text-xs font-medium text-[#47575f]">8 / 25 draft suggestions</p>
          </div>
          <div>
            <p className="text-[10px] text-[#89949a]">Remaining quota</p>
            <p className="mt-1 text-xs font-medium text-[#47575f]">17 mock suggestions</p>
          </div>
        </div>
      </Panel>
    </>
  );
}

export function SettingsPage() {
  const { settings, setSettings } = useDemoState();
  const [notice, setNotice] = useState("");
  const [dangerOpen, setDangerOpen] = useState(false);
  const [section, setSection] = useState("General");
  const tabs = [
    "General",
    "Job search",
    "AI preferences",
    "Automation",
    "Notifications",
    "Privacy & security",
  ];
  const notificationSettings = [
    {
      key: "interviewReminders",
      title: "Interview reminders",
      detail: "Before scheduled interviews",
    },
    { key: "followUpReminders", title: "Follow-up reminders", detail: "When reminders are due" },
    {
      key: "newMatchingJobs",
      title: "New matching jobs",
      detail: "When new matches are available",
    },
    { key: "integrationErrors", title: "Integration errors", detail: "For connection issues" },
    { key: "emailNotifications", title: "Email notifications", detail: "Send email alerts" },
  ] as const;

  function toggle(
    key: keyof Pick<
      DemoSettings,
      | "discoveryEnabled"
      | "draftingEnabled"
      | "matchExplanations"
      | "reviewBeforeSubmit"
      | "interviewReminders"
      | "followUpReminders"
      | "newMatchingJobs"
      | "integrationErrors"
      | "emailNotifications"
    >,
  ) {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
    setNotice("Preference changed in local demo state; it is not saved to a backend.");
  }

  function save() {
    setNotice("Settings saved locally for this workspace session.");
  }

  return (
    <>
      <PageTitle
        title="Settings"
        description="Control how the demo workspace presents and manages your job search."
        action={<Button onClick={save}>Save changes</Button>}
      />
      {notice ? (
        <div className="mb-4">
          <Notice>{notice}</Notice>
        </div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto lg:block lg:space-y-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSection(tab)}
              className={`shrink-0 rounded-md px-3 py-2 text-left text-[11px] lg:block lg:w-full ${section === tab ? "bg-[#eaf0f3] font-semibold text-[#31586a]" : "text-[#748188] hover:bg-[#f1f4f5]"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="space-y-5">
          {section === "General" ? (
            <Panel
              title="General preferences"
              description="Use clear local conventions for dates, currency, and target roles."
            >
              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                <Field label="Display name">
                  <Input
                    value={settings.displayName}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, displayName: event.target.value }))
                    }
                    placeholder="Add your preferred name"
                    className={controlClass}
                  />
                </Field>
                <Field label="Time zone">
                  <NativeSelect
                    value={settings.timezone}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, timezone: event.target.value }))
                    }
                    className={controlClass}
                  >
                    <option>Asia/Kolkata</option>
                    <option>UTC</option>
                    <option>America/Los_Angeles</option>
                  </NativeSelect>
                </Field>
                <Field label="Date format">
                  <NativeSelect
                    value={settings.dateFormat}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, dateFormat: event.target.value }))
                    }
                    className={controlClass}
                  >
                    <option>DD MMM YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </NativeSelect>
                </Field>
                <Field label="Default currency">
                  <NativeSelect
                    value={settings.currency}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, currency: event.target.value }))
                    }
                    className={controlClass}
                  >
                    <option>INR</option>
                    <option>USD</option>
                  </NativeSelect>
                </Field>
                <Field label="Default target role">
                  <NativeSelect
                    value={settings.defaultRole}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, defaultRole: event.target.value }))
                    }
                    className={controlClass}
                  >
                    <option>Backend Engineer</option>
                    <option>Platform Engineer</option>
                    <option>Cloud Engineer</option>
                    <option>AI Engineer</option>
                  </NativeSelect>
                </Field>
              </div>
            </Panel>
          ) : null}
          {section === "Job search" ? (
            <Panel
              title="Job search preferences"
              description="These preferences affect local filters only."
            >
              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                <Field label="Target minimum compensation (INR / month)">
                  <Input
                    value={settings.targetCompensation}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        targetCompensation: event.target.value,
                      }))
                    }
                    type="number"
                    className={controlClass}
                  />
                </Field>
                <Field label="Preferred locations">
                  <Input
                    value={settings.preferredLocations}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        preferredLocations: event.target.value,
                      }))
                    }
                    className={controlClass}
                  />
                </Field>
                <Field label="Work mode">
                  <NativeSelect
                    value={settings.workMode}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, workMode: event.target.value }))
                    }
                    className={controlClass}
                  >
                    <option>Any mode</option>
                    <option>Remote and hybrid</option>
                    <option>Remote only</option>
                    <option>Hybrid only</option>
                    <option>On-site only</option>
                  </NativeSelect>
                </Field>
                <Field label="Job sources">
                  <Input
                    value={settings.jobSources}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, jobSources: event.target.value }))
                    }
                    className={controlClass}
                  />
                </Field>
                <Field label="Minimum relevance score">
                  <Input
                    value={settings.minimumScore}
                    type="number"
                    min="0"
                    max="100"
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        minimumScore: Number(event.target.value),
                      }))
                    }
                    className={controlClass}
                  />
                </Field>
                <Field label="Graduation eligibility">
                  <NativeSelect
                    value={settings.graduationEligibility}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        graduationEligibility: event.target.value,
                      }))
                    }
                    className={controlClass}
                  >
                    <option>Any year</option>
                    <option>2026 and later</option>
                    <option>Internship eligible</option>
                  </NativeSelect>
                </Field>
              </div>
            </Panel>
          ) : null}
          {section === "AI preferences" ? (
            <Panel
              title="AI preferences"
              description="AI features are optional and always require your review."
            >
              <div className="divide-y divide-[#edf0f2]">
                <SettingToggle
                  title="AI-assisted drafting"
                  detail="Show editable suggestions in outreach."
                  checked={settings.draftingEnabled}
                  onChange={() => toggle("draftingEnabled")}
                />
                <SettingToggle
                  title="AI match explanations"
                  detail="Explain skill and preference alignment."
                  checked={settings.matchExplanations}
                  onChange={() => toggle("matchExplanations")}
                />
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <Field label="Preferred provider">
                    <NativeSelect
                      value={settings.aiProvider}
                      onChange={(event) =>
                        setSettings((current) => ({ ...current, aiProvider: event.target.value }))
                      }
                      className={controlClass}
                    >
                      <option>Not configured</option>
                      <option>Gemini</option>
                      <option>Groq</option>
                    </NativeSelect>
                  </Field>
                  <Field label="Daily usage limit">
                    <Input
                      type="number"
                      value={settings.dailyAiLimit}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          dailyAiLimit: Number(event.target.value),
                        }))
                      }
                      className={controlClass}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Notice>
                      Free-tier access, quotas, and models depend on provider terms and account
                      permissions. Usage shown is mock data.
                    </Notice>
                  </div>
                </div>
              </div>
            </Panel>
          ) : null}
          {section === "Automation" ? (
            <Panel
              title="Automation controls"
              description="Discovery and reminders do not run automatically in this frontend."
            >
              <div className="divide-y divide-[#edf0f2]">
                <SettingToggle
                  title="Job discovery"
                  detail="Pause or enable the local discovery preference. No searches run automatically."
                  checked={settings.discoveryEnabled}
                  onChange={() => toggle("discoveryEnabled")}
                />
                <SettingToggle
                  title="Review before submit"
                  detail="Keep human approval required before any application workflow."
                  checked={settings.reviewBeforeSubmit}
                  onChange={() => toggle("reviewBeforeSubmit")}
                />
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <Field label="Daily application review limit">
                    <Input
                      type="number"
                      value={settings.dailyReviewLimit}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          dailyReviewLimit: Number(event.target.value),
                        }))
                      }
                      className={controlClass}
                    />
                  </Field>
                  <Field label="Search schedule">
                    <NativeSelect
                      value={settings.searchSchedule}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          searchSchedule: event.target.value,
                        }))
                      }
                      className={controlClass}
                    >
                      <option>Manual only</option>
                      <option>Weekdays · 9:00 AM</option>
                      <option>Daily · 9:00 AM</option>
                    </NativeSelect>
                  </Field>
                </div>
              </div>
            </Panel>
          ) : null}
          {section === "Notifications" ? (
            <Panel
              title="Notifications"
              description="Notification preferences are local UI controls only."
            >
              <div className="divide-y divide-[#edf0f2]">
                {notificationSettings.map((item) => (
                  <SettingToggle
                    key={item.key}
                    title={item.title}
                    detail={item.detail}
                    checked={settings[item.key]}
                    onChange={() => toggle(item.key)}
                  />
                ))}
              </div>
            </Panel>
          ) : null}
          {section === "Privacy & security" ? (
            <div className="space-y-5">
              <Panel
                title="Connected accounts"
                description="No third-party account is connected in this demo."
              >
                <div className="px-4 py-4">
                  <p className="text-xs text-[#728087]">
                    You can review available provider permissions on the Integrations page.
                  </p>
                  <Link
                    href="/integrations"
                    className="mt-2 inline-block text-[11px] text-[#4f7b8b] hover:underline"
                  >
                    Manage integrations
                  </Link>
                </div>
              </Panel>
              <Panel
                title="Data and session"
                description="Frontend placeholders for future account controls."
              >
                <div className="flex flex-wrap gap-2 p-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNotice("Data export is a placeholder; no file was generated.")
                    }
                  >
                    Export data
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setNotice("No external accounts are connected.")}
                  >
                    Disconnect accounts
                  </Button>
                  <Button variant="outline" onClick={() => setDangerOpen(true)}>
                    Delete account
                  </Button>
                  <Link href="/login">
                    <Button variant="outline">Sign out</Button>
                  </Link>
                </div>
              </Panel>
              <Panel title="Danger zone">
                <div className="px-4 py-4">
                  <p className="text-[11px] leading-5 text-[#7c888f]">
                    Account deletion is not available in this frontend prototype. The confirmation
                    below explains the future action without changing or deleting your account.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                    onClick={() => setDangerOpen(true)}
                  >
                    Review delete action
                  </Button>
                </div>
              </Panel>
            </div>
          ) : null}
        </div>
      </div>
      {dangerOpen ? (
        <Modal
          title="Delete account"
          description="This destructive action is not available in the frontend prototype."
          onClose={() => setDangerOpen(false)}
        >
          <div className="space-y-4">
            <Notice tone="warning">
              No account or data will be deleted. Account deletion requires a future authenticated
              backend.
            </Notice>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setDangerOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

function SettingToggle({
  title,
  detail,
  checked,
  onChange,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#485860]">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-[#89949a]">{detail}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${checked ? "border-[#4b7f91] bg-[#4b7f91]" : "border-[#cfd7db] bg-[#e7ebed]"}`}
      >
        <span
          className={`absolute top-[2px] size-3.5 rounded-full bg-white transition-transform ${checked ? "translate-x-[17px]" : "translate-x-[2px]"}`}
        />
      </button>
    </div>
  );
}
