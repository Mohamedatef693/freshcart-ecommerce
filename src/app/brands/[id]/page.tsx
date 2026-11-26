import Link from "next/link";
import { getAllProduct, getSingleBrand } from "@/API/services/routemisr.services";
import ProductCard from "@/app/_components/ProductCard/ProductCard";

export default async function BrandDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [brand, allProducts] = await Promise.all([getSingleBrand(id), getAllProduct()]);
  const products = allProducts.filter((product) => product.brand?._id === id);
  if (!brand)
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Brand not found</h1>
        <Link href="/brands" className="mt-4 inline-block text-green-700 underline">
          Browse brands
        </Link>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-[1536px] px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-gray-50 p-7">
        {brand.image && (
          <img
            src={brand.image}
            alt={brand.name}
            className="h-24 w-36 rounded-lg bg-white object-contain p-3"
          />
        )}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Brand
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">{brand.name}</h1>
          <p className="mt-2 text-gray-500">Explore products from {brand.name}.</p>
        </div>
      </div>
      <h2 className="mt-9 text-2xl font-bold text-gray-900">Products</h2>
      {products.length ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-gray-50 p-8 text-center text-gray-500">
          No products from this brand were found.
        </p>
      )}
    </main>
  );
}
