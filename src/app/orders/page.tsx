"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/API/services/client";

type Order = {
  _id: string;
  createdAt: string;
  isDelivered?: boolean;
  isPaid?: boolean;
  totalOrderPrice?: number;
  cartItems?: { count: number; product: { title: string; imageCover: string } }[];
};
function userIdFromToken(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1])).id as string;
  } catch {
    return "";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = localStorage.getItem("freshcart-token");
      if (!token) {
        setError("Sign in to view your orders.");
        setLoading(false);
        return;
      }
      const id = userIdFromToken(token);
      if (!id) {
        setError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }
      apiRequest<{ data: Order[] }>(`/orders/user/${id}`)
        .then((result) => setOrders(result.data || []))
        .catch((issue) =>
          setError(issue instanceof Error ? issue.message : "Could not load orders."),
        )
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
        Your account
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Order history</h1>
      {loading ? (
        <p className="py-16 text-center text-gray-500">Loading orders…</p>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-amber-50 p-5 text-amber-900">
          {error}{" "}
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>
        </div>
      ) : orders.length ? (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.totalOrderPrice} EGP</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.isDelivered ? "Delivered" : "Processing"} ·{" "}
                    {order.isPaid ? "Paid" : "Payment due"}
                  </p>
                </div>
              </div>
              {order.cartItems?.length ? (
                <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                  {order.cartItems.map((item, index) => (
                    <div
                      key={`${item.product.title}-${index}`}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <img
                        src={item.product.imageCover}
                        alt=""
                        className="h-10 w-10 rounded bg-gray-50 object-contain"
                      />
                      <span>
                        {item.product.title} × {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-gray-100 p-10 text-center text-gray-600">
          You haven’t placed an order yet.{" "}
          <Link href="/shop" className="font-semibold text-green-700 hover:underline">
            Browse products
          </Link>
        </div>
      )}
    </main>
  );
}
