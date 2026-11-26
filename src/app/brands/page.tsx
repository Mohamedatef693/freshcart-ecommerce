import Link from "next/link";
import { getAllBrands } from "@/API/services/routemisr.services";

export default async function BrandsPage() {
  const brands = await getAllBrands();
  return (
    <main className="mx-auto w-full max-w-[1536px] px-4 py-10 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
        The names you trust
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Shop by brand</h1>
      <p className="mt-2 text-gray-500">Discover products from the brands you love.</p>
      {brands.length ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="group flex min-h-44 flex-col items-center justify-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
            >
              <div className="flex h-24 w-full items-center justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-green-700">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-gray-50 p-8 text-center text-gray-500">
          Brands are temporarily unavailable.
        </p>
      )}
    </main>
  );
}
