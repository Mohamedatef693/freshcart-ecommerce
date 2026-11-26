"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/API/services/client";

export default function AddBtn({ productId }: { productId: string }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  async function addToCart() {
    if (!localStorage.getItem("freshcart-token")) {
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      await apiRequest("/cart", { method: "POST", body: JSON.stringify({ productId }) });
      setFeedback("Added");
      window.dispatchEvent(new Event("freshcart-cart-update"));
      window.setTimeout(() => setFeedback(""), 1600);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Try again");
      window.setTimeout(() => setFeedback(""), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      disabled={busy}
      aria-label="Add to cart"
      className="flex h-10 min-w-10 items-center justify-center rounded-full bg-green-600 px-3 text-lg text-white transition hover:bg-green-700 disabled:opacity-60"
    >
      {feedback || (busy ? "…" : "+")}
    </button>
  );
}
