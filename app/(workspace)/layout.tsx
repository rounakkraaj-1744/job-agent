import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DemoStateProvider } from "@/components/shared/demo-state";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DemoStateProvider>
      <AppShell>{children}</AppShell>
    </DemoStateProvider>
  );
}
