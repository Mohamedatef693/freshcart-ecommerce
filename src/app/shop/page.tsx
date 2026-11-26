import Link from "next/link";
import { getAllProduct } from "@/API/services/routemisr.services";
import ProductCard from "@/app/_components/ProductCard/ProductCard";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const products = await getAllProduct();
  const visible = products.filter((product) =>
    `${product.title} ${product.category?.name} ${product.brand?.name}`
      .toLowerCase()
      .includes((params.q || "").toLowerCase()),
  );
  if (params.sort === "price-low") visible.sort((a, b) => a.price - b.price);
  if (params.sort === "price-high") visible.sort((a, b) => b.price - a.price);
  return (
    <main className="mx-auto w-full max-w-[1536px] px-4 py-10 sm:px-8">
      <div className="rounded-2xl bg-gradient-to-r from-green-800 to-green-600 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-green-100">
          Fresh finds for everyday
        </p>
        <h1 className="mt-2 text-4xl font-bold">Shop all products</h1>
        <p className="mt-3 max-w-xl text-green-50">
          Thoughtful picks and everyday essentials, all in one place.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-500">{visible.length} items to explore</p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search products"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
          />
          <select
            name="sort"
            defaultValue={params.sort || ""}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Sort by</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
            Apply
          </button>
        </form>
      </div>
      {visible.length ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-gray-100 p-12 text-center text-gray-500">
          No products found.{" "}
          <Link href="/shop" className="text-green-700 underline">
            Clear search
          </Link>
        </div>
      )}
    </main>
  );
}
