"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/API/services/client";

type CartProduct = {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
};
type CartPayload = {
  data?: {
    _id: string;
    totalCartPrice: number;
    products: { count: number; price: number; product: CartProduct }[];
  };
};

export default function CartView() {
  const [cart, setCart] = useState<CartPayload["data"]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!localStorage.getItem("freshcart-token")) {
      setLoading(false);
      setError("Sign in to view your cart.");
      return;
    }
    try {
      setCart((await apiRequest<CartPayload>("/cart")).data);
      setError("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not load your cart.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function update(productId: string, count: number) {
    try {
      await apiRequest(`/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ count }),
      });
      await refresh();
      window.dispatchEvent(new Event("freshcart-cart-update"));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not update item.");
    }
  }

  async function remove(productId: string) {
    try {
      await apiRequest(`/cart/${productId}`, { method: "DELETE" });
      await refresh();
      window.dispatchEvent(new Event("freshcart-cart-update"));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not remove item.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
      <p className="mt-2 text-gray-500">Review your items before checkout.</p>
      {loading ? (
        <p className="py-16 text-center text-gray-500">Loading your cart…</p>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-amber-50 p-5 text-amber-900">
          {error}
          <Link href="/login" className="ml-2 font-semibold underline">
            Sign in
          </Link>
        </div>
      ) : !cart?.products?.length ? (
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-gray-800">Your cart is empty</p>
          <Link
            href="/shop"
            className="mt-5 inline-flex rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {cart.products.map(({ product, count }) => (
              <div
                key={product._id}
                className="flex flex-wrap items-center gap-4 border-b border-gray-100 p-4 last:border-0 sm:flex-nowrap sm:p-5"
              >
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="h-20 w-20 rounded-lg bg-gray-50 object-contain p-2"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/productdetails/${product._id}`}
                    className="font-semibold text-gray-800 hover:text-green-700"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{product.price} EGP each</p>
                  <button
                    onClick={() => void remove(product._id)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center rounded-lg border border-gray-200">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => void update(product._id, Math.max(1, count - 1))}
                    className="px-3 py-2"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center">{count}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => void update(product._id, count + 1)}
                    className="px-3 py-2"
                  >
                    +
                  </button>
                </div>
                <strong className="w-24 text-right text-gray-900">
                  {product.price * count} EGP
                </strong>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold">Order summary</h2>
            <div className="mt-5 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{cart.totalCartPrice} EGP</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Shipping and taxes are calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-6 block rounded-lg bg-green-600 px-4 py-3 text-center font-semibold text-white hover:bg-green-700"
            >
              Continue to checkout
            </Link>
            <Link
              href="/shop"
              className="mt-4 block text-center text-sm font-medium text-green-700 hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
