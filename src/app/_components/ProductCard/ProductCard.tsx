"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuHeart, LuEye } from "react-icons/lu";
import { ProductType } from "@/API/types/product.type";
import { apiRequest } from "@/API/services/client";
import AddBtn from "../addBtn/addBtn";
import ratingStars from "../Rating/Ratings";

export default function ProductCard({
  product,
  isWishlisted = false,
  onWishlistChange,
}: {
  product: ProductType;
  isWishlisted?: boolean;
  onWishlistChange?: () => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(isWishlisted);
  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  async function toggleWishlist() {
    if (!localStorage.getItem("freshcart-token")) return router.push("/login");
    try {
      await apiRequest(isWishlisted ? `/wishlist/${product._id}` : "/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        body: isWishlisted ? undefined : JSON.stringify({ productId: product._id }),
      });
      setSaved(!isWishlisted);
      onWishlistChange?.();
      window.dispatchEvent(new Event("freshcart-wishlist-update"));
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Could not update your wishlist.",
      );
    }
  }

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
      <div className="relative h-60 shrink-0 bg-white">
        <Link
          href={`/productdetails/${product._id}`}
          aria-label={`View ${product.title}`}
          className="absolute inset-0"
        >
          <img
            src={product.imageCover}
            alt={product.title}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition hover:bg-green-600 hover:text-white ${saved ? "text-red-500" : "text-gray-500"}`}
        >
          <LuHeart fill={saved ? "currentColor" : "none"} />
        </button>
        <Link
          href={`/productdetails/${product._id}`}
          aria-label="View product details"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-green-600 hover:text-white"
        >
          <LuEye />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium text-gray-500">{product.category?.name}</p>
        <Link
          href={`/productdetails/${product._id}`}
          className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-gray-800 hover:text-green-700"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex gap-0.5 text-sm text-amber-400">
            {ratingStars(product.ratingsAverage)}
          </span>
          <span className="text-xs text-gray-500">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            {product.priceAfterDiscount ? (
              <>
                <span className="font-bold text-green-700">
                  {product.priceAfterDiscount} EGP
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price} EGP
                </span>
              </>
            ) : (
              <span className="font-bold text-gray-800">{product.price} EGP</span>
            )}
          </div>
          <AddBtn productId={product._id} />
        </div>
      </div>
    </article>
  );
}
