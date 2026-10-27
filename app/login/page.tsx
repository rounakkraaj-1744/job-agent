"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { IconBriefcase, IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggleButton } from "@/components/shared/theme-toggle";
import { controlClass, Notice } from "@/components/workspace/primitives";
import { authClient } from "@/lib/auth-client";
import { safeReturnTo } from "@/lib/auth-redirect";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get("returnTo") ?? undefined);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) setError(result.error.message || "Unable to sign in.");
      else router.replace(returnTo);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f7f8f9] px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggleButton />
      </div>
      <div className="w-full max-w-[410px]">
        <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-[#183f53] text-white">
            <IconBriefcase size={18} />
          </span>
          <span className="text-sm font-semibold tracking-[-0.02em] text-[#26363e]">JobPilot</span>
        </Link>
        <section className="rounded-xl border border-[#e5e9ec] bg-white p-6 shadow-[0_8px_24px_rgba(27,43,51,0.04)] sm:p-8">
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-[#25343c]">Welcome back</h1>
          <p className="mt-1.5 text-xs leading-5 text-[#7c888f]">
            Sign in to continue organizing your job search.
          </p>
          {error ? (
            <div role="alert" className="mt-4">
              <Notice tone="error">{error}</Notice>
            </div>
          ) : null}
          {message ? (
            <div className="mt-4">
              <Notice>{message}</Notice>
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            disabled={loading}
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                const result = await authClient.signIn.social({
                  provider: "google",
                  callbackURL: returnTo,
                });
                if (result.error)
                  setError(result.error.message || "Google sign-in is not configured.");
              } catch (submitError) {
                setError(
                  submitError instanceof Error
                    ? submitError.message
                    : "Google sign-in could not be started.",
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            Continue with Google
          </Button>
          <div className="my-5 flex items-center gap-3 text-[10px] text-[#9aa3a8]">
            <span className="h-px flex-1 bg-[#edf0f2]" />
            or continue with email
            <span className="h-px flex-1 bg-[#edf0f2]" />
          </div>
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-xs font-medium text-[#526068]">
              Email address
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${controlClass} mt-1.5`}
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-xs font-medium text-[#526068]">
              Password
              <span className="relative mt-1.5 block">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${controlClass} pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1.5 grid size-6 place-items-center rounded text-[#869198] hover:bg-[#f1f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d879b]/30"
                >
                  {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                </button>
              </span>
            </label>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Password recovery will be available after authentication is connected.",
                  )
                }
                className="text-[11px] text-[#4c7889] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Checking..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-[#79858c]">
            New to JobPilot?{" "}
            <Link href="/signup" className="font-medium text-[#4c7889] hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-6 text-center text-[10px] leading-5 text-[#9aa3a8]">
            By continuing, you agree to our{" "}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setMessage("Terms are a placeholder for this prototype.");
              }}
              className="text-[#71858e] hover:underline"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setMessage("Privacy information is a placeholder for this prototype.");
              }}
              className="text-[#71858e] hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>
        <Link
          href="/dashboard"
          className="mt-5 block text-center text-[11px] text-[#78858c] hover:text-[#426e7e]"
        >
          Return to workspace
        </Link>
      </div>
    </main>
  );
}
