import { notFound } from "next/navigation";
import { WorkspacePage } from "@/components/workspace/workspace-page";
import { workspaceSections } from "@/lib/mock-data";

export function generateStaticParams() {
  return workspaceSections.map((section) => ({ section: section.id }));
}

export default async function SectionPage({
  params,
}: PageProps<"/[section]">) {
  const { section } = await params;
  const current = workspaceSections.find((item) => item.id === section);

  if (!current) notFound();

  return <WorkspacePage section={current.id} />;
}
