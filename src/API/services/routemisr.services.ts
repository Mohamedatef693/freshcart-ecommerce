import { ProductType } from "../types/product.type";
import { CategoryType } from "../types/category.type";
import { getCollection } from "./client";

export async function getAllProduct(): Promise<ProductType[]> {
  return getCollection<ProductType>("/products?limit=40");
}

export async function getCatsProduct(id: string): Promise<ProductType[]> {
  return getCollection<ProductType>(
    `/products?category[in]=${encodeURIComponent(id)}&limit=40`,
  );
}

export async function getAllCategory(): Promise<CategoryType[]> {
  return getCollection<CategoryType>("/categories");
}

export async function getSingleProduct(id: string): Promise<ProductType | undefined> {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return undefined;
    const payload = await response.json();
    return payload.data;
  } catch {
    return undefined;
  }
}

export async function getAllBrands() {
  return getCollection<{ _id: string; name: string; slug: string; image: string }>(
    "/brands",
  );
}

export async function getSingleCategory(id: string) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return undefined;
    return (await response.json()).data as CategoryType;
  } catch {
    return undefined;
  }
}

export async function getSingleBrand(id: string) {
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return undefined;
    return (await response.json()).data as {
      _id: string;
      name: string;
      slug: string;
      image: string;
    };
  } catch {
    return undefined;
  }
}
