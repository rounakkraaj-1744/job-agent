"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  IconCalendarEvent,
  IconCheck,
  IconMail,
  IconPlus,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useDemoState } from "@/components/shared/demo-state";
import { companies, type CalendarEvent, type Contact, type FollowUp } from "@/lib/mock-data";
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

const companyFor = (id: string) => companies.find((company) => company.id === id);

function ContactDialog({ onClose }: { onClose: () => void }) {
  const { contacts, setContacts, jobs } = useDemoState();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyId, setCompanyId] = useState(companies[0].id);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      setError("Enter a contact name and a valid email address.");
      return;
    }
    const company = companyFor(companyId);
    const relatedJob = jobs.find((job) => job.companyId === companyId)?.id;
    const contact: Contact = {
      id: `contact-local-${contacts.length + 1}`,
      name: name.trim(),
      role: role.trim() || "Recruiting contact",
      companyId,
      email: email.trim(),
      linkedinUrl: linkedinUrl.trim() || undefined,
      source: "Manually added",
      jobId: relatedJob ?? jobs[0]?.id ?? "",
      contacted: "Not contacted",
      status: "New",
    };
    if (!company) return;
    setContacts((items) => [...items, contact]);
    onClose();
  }

  return (
    <Modal
      title="Add contact"
      description="Keep recruiter conversations linked to a company and opportunity."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={submit}>
        <Field label="Full name">
          <Input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={controlClass}
          />
        </Field>
        <Field label="Company">
          <NativeSelect
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            className={controlClass}
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Role">
          <Input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Technical recruiter"
            className={controlClass}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={controlClass}
          />
        </Field>
        <Field label="LinkedIn URL (optional)">
          <Input
            type="url"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="https://"
            className={controlClass}
          />
        </Field>
        {error ? (
          <p role="alert" className="text-xs text-[#98624e]">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end gap-2 border-t border-[#edf0f2] pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save contact</Button>
        </div>
      </form>
    </Modal>
  );
}

const templates = {
  "Cold outreach": {
    subject: "Interest in {{role}} at {{company}}",
    body: "Hi {{name}},\n\nI’m interested in the {{role}} opportunity at {{company}}. I’m particularly drawn to your work on {{specific team or product detail}}.\n\nMy relevant experience includes {{project or skills to highlight}}. I’d welcome the chance to learn more about the team’s priorities.\n\nBest,\nYour name",
  },
  "Referral request": {
    subject: "Could I ask about your experience at {{company}}?",
    body: "Hi {{name}},\n\nI’m exploring opportunities related to {{target role}} and noticed your work at {{company}}. If you have a few minutes, I’d value your perspective on the team and its hiring process.\n\nNo worries if you’re busy. Thank you for considering it.\n\nBest,\nYour name",
  },
  "Post-application follow-up": {
    subject: "Following up on my {{role}} application",
    body: "Hi {{name}},\n\nI recently applied for the {{role}} position at {{company}} and wanted to reiterate my interest. {{Add one relevant detail about your background or project.}}\n\nPlease let me know if any additional information would be useful.\n\nBest,\nYour name",
  },
  "Interview follow-up": {
    subject: "Thank you for the conversation",
    body: "Hi {{name}},\n\nThank you for speaking with me about the {{role}} position at {{company}}. I enjoyed learning about the team’s work and remain interested in the opportunity.\n\nPlease let me know if I can provide any further details.\n\nBest,\nYour name",
  },
} satisfies Record<string, { subject: string; body: string }>;

const templateNames = [
  "Cold outreach",
  "Referral request",
  "Post-application follow-up",
  "Interview follow-up",
] as const;
type TemplateName = (typeof templateNames)[number];
type OutreachTab = "Contacts" | "Email drafts" | "Outreach history";

export function OutreachPage() {
  const { contacts, drafts, jobs, resumes, setDrafts } = useDemoState();
  const [tab, setTab] = useState<OutreachTab>("Contacts");
  const [query, setQuery] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [templateName, setTemplateName] = useState<TemplateName>("Cold outreach");
  const [recipient, setRecipient] = useState("Ananya Rao");
  const [companyName, setCompanyName] = useState("Northstar Labs");
  const [jobTitle, setJobTitle] = useState("Backend Engineer, Developer Platform");
  const [selectedResume, setSelectedResume] = useState("resume-backend-ai");
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>(templates["Cold outreach"].subject);
  const [body, setBody] = useState<string>(templates["Cold outreach"].body);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(false);

  const filteredContacts = contacts.filter((contact) => {
    const company = companyFor(contact.companyId)?.name ?? "";
    return `${contact.name} ${contact.role} ${company}`.toLowerCase().includes(query.toLowerCase());
  });

  function selectTemplate(value: TemplateName) {
    setTemplateName(value);
    setSubject(templates[value].subject);
    setBody(templates[value].body);
  }

  function saveDraft() {
    const contact = contacts.find((item) => item.name === recipient) ?? contacts[0];
    const job = jobs.find((item) => item.title === jobTitle) ?? jobs[0];
    if (!contact || !job) {
      setNotice("Add a contact and related job before saving this draft.");
      return;
    }
    const draftId = selectedDraftId ?? `draft-local-${drafts.length + 1}`;
    setDrafts((items) => {
      const current = items.find((item) => item.id === draftId);
      const record = {
        id: draftId,
        contactId: contact.id,
        jobId: job.id,
        subject,
        body,
        resumeId: selectedResume,
        updated: "Oct 27, 2026",
      };
      return current
        ? items.map((item) => (item.id === draftId ? record : item))
        : [...items, record];
    });
    setSelectedDraftId(draftId);
    setNotice("Draft saved in the local workspace. It has not been sent.");
  }

  function loadDraft(draftId: string) {
    const draft = drafts.find((item) => item.id === draftId);
    if (!draft) return;
    const contact = contacts.find((item) => item.id === draft.contactId);
    const job = jobs.find((item) => item.id === draft.jobId);
    const company = companyFor(job?.companyId ?? contact?.companyId ?? "");
    setSelectedDraftId(draft.id);
    setRecipient(contact?.name ?? "");
    setCompanyName(company?.name ?? "");
    setJobTitle(job?.title ?? "");
    setSubject(draft.subject);
    setBody(draft.body);
    setSelectedResume(draft.resumeId);
    setTab("Email drafts");
  }

  const renderedSubject = subject
    .replaceAll("{{name}}", recipient)
    .replaceAll("{{company}}", companyName)
    .replaceAll("{{role}}", jobTitle);
  const renderedBody = body
    .replaceAll("{{name}}", recipient)
    .replaceAll("{{company}}", companyName)
    .replaceAll("{{role}}", jobTitle);

  return (
    <>
      <PageTitle
        title="HR & outreach"
        description="Manage professional conversations. A cold email is not a formal job application."
        action={
          tab === "Contacts" ? (
            <Button className="gap-1.5" onClick={() => setShowContact(true)}>
              <IconPlus size={15} /> Add contact
            </Button>
          ) : null
        }
      />
      {notice ? (
        <div className="mb-4">
          <Notice tone="success">{notice}</Notice>
        </div>
      ) : null}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#e4e9eb]">
        {(["Contacts", "Email drafts", "Outreach history"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`border-b-2 px-3 py-2.5 text-xs ${tab === item ? "border-[#4f8395] font-semibold text-[#30586a]" : "border-transparent text-[#78848b] hover:text-[#36464f]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Contacts" ? (
        <Panel
          title={`${filteredContacts.length} contacts`}
          description="Contact details and relationship status are local demo records."
          action={
            <Input
              aria-label="Search contacts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search contacts"
              className="h-8 w-40 rounded-md border border-[#dfe5e8] px-2.5 text-[11px] outline-none focus:border-[#7da4b2]"
            />
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-[#fafbfb] text-[10px] uppercase tracking-[0.04em] text-[#89939a]">
                <tr className="border-b border-[#edf0f2]">
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-3 py-3">Company / role</th>
                  <th className="px-3 py-3">Email · LinkedIn</th>
                  <th className="px-3 py-3">Related job</th>
                  <th className="px-4 py-3">Source · status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
                {filteredContacts.map((contact) => {
                  const company = companyFor(contact.companyId);
                  const job = jobs.find((item) => item.id === contact.jobId);
                  return (
                    <tr key={contact.id} className="hover:bg-[#fcfdfd]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8 place-items-center rounded-full bg-[#edf1f3] text-[10px] font-semibold text-[#536973]">
                            {contact.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")}
                          </span>
                          <span className="text-xs font-medium text-[#36464e]">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block text-xs text-[#536169]">{company?.name}</span>
                        <span className="mt-1 block text-[10px] text-[#8a959b]">
                          {contact.role}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block text-[11px] text-[#66747c]">{contact.email}</span>
                        {contact.linkedinUrl ? (
                          <a
                            href={contact.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block text-[10px] text-[#557d8b] hover:underline"
                          >
                            LinkedIn profile
                          </a>
                        ) : (
                          <span className="mt-1 block text-[10px] text-[#9aa3a8]">Not added</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-[11px] text-[#66747c]">
                        {job?.title ?? "General contact"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="block text-[11px] text-[#66747c]">{contact.source}</span>
                        <span className="mt-1 block text-[10px] text-[#859198]">
                          {contact.contacted} · {contact.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filteredContacts.length ? (
              <EmptyState
                title="No matching contacts"
                description="Try a different search or add a new recruiter contact."
              />
            ) : null}
          </div>
        </Panel>
      ) : null}
      {tab === "Email drafts" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
          <Panel
            title="Compose an email"
            description="Drafts stay editable. Sending is not connected."
          >
            <div className="space-y-4 p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Template">
                  <NativeSelect
                    value={templateName}
                    onChange={(event) => {
                      const selectedTemplate = templateNames.find(
                        (value) => value === event.target.value,
                      );
                      if (selectedTemplate) selectTemplate(selectedTemplate);
                    }}
                    className={controlClass}
                  >
                    {templateNames.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Recipient">
                  <NativeSelect
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    className={controlClass}
                  >
                    {contacts.map((contact) => (
                      <option key={contact.id}>{contact.name}</option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Company">
                  <Input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className={controlClass}
                  />
                </Field>
                <Field label="Related job">
                  <NativeSelect
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    className={controlClass}
                  >
                    {jobs.map((job) => (
                      <option key={job.id}>{job.title}</option>
                    ))}
                  </NativeSelect>
                </Field>
              </div>
              <Field label="Subject">
                <Input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className={controlClass}
                />
              </Field>
              <Field label="Message">
                <Textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={10}
                  className={`${controlClass} h-auto resize-y py-2.5 leading-5`}
                />
              </Field>
              <Field label="Resume variant">
                <NativeSelect
                  value={selectedResume}
                  onChange={(event) => setSelectedResume(event.target.value)}
                  className={controlClass}
                >
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <div className="flex flex-wrap gap-2 border-t border-[#edf0f2] pt-4">
                <Button type="button" variant="outline" onClick={saveDraft}>
                  Save draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreview((value) => !value)}
                >
                  {preview ? "Hide preview" : "Preview"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard
                      .writeText(`Subject: ${renderedSubject}\n\n${renderedBody}`)
                      .then(() => setNotice("Draft copied to clipboard."))
                      .catch(() => setNotice("Clipboard access is unavailable in this browser."));
                  }}
                >
                  Copy email
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setNotice("Email sending is not connected. The draft has not been sent.")
                  }
                >
                  Send
                </Button>
              </div>
              {preview ? (
                <div className="rounded-md border border-[#e7ebed] bg-[#fafbfb] p-4">
                  <p className="text-[10px] text-[#879198]">
                    TO: {recipient} · {companyName}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[#3a4951]">{renderedSubject}</p>
                  <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-[#65737b]">
                    {renderedBody}
                  </p>
                </div>
              ) : null}
            </div>
          </Panel>
          <div className="space-y-5">
            <Panel
              title="AI drafting assistance"
              description="Mock suggestions you can edit freely."
            >
              <div className="space-y-3 px-4 py-4">
                <Notice>
                  AI output is an editable draft suggestion. It is not sent or shared.
                </Notice>
                <p className="text-[11px] leading-5 text-[#738087]">
                  Include one specific reason you are interested in the team, mention a relevant
                  project, and ask a clear low-pressure question.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    setBody(
                      (value) =>
                        `${value}\n\nI was especially interested in your team's work on developer infrastructure and would be glad to share a short overview of a related project.`,
                    );
                    setNotice(
                      "A mock suggestion was added. Review and edit the message before using it.",
                    );
                  }}
                >
                  <IconSparkles size={14} /> Add suggestion
                </Button>
              </div>
            </Panel>
            <Panel title="Saved drafts">
              <div className="divide-y divide-[#edf0f2]">
                {drafts.map((draft) => {
                  const contact = contacts.find((item) => item.id === draft.contactId);
                  const job = jobs.find((item) => item.id === draft.jobId);
                  const company = companyFor(job?.companyId ?? "");
                  return (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => loadDraft(draft.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#fafbfb]"
                    >
                      <IconMail size={16} className="text-[#82919a]" />
                      <span>
                        <span className="block text-[11px] font-medium text-[#46565e]">
                          {draft.subject}
                        </span>
                        <span className="mt-1 block text-[10px] text-[#8a959b]">
                          {contact?.name} · {company?.name} · {draft.updated}
                        </span>
                      </span>
                    </button>
                  );
                })}
                {!drafts.length ? (
                  <EmptyState
                    title="No saved drafts yet"
                    description="Save a draft to keep it available as you navigate."
                  />
                ) : null}
              </div>
            </Panel>
          </div>
        </div>
      ) : null}
      {tab === "Outreach history" ? (
        <Panel
          title="Outreach history"
          description="Email events are mock records; no messages have been delivered by JobPilot."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#fafbfb] text-[10px] uppercase tracking-[0.04em] text-[#89939a]">
                <tr className="border-b border-[#edf0f2]">
                  <th className="px-5 py-3">Message</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">Company / job</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0f2]">
                {contacts.map((contact, index) => {
                  const company = companyFor(contact.companyId);
                  const job = jobs.find((item) => item.id === contact.jobId);
                  return (
                    <tr key={contact.id}>
                      <td className="px-5 py-3.5 text-xs text-[#46565e]">
                        {
                          ["Post-application follow-up", "Cold outreach", "Referral request"][
                            index % 3
                          ]
                        }
                      </td>
                      <td className="px-3 py-3.5 text-[11px] text-[#6a777e]">{contact.name}</td>
                      <td className="px-3 py-3.5 text-[11px] text-[#6a777e]">
                        {company?.name}
                        <span className="mt-1 block text-[10px] text-[#8a959b]">{job?.title}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="rounded border border-[#e7e1d7] bg-[#faf7f0] px-2 py-1 text-[10px] text-[#806b48]">
                          {contact.status === "Replied" ? "Replied" : "Drafted"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[10px] text-[#7d898f]">
                        {contact.contacted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}
      {showContact ? <ContactDialog onClose={() => setShowContact(false)} /> : null}
    </>
  );
}

function CalendarEventDialog({ onClose }: { onClose: () => void }) {
  const { setEvents, applications, jobs } = useDemoState();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("2026-11-03");
  const [time, setTime] = useState("10:00");
  const [kind, setKind] = useState<CalendarEvent["kind"]>("Interview");
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [reminder, setReminder] = useState("30 minutes before");
  const [applicationId, setApplicationId] = useState("");
  const [note, setNote] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEvents((items) => [
      ...items,
      {
        id: `event-local-${items.length + 1}`,
        title: title.trim(),
        company: company.trim() || "Personal",
        date,
        time,
        kind,
        note: note.trim(),
        durationMinutes: Number(durationMinutes),
        meetingUrl: meetingUrl.trim(),
        reminder,
        applicationId,
      },
    ]);
    onClose();
  }

  return (
    <Modal
      title="Add calendar event"
      description="This event is stored locally in JobPilot; external calendar sync is not active."
      onClose={onClose}
    >
      <form onSubmit={save} className="space-y-4">
        <Field label="Event title">
          <Input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={controlClass}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company">
            <Input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className={controlClass}
            />
          </Field>
          <Field label="Event type">
            <NativeSelect
              value={kind}
              onChange={(event) => {
                const nextKind = eventKinds.find((item) => item === event.target.value);
                if (nextKind) setKind(nextKind);
              }}
              className={controlClass}
            >
              {eventKinds.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Date">
            <Input
              required
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={controlClass}
            />
          </Field>
          <Field label="Time">
            <Input
              required
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={controlClass}
            />
          </Field>
          <Field label="Duration (minutes)">
            <Input
              required
              type="number"
              min="5"
              step="5"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              className={controlClass}
            />
          </Field>
          <Field label="Reminder">
            <NativeSelect
              value={reminder}
              onChange={(event) => setReminder(event.target.value)}
              className={controlClass}
            >
              <option>10 minutes before</option>
              <option>30 minutes before</option>
              <option>1 hour before</option>
              <option>1 day before</option>
            </NativeSelect>
          </Field>
        </div>
        <Field label="Meeting URL (optional)">
          <Input
            type="url"
            value={meetingUrl}
            onChange={(event) => setMeetingUrl(event.target.value)}
            placeholder="https://"
            className={controlClass}
          />
        </Field>
        <Field label="Related application (optional)">
          <NativeSelect
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
            className={controlClass}
          >
            <option value="">No linked application</option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {jobs.find((job) => job.id === application.jobId)?.title ?? "Application"}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Preparation notes">
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className={`${controlClass} h-auto py-2`}
          />
        </Field>
        <div className="flex justify-end gap-2 border-t border-[#edf0f2] pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add event</Button>
        </div>
      </form>
    </Modal>
  );
}

const eventKinds: CalendarEvent["kind"][] = [
  "Interview",
  "Recruiter call",
  "Assessment",
  "Follow-up",
  "Reminder",
];

export function CalendarPage() {
  const { events } = useDemoState();
  const [view, setView] = useState("Agenda");
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState("");
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
    [events],
  );

  return (
    <>
      <PageTitle
        title="Interviews & calendar"
        description="Keep interviews, deadlines, and reminders organized in one place."
        action={
          <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
            <IconPlus size={15} /> Add event
          </Button>
        }
      />
      {notice ? (
        <div className="mb-4">
          <Notice>{notice}</Notice>
        </div>
      ) : null}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-[#e4e9eb] bg-white p-1">
          {["Month", "Week", "Agenda"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`rounded px-3 py-1.5 text-[11px] ${view === item ? "bg-[#eaf0f3] font-semibold text-[#31586a]" : "text-[#78848b]"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#78848b]">
          <span className="size-2 rounded-full bg-[#6d94a3]" /> Created in JobPilot
          <span className="ml-2 size-2 rounded-full border border-[#aab5bb]" /> External calendar
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
        <Panel
          title={`October 2026 · ${view} view`}
          description="Calendar items below are local demo events, not synchronized."
        >
          {view === "Agenda" ? (
            <div className="divide-y divide-[#edf0f2]">
              {sortedEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 px-4 py-4 sm:px-5">
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-[9px] uppercase text-[#859198]">
                      {event.date.slice(5, 7) === "10" ? "Oct" : "Nov"}
                    </p>
                    <p className="mt-0.5 text-xl font-semibold text-[#34444c]">
                      {event.date.slice(8, 10)}
                    </p>
                    <p className="text-[10px] text-[#879299]">{event.time}</p>
                  </div>
                  <div className="min-w-0 flex-1 border-l-2 border-[#7097a5] pl-4">
                    <p className="text-xs font-semibold text-[#34444c]">{event.title}</p>
                    <p className="mt-1 text-[11px] text-[#78858c]">
                      {event.company} · {event.kind}
                    </p>
                    <p className="mt-1.5 text-[11px] text-[#8a959b]">
                      {event.note || "No notes added yet."} · {event.durationMinutes} min · Reminder{" "}
                      {event.reminder}
                    </p>
                    {event.meetingUrl ? (
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-[10px] text-[#527b8b] hover:underline"
                      >
                        Meeting link
                      </a>
                    ) : null}
                  </div>
                  <span className="rounded border border-[#e4e9eb] px-2 py-1 text-[9px] text-[#6c7980]">
                    Local
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 border-b border-[#edf0f2] bg-[#fafbfb] text-center text-[10px] text-[#859198]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2.5">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {(view === "Month"
                  ? [
                      ...Array.from({ length: 4 }, () => null),
                      ...Array.from({ length: 31 }, (_, index) => index + 1),
                    ]
                  : Array.from({ length: 7 }, (_, index) => index + 25)
                ).map((day, index) => {
                  const eventsForDay =
                    day === null
                      ? []
                      : sortedEvents.filter(
                          (event) =>
                            event.date.startsWith("2026-10") &&
                            Number(event.date.slice(8, 10)) === day,
                        );
                  return (
                    <div
                      key={`${day ?? "empty"}-${index}`}
                      className="min-h-20 border-b border-r border-[#edf0f2] p-1.5 sm:min-h-24 sm:p-2"
                    >
                      {day !== null ? (
                        <span className="text-[10px] text-[#7d898f]">{day}</span>
                      ) : null}
                      {eventsForDay.map((event) => (
                        <div
                          key={event.id}
                          className="mt-1 truncate rounded bg-[#eef4f6] px-1 py-1 text-[9px] text-[#456779]"
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Panel>
        <div className="space-y-5">
          <Panel title="Upcoming interviews" description="Prepare for the next conversation.">
            <div className="divide-y divide-[#edf0f2]">
              {events
                .filter((event) => ["Interview", "Recruiter call"].includes(event.kind))
                .map((event) => (
                  <div key={event.id} className="px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <IconCalendarEvent size={16} className="mt-0.5 text-[#7996a2]" />
                      <div>
                        <p className="text-xs font-semibold text-[#3b4a52]">{event.title}</p>
                        <p className="mt-1 text-[10px] text-[#829097]">
                          {event.company} · {event.date} · {event.time}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 pl-6 text-[10px] leading-4 text-[#89949a]">{event.note}</p>
                  </div>
                ))}
            </div>
          </Panel>
          <Panel title="Google Calendar" description="No external calendar account is connected.">
            <div className="px-4 py-4">
              <Notice>
                Sync controls are placeholders. JobPilot cannot read or write external calendars in
                this demo.
              </Notice>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() =>
                  setNotice("Calendar sync is not connected. No external data was accessed.")
                }
              >
                Sync calendar
              </Button>
            </div>
          </Panel>
        </div>
      </div>
      {showAdd ? <CalendarEventDialog onClose={() => setShowAdd(false)} /> : null}
    </>
  );
}

export function FollowUpsPage() {
  const { followUps, setFollowUps, jobs, contacts } = useDemoState();
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All dates");
  const [showAdd, setShowAdd] = useState(false);
  const today = "2026-10-27";
  const groups = [
    {
      title: "Due today",
      items: followUps.filter((item) => !item.completed && item.due === today),
    },
    { title: "Overdue", items: followUps.filter((item) => !item.completed && item.due < today) },
    { title: "Upcoming", items: followUps.filter((item) => !item.completed && item.due > today) },
    { title: "Completed", items: followUps.filter((item) => item.completed) },
  ];
  const visibleGroups =
    filter === "All dates" ? groups : groups.filter((group) => group.title === filter);

  function updateReminder(item: FollowUp, values: Partial<FollowUp>) {
    setFollowUps((items) =>
      items.map((record) => (record.id === item.id ? { ...record, ...values } : record)),
    );
  }

  return (
    <>
      <PageTitle
        title="Follow-ups"
        description="A calm, actionable queue for recruiter check-ins and next steps."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1.5" onClick={() => setShowAdd(true)}>
              <IconPlus size={15} /> Add reminder
            </Button>
            <Button asChild className="gap-1.5">
              <Link href="/outreach">
                <IconMail size={15} /> Draft follow-up
              </Link>
            </Button>
          </div>
        }
      />
      {notice ? (
        <div className="mb-4">
          <Notice tone="success">{notice}</Notice>
        </div>
      ) : null}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-[11px] text-[#7d898f]">
          <span>{followUps.filter((item) => !item.completed && item.due <= today).length} due</span>
          <span>·</span>
          <span>{followUps.filter((item) => item.completed).length} completed</span>
        </div>
        <NativeSelect
          aria-label="Filter follow-ups"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-8 rounded-md border border-[#dfe5e8] bg-white px-2.5 text-[11px] text-[#5d6b73]"
        >
          {["All dates", "Due today", "Overdue", "Upcoming", "Completed"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-5">
        {visibleGroups.map((group) => (
          <Panel
            key={group.title}
            title={group.title}
            description={
              group.items.length
                ? `${group.items.length} reminder${group.items.length !== 1 ? "s" : ""}`
                : undefined
            }
          >
            {group.items.length ? (
              <div className="divide-y divide-[#edf0f2]">
                {group.items.map((item) => {
                  const job = jobs.find((record) => record.id === item.jobId);
                  const contact = contacts.find((record) => record.id === item.contactId);
                  const company = companyFor(job?.companyId ?? "");
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <CompanyMark
                          name={company?.name ?? ""}
                          initials={company?.initials}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold text-[#34444c]">
                              {company?.name} · {job?.title}
                            </p>
                            {item.priority === "High" ? (
                              <span className="rounded border border-[#e8dfd1] bg-[#faf7f0] px-1.5 py-0.5 text-[9px] text-[#816d4c]">
                                Priority
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-[10px] text-[#839097]">
                            {contact?.name} · {contact?.role} · Due {item.due}
                          </p>
                          <p className="mt-2 text-[11px] text-[#6c7980]">{item.action}</p>
                          <p className="mt-1 text-[10px] text-[#929ca2]">
                            Last interaction: {item.lastInteraction}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:justify-end">
                        {item.completed ? (
                          <span className="inline-flex items-center gap-1 rounded border border-[#d8e8dd] bg-[#f2f8f4] px-2 py-1 text-[10px] text-[#477159]">
                            <IconCheck size={12} /> Done
                          </span>
                        ) : (
                          <>
                            <Button asChild size="xs" variant="outline">
                              <Link href="/applications">Application</Link>
                            </Button>
                            <Button asChild size="xs" variant="outline">
                              <Link href="/outreach">Draft email</Link>
                            </Button>
                            <label className="inline-flex h-6 items-center rounded-md border border-[#dfe5e8] bg-white px-2 text-[10px] text-[#627179]">
                              Reschedule
                              <Input
                                aria-label={`Reschedule follow-up for ${company?.name ?? "company"}`}
                                type="date"
                                value={item.due}
                                onChange={(event) => {
                                  updateReminder(item, { due: event.target.value });
                                  setNotice("Follow-up date updated.");
                                }}
                                className="ml-1 w-[92px] bg-transparent text-[9px] outline-none"
                              />
                            </label>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => {
                                const dueDate = new Date(`${item.due}T00:00:00Z`);
                                dueDate.setUTCDate(dueDate.getUTCDate() + 1);
                                updateReminder(item, { due: dueDate.toISOString().slice(0, 10) });
                                setNotice("Reminder snoozed by one day.");
                              }}
                            >
                              Snooze
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => {
                                updateReminder(item, { completed: true });
                                setNotice("Follow-up marked complete.");
                              }}
                            >
                              Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={`Nothing ${group.title.toLowerCase()}`}
                description="Reminders will appear here as your search moves forward."
              />
            )}
          </Panel>
        ))}
      </div>
      {showAdd ? <FollowUpDialog onClose={() => setShowAdd(false)} /> : null}
    </>
  );
}

function FollowUpDialog({ onClose }: { onClose: () => void }) {
  const { setFollowUps, jobs, contacts } = useDemoState();
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [contactId, setContactId] = useState(contacts[0]?.id ?? "");
  const [due, setDue] = useState("2026-11-03");
  const [action, setAction] = useState("");
  const [priority, setPriority] = useState<FollowUp["priority"]>("Normal");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!jobId || !contactId) return;
    setFollowUps((items) => [
      ...items,
      {
        id: `follow-local-${items.length + 1}`,
        jobId,
        contactId,
        due,
        lastInteraction: "Reminder added",
        action: action.trim(),
        priority,
        completed: false,
      },
    ]);
    onClose();
  }

  return (
    <Modal
      title="Add follow-up reminder"
      description="Reminders are saved to the local workspace state."
      onClose={onClose}
    >
      <form onSubmit={save} className="space-y-4">
        <Field label="Related job">
          <NativeSelect
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
            className={controlClass}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Contact">
          <NativeSelect
            value={contactId}
            onChange={(event) => setContactId(event.target.value)}
            className={controlClass}
          >
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Due date">
            <Input
              type="date"
              required
              value={due}
              onChange={(event) => setDue(event.target.value)}
              className={controlClass}
            />
          </Field>
          <Field label="Priority">
            <NativeSelect
              value={priority}
              onChange={(event) => {
                const nextPriority = reminderPriorities.find((item) => item === event.target.value);
                if (nextPriority) setPriority(nextPriority);
              }}
              className={controlClass}
            >
              {reminderPriorities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <Field label="Suggested next action">
          <Textarea
            required
            value={action}
            onChange={(event) => setAction(event.target.value)}
            rows={3}
            className={`${controlClass} h-auto py-2`}
          />
        </Field>
        <div className="flex justify-end gap-2 border-t border-[#edf0f2] pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add reminder</Button>
        </div>
      </form>
    </Modal>
  );
}

const reminderPriorities: FollowUp["priority"][] = ["Normal", "High"];
