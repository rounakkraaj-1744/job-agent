import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DemoStateProvider } from "@/components/shared/demo-state";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) redirect(`/login?returnTo=${encodeURIComponent("/dashboard")}`);
  const sidebarCookie = requestHeaders
    .get("cookie")
    ?.split("; ")
    .find((cookie) => cookie.startsWith("sidebar_state="))
    ?.split("=")[1];
  return (
    <DemoStateProvider>
      <AppShell defaultSidebarOpen={sidebarCookie !== "false"}>{children}</AppShell>
    </DemoStateProvider>
  );
}
