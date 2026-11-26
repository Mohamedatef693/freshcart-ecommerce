"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/API/services/client";
import { ProductType } from "@/API/types/product.type";
import ProductCard from "./ProductCard/ProductCard";

export default function WishlistView() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!localStorage.getItem("freshcart-token")) {
        setError("Sign in to view your wishlist.");
        setLoading(false);
        return;
      }
      apiRequest<{ data: ProductType[] }>("/wishlist")
        .then((payload) => setProducts(payload.data || []))
        .catch((issue) =>
          setError(
            issue instanceof Error ? issue.message : "Could not load your wishlist.",
          ),
        )
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
        Saved for later
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Your wishlist</h1>
      {loading ? (
        <p className="py-16 text-center text-gray-500">Loading…</p>
      ) : error ? (
        <div className="mt-8 rounded-xl bg-amber-50 p-5 text-amber-900">
          {error}{" "}
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>
        </div>
      ) : products.length ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isWishlisted
              onWishlistChange={() =>
                setProducts((current) =>
                  current.filter((item) => item._id !== product._id),
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-600">
          Your wishlist is empty.{" "}
          <Link href="/shop" className="font-semibold text-green-700 hover:underline">
            Explore products
          </Link>
        </div>
      )}
    </main>
  );
}
