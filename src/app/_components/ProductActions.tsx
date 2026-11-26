"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/API/services/client";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("");
  async function add(path: string, body?: unknown) {
    if (!localStorage.getItem("freshcart-token")) return router.push("/login");
    try {
      await apiRequest(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
      if (path === "/cart") window.dispatchEvent(new Event("freshcart-cart-update"));
      if (path === "/wishlist")
        window.dispatchEvent(new Event("freshcart-wishlist-update"));
      setMessage(
        path === "/wishlist" ? "Added to your wishlist." : "Added to your cart.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not complete this action.",
      );
    }
  }
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Quantity</span>
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setCount((value) => Math.max(1, value - 1))}
            className="px-4 py-2"
          >
            −
          </button>
          <span className="min-w-10 border-x border-gray-200 py-2 text-center">
            {count}
          </span>
          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            className="px-4 py-2"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => void add("/cart", { productId, count })}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 font-semibold text-white shadow-sm hover:bg-green-700"
        >
          <ShoppingCart size={19} />
          Add to cart
        </button>
        <Link
          href="/cart"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gray-900 font-semibold text-white hover:bg-gray-800"
        >
          Buy now
        </Link>
      </div>
      <button
        onClick={() => void add("/wishlist", { productId })}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:border-green-300 hover:text-green-700"
      >
        <Heart size={19} />
        Add to wishlist
      </button>
      {message && (
        <p role="status" className="mt-3 text-center text-sm text-green-700">
          {message}
        </p>
      )}
    </div>
  );
}
