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

          <div
            className="relative py-2 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            <span className="bg-[color:var(--card)] px-2">or</span>
          </div>

          <button
            type="button"
            onClick={async () => {
              setError(null);
              const result = await signInWithGoogle();
              if (result.error) {
                setError(result.error);
              }
            }}
            className="w-full rounded-xl border px-4 py-2 text-sm font-semibold"
            style={{
              borderColor: "var(--border)",
              color: "var(--foreground)",
              background: "var(--background)",
            }}
          >
            Continue with Google
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
