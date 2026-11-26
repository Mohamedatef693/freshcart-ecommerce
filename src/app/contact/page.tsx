import Link from "next/link";
import { ReactNode } from "react";
import { LuClock3, LuMail, LuMapPin, LuPhone } from "react-icons/lu";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="rounded-2xl bg-gradient-to-r from-green-800 to-green-600 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-green-100">
          We’re here to help
        </p>
        <h1 className="mt-2 text-4xl font-bold">Contact our team</h1>
        <p className="mt-3 max-w-xl text-green-50">
          Questions about a product or an order? Reach out and we’ll get back to you.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <ContactCard
          icon={<LuMail />}
          title="Email us"
          detail="support@freshcart.com"
          href="mailto:support@freshcart.com"
        />
        <ContactCard
          icon={<LuPhone />}
          title="Call us"
          detail="+20 100 123 4567"
          href="tel:+201001234567"
        />
        <ContactCard
          icon={<LuClock3 />}
          title="Support hours"
          detail="Every day, 9 AM – 9 PM"
        />
      </div>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-xl text-green-700">
            <LuMapPin />
          </span>
          <div>
            <h2 className="font-semibold text-gray-900">Visit FreshCart</h2>
            <p className="mt-1 text-sm text-gray-500">Cairo, Egypt</p>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              For order updates, visit your{" "}
              <Link
                href="/orders"
                className="font-semibold text-green-700 hover:underline"
              >
                order history
              </Link>
              . You can also browse our{" "}
              <Link href="/shop" className="font-semibold text-green-700 hover:underline">
                products
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  href,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  href?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-xl text-green-700">
        {icon}
      </span>
      <h2 className="mt-4 font-semibold text-gray-900">{title}</h2>
      {href ? (
        <a
          href={href}
          className="mt-1 inline-block text-sm text-gray-500 hover:text-green-700"
        >
          {detail}
        </a>
      ) : (
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      )}
    </div>
  );
}
