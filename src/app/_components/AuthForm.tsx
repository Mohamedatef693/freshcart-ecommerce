"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/API/services/client";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const result = await apiRequest<{ token?: string; data?: { token?: string } }>(
        mode === "login" ? "/auth/signin" : "/auth/signup",
        { method: "POST", body: JSON.stringify(body) },
      );
      const token = result.token || result.data?.token;
      if (token) {
        localStorage.setItem("freshcart-token", token);
        window.dispatchEvent(new Event("freshcart-auth-update"));
        router.push("/");
      } else if (mode === "register") {
        router.push("/login");
      } else {
        setError(
          "We could not start your session. Please check your details and try again.",
        );
      }
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Could not complete your request.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-12">
      <section className="grid w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl md:grid-cols-2">
        <div className="hidden min-h-[550px] flex-col justify-between bg-gradient-to-br from-green-700 via-green-600 to-emerald-400 p-10 text-white md:flex">
          <Link href="/" className="text-2xl font-bold">
            FreshCart
          </Link>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-green-100">
              Fresh choices, every day
            </p>
            <h2 className="max-w-sm text-4xl font-bold leading-tight">
              Everything you need, in one place.
            </h2>
            <p className="mt-4 max-w-sm text-green-50">
              Discover everyday essentials and have them delivered to your door.
            </p>
          </div>
          <span className="text-sm text-green-100">A simpler way to shop.</span>
        </div>
        <div className="p-7 sm:p-10">
          <p className="text-sm font-semibold text-green-700">Welcome to FreshCart</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "login"
              ? "Pick up where you left off."
              : "Join us and make shopping a little easier."}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "register" && (
              <Field label="Full name" name="name" autoComplete="name" />
            )}
            <Field label="Email address" name="email" type="email" autoComplete="email" />
            {mode === "register" && (
              <Field label="Phone number" name="phone" type="tel" autoComplete="tel" />
            )}
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {mode === "register" && (
              <Field
                label="Confirm password"
                name="rePassword"
                type="password"
                autoComplete="new-password"
              />
            )}
            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
          <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
            {mode === "login" && (
              <Link href="/forgot-password" className="text-green-700 hover:underline">
                Forgot password?
              </Link>
            )}
            <p className="text-gray-500">
              {mode === "login" ? "New to FreshCart?" : "Already have an account?"}{" "}
              <Link
                className="font-semibold text-green-700 hover:underline"
                href={mode === "login" ? "/register" : "/login"}
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-3 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}
