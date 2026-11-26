import Link from "next/link";
import { getAllCategory } from "@/API/services/routemisr.services";
import CategoryCard from "@/app/_components/CategoryCard/CategoryCard";

export default async function CategoriesPage() {
  const categories = await getAllCategory();
  return (
    <main className="mx-auto w-full max-w-[1536px] px-4 py-10 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
        Find your favorites
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Shop by category</h1>
      <p className="mt-2 text-gray-500">
        Browse our collections and find the right thing for every day.
      </p>
      {categories.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category._id} categories={category} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-gray-50 p-8 text-center text-gray-500">
          Categories are temporarily unavailable.{" "}
          <Link href="/shop" className="text-green-700 underline">
            Browse all products
          </Link>
        </p>
      )}
    </main>
  );
}
