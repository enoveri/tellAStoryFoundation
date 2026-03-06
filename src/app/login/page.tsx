"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MobileShell } from "@/components/shared/mobile-shell";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/use-current-user";

type Mode = "login" | "signup";

export default function LoginPage() {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isLoading && user) {
    router.replace("/profile");
    return null;
  }

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    if (mode === "login") {
      const result = await signInWithEmail({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      router.push("/profile");
      router.refresh();
      return;
    }

    const result = await signUpWithEmail({
      email: email.trim(),
      password,
      fullName: name.trim() || undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setStatus(
      "Signup successful. Check your inbox to verify your email before signing in.",
    );
    setIsSubmitting(false);
  };

  return (
    <MobileShell
      title={mode === "login" ? "Login" : "Sign Up"}
      subtitle="Access your Tell A Story account"
    >
      <section
        className="mx-4 rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div className="mb-4 flex gap-2 rounded-full bg-[color:var(--background)] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className="flex-1 rounded-full px-3 py-2 text-sm font-semibold"
            style={
              mode === "login"
                ? { background: "var(--primary)", color: "var(--primary-fg)" }
                : { color: "var(--muted)" }
            }
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="flex-1 rounded-full px-3 py-2 text-sm font-semibold"
            style={
              mode === "signup"
                ? { background: "var(--primary)", color: "var(--primary-fg)" }
                : { color: "var(--muted)" }
            }
          >
            Create Account
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={async () => {
              setError(null);
              const result = await signInWithGoogle();
              if (result.error) {
                setError(result.error);
              }
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: "#dadce0",
              color: "#3c4043",
              background: "#ffffff",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-flex h-5 w-5 items-center"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" role="img">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.205 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.841 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.841 1.154 7.959 3.041l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.144 35.091 26.715 36 24 36c-5.176 0-9.615-3.321-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-.793 2.237-2.231 4.166-4.085 5.57l.003-.002 6.19 5.238C37.002 39.18 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
            </span>
            Continue with Google
          </button>

          <div
            className="relative py-1 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            <span className="bg-[color:var(--card)] px-2">
              or continue with email
            </span>
          </div>

          {mode === "signup" ? (
            <div className="space-y-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          ) : null}

          <div className="space-y-1">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "signup" ? "At least 6 characters" : "Your password"
              }
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              void submit();
            }}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-semibold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-fg)",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Sign Up with Email"}
          </button>

          {status ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      <p className="px-4 text-center text-xs" style={{ color: "var(--muted)" }}>
        By continuing, you agree to Tell A Story community guidelines.
      </p>

      <p className="px-4 text-center text-xs" style={{ color: "var(--muted)" }}>
        Need help?{" "}
        <Link href="mailto:hello@tellastory.org" className="underline">
          Contact support
        </Link>
      </p>
    </MobileShell>
  );
}
