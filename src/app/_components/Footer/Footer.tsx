import Link from "next/link";
import { ReactNode } from "react";
import {
  LuFacebook,
  LuInstagram,
  LuMail,
  LuMapPin,
  LuPhone,
  LuTwitter,
} from "react-icons/lu";

const groups = [
  {
    title: "Shop",
    links: [
      ["All products", "/shop"],
      ["Categories", "/categories"],
      ["Brands", "/brands"],
      ["Wishlist", "/wishlist"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign in", "/login"],
      ["Create account", "/register"],
      ["Your orders", "/orders"],
      ["Shopping cart", "/cart"],
    ],
  },
  {
    title: "Help & support",
    links: [
      ["Contact us", "/contact"],
      ["Delivery information", "/contact"],
      ["Returns", "/contact"],
      ["FAQs", "/contact"],
    ],
  },
  {
    title: "Your account",
    links: [
      ["My profile", "/profile"],
      ["Change password", "/change-password"],
      ["Order history", "/orders"],
      ["Checkout", "/checkout"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-[1536px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:px-8">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight text-green-700">
            FreshCart<span className="text-gray-900">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
            Everyday essentials and fresh finds, chosen to make life a little easier.
          </p>
          <div className="mt-5 flex gap-3">
            <Social href="https://facebook.com" label="Facebook">
              <LuFacebook />
            </Social>
            <Social href="https://instagram.com" label="Instagram">
              <LuInstagram />
            </Social>
            <Social href="https://twitter.com" label="Twitter">
              <LuTwitter />
            </Social>
          </div>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="font-semibold text-gray-900">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 transition hover:text-green-700"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-[1536px] flex-col justify-between gap-3 px-4 py-5 text-sm text-gray-500 sm:flex-row sm:items-center lg:px-8">
          <span>© {new Date().getFullYear()} FreshCart. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="mailto:support@freshcart.com"
              className="inline-flex items-center gap-1.5 hover:text-green-700"
            >
              <LuMail />
              support@freshcart.com
            </a>
            <a
              href="tel:+201001234567"
              className="inline-flex items-center gap-1.5 hover:text-green-700"
            >
              <LuPhone />
              +20 100 123 4567
            </a>
            <span className="inline-flex items-center gap-1.5">
              <LuMapPin />
              Cairo, Egypt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-green-600 hover:text-white"
    >
      {children}
    </a>
  );
}
