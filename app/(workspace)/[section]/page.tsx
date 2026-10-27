import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WorkspacePage } from "@/components/workspace/workspace-page";
import { workspaceSections } from "@/lib/mock-data";

export function generateStaticParams() {
  return workspaceSections.map((section) => ({ section: section.id }));
}

export default function SectionPage({ params, searchParams }: PageProps<"/[section]">) {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-[#e6eaed] bg-white px-5 py-10 text-center text-xs text-[#7c888f]">
          Loading workspace…
        </div>
      }
    >
      <SectionContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function SectionContent({ params, searchParams }: PageProps<"/[section]">) {
  const { section } = await params;
  const { search } = await searchParams;
  const current = workspaceSections.find((item) => item.id === section);

  if (!current) notFound();

  return (
    <WorkspacePage
      section={current.id}
      searchQuery={typeof search === "string" ? search : undefined}
    />
  );
}
