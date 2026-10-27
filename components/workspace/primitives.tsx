"use client";

import type { ReactNode } from "react";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ApplicationStatus } from "@/lib/mock-data";

const statusColors: Record<ApplicationStatus, string> = {
  Saved: "border-[#dfe5e8] bg-[#f7f8f9] text-[#56646c]",
  "Ready for review": "border-[#d8e6eb] bg-[#f0f6f8] text-[#31586a]",
  Applied: "border-[#dce4ef] bg-[#f1f5fa] text-[#46627f]",
  "Recruiter contacted": "border-[#e8dfd1] bg-[#faf6ef] text-[#816638]",
  Assessment: "border-[#e3dcef] bg-[#f6f2fa] text-[#695286]",
  Interview: "border-[#d7e8df] bg-[#f0f7f3] text-[#3d7259]",
  Offer: "border-[#d4e8de] bg-[#edf7f1] text-[#307452]",
  Rejected: "border-[#e7deda] bg-[#faf5f3] text-[#8b6254]",
  Withdrawn: "border-[#e4e6e8] bg-[#f5f6f7] text-[#717d84]",
  Closed: "border-[#e4e6e8] bg-[#f5f6f7] text-[#717d84]",
};

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[25px] font-semibold tracking-[-0.035em] text-[#1d2b33] sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-[#76828a]">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-[#e6eaed] bg-white ${className}`}
    >
      {title || description || action ? (
        <div className="flex items-start justify-between gap-3 border-b border-[#edf0f2] px-4 py-3.5 sm:px-5">
          <div>
            {title ? (
              <h2 className="text-[13px] font-semibold text-[#2a3941]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-[11px] leading-4 text-[#849098]">
                {description}
              </p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded border px-2 py-1 text-[10px] font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
}

export function CompanyMark({
  name,
  initials,
  size = "md",
}: {
  name: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}) {
  const text = initials ?? name.split(" ").map((word) => word[0]).join("");
  const sizes = {
    sm: "size-7 text-[9px]",
    md: "size-9 text-[10px]",
    lg: "size-11 text-xs",
  };
  const tones: Record<string, string> = {
    N: "bg-[#e6edf2] text-[#3b5f74]",
    O: "bg-[#e7efe8] text-[#4c6c53]",
    C: "bg-[#f1e9e3] text-[#805c48]",
    L: "bg-[#eae8f1] text-[#61577f]",
  };
  const tone = tones[text[0] ?? "N"] ?? "bg-[#edf0f2] text-[#53636d]";

  return (
    <span
      aria-label={name}
      className={`grid shrink-0 place-items-center rounded-md font-semibold ${sizes[size]} ${tone}`}
    >
      {text.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function Modal({
  title,
  description,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#162129]/35 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        className={`max-h-[min(90vh,900px)] w-full overflow-y-auto rounded-xl border border-[#e0e5e8] bg-white shadow-xl ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#edf0f2] bg-white px-5 py-4">
          <div>
            <h2 id="modal-heading" className="text-[16px] font-semibold text-[#23323a]">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-xs leading-5 text-[#7b878e]">{description}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <IconX size={17} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning";
}) {
  const styles = {
    info: "border-[#dbe7eb] bg-[#f4f8f9] text-[#42616f]",
    success: "border-[#d8e8dd] bg-[#f2f8f4] text-[#477159]",
    warning: "border-[#e9e2d5] bg-[#faf7f0] text-[#7e6944]",
  };

  return (
    <div className={`rounded-md border px-3 py-2.5 text-xs leading-5 ${styles[tone]}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block min-w-0 text-xs font-medium text-[#526068]">
      <span className="mb-1.5 block">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1 block text-[10px] font-normal text-[#8a959c]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const controlClass =
  "h-9 w-full rounded-md border border-[#dfe5e8] bg-white px-3 text-xs text-[#26343c] outline-none transition-colors placeholder:text-[#a0a9ae] focus:border-[#7da4b2] focus:ring-2 focus:ring-[#4d879b]/15";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium text-[#3a4850]">{title}</p>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#818c93]">
        {description}
      </p>
    </div>
  );
}
