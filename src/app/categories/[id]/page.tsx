import Link from "next/link";
import {
  getAllCategory,
  getCatsProduct,
  getSingleCategory,
} from "@/API/services/routemisr.services";
import ProductCard from "@/app/_components/ProductCard/ProductCard";

export async function generateStaticParams() {
  const categories = await getAllCategory();
  return categories.map((category) => ({ id: category._id }));
}

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, products] = await Promise.all([
    getSingleCategory(id),
    getCatsProduct(id),
  ]);
  if (!category)
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link href="/categories" className="mt-4 inline-block text-green-700 underline">
          Browse categories
        </Link>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-[1536px] px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-green-50 p-6 sm:p-9">
        {category.image && (
          <img
            src={category.image}
            alt=""
            className="h-24 w-24 rounded-full bg-white object-cover p-2"
          />
        )}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Category
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="mt-2 text-gray-600">Explore products in this collection.</p>
        </div>
      </div>
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-500">{products.length} items</p>
        </div>
        <Link
          href="/categories"
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          All categories
        </Link>
      </div>
      {products.length ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-gray-50 p-8 text-center text-gray-500">
          No products found in this category yet.
        </p>
      )}
    </main>
  );
}
