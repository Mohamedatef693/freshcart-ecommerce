"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/API/services/client";

type CartResponse = {
  data: {
    _id: string;
    totalCartPrice: number;
    products: { count: number; product: { title: string } }[];
  };
};

export default function CheckoutView() {
  const [cart, setCart] = useState<CartResponse["data"]>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    apiRequest<CartResponse>("/cart")
      .then((result) => setCart(result.data))
      .catch((issue) =>
        setError(issue instanceof Error ? issue.message : "Sign in to continue."),
      );
  }, []);
  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart) return;
    const address = Object.fromEntries(new FormData(event.currentTarget).entries());
    setError("");
    setBusy(true);
    try {
      const method = String(address.paymentMethod);
      if (method === "online") {
        const result = await apiRequest<{ session?: { url?: string } }>(
          `/orders/checkout-session/${cart._id}?url=${encodeURIComponent(window.location.origin)}`,
          {
            method: "POST",
            body: JSON.stringify({
              shippingAddress: {
                details: address.details,
                phone: address.phone,
                city: address.city,
              },
            }),
          },
        );
        if (result.session?.url) window.location.assign(result.session.url);
        else setMessage("Your payment session was created.");
      } else {
        await apiRequest(`/orders/${cart._id}`, {
          method: "POST",
          body: JSON.stringify({
            shippingAddress: {
              details: address.details,
              phone: address.phone,
              city: address.city,
            },
          }),
        });
        setMessage("Your order has been placed. Thank you!");
      }
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not place your order.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
        Almost there
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Checkout</h1>
      {message ? (
        <div className="mt-8 rounded-xl bg-green-50 p-6 text-green-800">
          {message}
          <Link href="/orders" className="ml-2 font-semibold underline">
            View your orders
          </Link>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-amber-50 p-5 text-amber-900">
          {error}
          <Link href="/login" className="ml-2 font-semibold underline">
            Sign in
          </Link>
        </div>
      ) : !cart ? (
        <p className="mt-8 text-gray-500">Loading order…</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <form
            onSubmit={placeOrder}
            className="space-y-5 rounded-xl border border-gray-200 bg-white p-6"
          >
            <h2 className="text-xl font-bold">Delivery details</h2>
            <Field label="Street address" name="details" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone number" name="phone" type="tel" />
              <Field label="City" name="city" />
            </div>
            <fieldset className="space-y-3">
              <legend className="font-semibold text-gray-800">Payment method</legend>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  defaultChecked
                  className="accent-green-600"
                />
                <span>
                  <b className="block">Cash on delivery</b>
                  <small className="text-gray-500">Pay when your order arrives.</small>
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  className="accent-green-600"
                />
                <span>
                  <b className="block">Online payment</b>
                  <small className="text-gray-500">Secure checkout through Stripe.</small>
                </span>
              </label>
            </fieldset>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {busy ? "Placing order…" : "Place order"}
            </button>
          </form>
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.products.map((item, index) => (
                <li
                  key={`${item.product.title}-${index}`}
                  className="flex justify-between gap-3 text-sm text-gray-600"
                >
                  <span>
                    {item.product.title} × {item.count}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between border-t border-gray-100 pt-4 font-bold">
              <span>Total</span>
              <span>{cart.totalCartPrice} EGP</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        name={name}
        type={type}
        required
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}
