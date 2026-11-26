"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Account = { name?: string; email?: string; phone?: string };
export default function ProfilePage() {
  const [account, setAccount] = useState<Account>();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = localStorage.getItem("freshcart-token");
      if (!token) return;
      try {
        setAccount(JSON.parse(atob(token.split(".")[1])) as Account);
      } catch {
        setAccount({});
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
        Your FreshCart account
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">My profile</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <LinkCard
          title="Personal details"
          description={account?.name || account?.email || "Manage your account"}
          href="/change-password"
          action="Change password"
        />
        <LinkCard
          title="Orders"
          description="Check delivery and payment updates."
          href="/orders"
          action="View orders"
        />
        <LinkCard
          title="Wishlist"
          description="Products you saved for later."
          href="/wishlist"
          action="View wishlist"
        />
        <LinkCard
          title="Shopping cart"
          description="Review items and finish your order."
          href="/cart"
          action="Open cart"
        />
      </div>
      <Link
        href="/shop"
        className="mt-8 inline-flex rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
      >
        Continue shopping
      </Link>
    </main>
  );
}
function LinkCard({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-green-200 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <span className="mt-5 inline-block text-sm font-semibold text-green-700">
        {action} →
      </span>
    </Link>
  );
}
