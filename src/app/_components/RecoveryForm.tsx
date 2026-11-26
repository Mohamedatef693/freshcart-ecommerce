"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/API/services/client";

export default function RecoveryForm() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (step === 0) {
        const result = await apiRequest<{ message?: string }>("/auth/forgotPasswords", {
          method: "POST",
          body: JSON.stringify(values),
        });
        setEmail(String(values.email));
        setMessage(result.message || "Check your email for the reset code.");
        setStep(1);
      } else if (step === 1) {
        await apiRequest("/auth/verifyResetCode", {
          method: "POST",
          body: JSON.stringify(values),
        });
        setMessage("Code verified. Choose a new password.");
        setStep(2);
      } else {
        if (values.newPassword !== values.confirmPassword) {
          setError("The new password and confirmation do not match.");
          return;
        }
        await apiRequest("/auth/resetPassword", {
          method: "PUT",
          body: JSON.stringify({ email, newPassword: values.newPassword }),
        });
        setMessage("Password updated. You can sign in now.");
        setStep(3);
      }
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Could not complete your request.",
      );
    }
  }

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-gray-100 bg-white p-7 shadow-lg sm:p-10">
        <p className="text-sm font-semibold text-green-700">Account recovery</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {step === 0
            ? "Forgot your password?"
            : step === 1
              ? "Enter your reset code"
              : "Choose a new password"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {step === 0
            ? "Enter the email linked to your account and we’ll send you a reset code."
            : step === 1
              ? `We sent a code to ${email}.`
              : "Use a password you have not used before."}
        </p>
        {step < 3 ? (
          <form onSubmit={submit} className="mt-7 space-y-4">
            {step === 0 && <Field label="Email address" name="email" type="email" />}
            {step === 1 && <Field label="Reset code" name="resetCode" />}
            {step === 2 && (
              <>
                <Field
                  label="Email address"
                  name="email"
                  type="email"
                  defaultValue={email}
                />
                <Field label="New password" name="newPassword" type="password" />
                <Field label="Confirm password" name="confirmPassword" type="password" />
              </>
            )}
            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
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
              {step === 0
                ? "Send reset code"
                : step === 1
                  ? "Verify code"
                  : "Update password"}
            </button>
          </form>
        ) : (
          <p
            role="status"
            className="mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-green-700 hover:underline"
        >
          Back to sign in
        </Link>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        required
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}
