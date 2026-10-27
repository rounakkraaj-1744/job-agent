"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggleButton } from "@/components/shared/theme-toggle";
import { controlClass, Notice } from "@/components/workspace/primitives";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must contain at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) setError(result.error.message || "Unable to create your account.");
      else router.replace("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account. Please try again.",
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
      <section className="w-full max-w-[410px] rounded-xl border border-[#e5e9ec] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-[#25343c]">Create your account</h1>
        <p className="mt-1.5 text-xs text-[#7c888f]">
          Start organizing your job search with JobPilot.
        </p>
        {error && (
          <div className="mt-4">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs font-medium text-[#526068]">
            Name
            <Input
              className={`${controlClass} mt-1.5`}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="block text-xs font-medium text-[#526068]">
            Email
            <Input
              className={`${controlClass} mt-1.5`}
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block text-xs font-medium text-[#526068]">
            Password
            <Input
              className={`${controlClass} mt-1.5`}
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="block text-xs font-medium text-[#526068]">
            Confirm password
            <Input
              className={`${controlClass} mt-1.5`}
              required
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-5 text-center text-xs text-[#79858c]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#4c7889]">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
