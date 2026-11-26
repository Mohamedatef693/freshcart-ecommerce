"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/API/services/client";

export default function ChangePasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const result = await apiRequest<{ token?: string; message?: string }>(
        "/users/changeMyPassword",
        { method: "PUT", body: JSON.stringify(body) },
      );
      if (result.token) localStorage.setItem("freshcart-token", result.token);
      setMessage(result.message || "Your password has been changed.");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not change your password.",
      );
    }
  }
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-gray-100 bg-white p-7 shadow-lg sm:p-10">
        <p className="text-sm font-semibold text-green-700">Account security</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Change password</h1>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <Field label="Current password" name="currentPassword" />
          <Field label="New password" name="password" />
          <Field label="Confirm new password" name="rePassword" />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {message && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </p>
          )}
          <button className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700">
            Update password
          </button>
        </form>
        <Link
          href="/"
          className="mt-5 inline-block text-sm font-semibold text-green-700 hover:underline"
        >
          Back to shop
        </Link>
      </section>
    </main>
  );
}
function Field({ label, name }: { label: string; name: string }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        required
        type="password"
        name={name}
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}
