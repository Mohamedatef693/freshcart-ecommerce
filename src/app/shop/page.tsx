import { getAllProduct } from "@/API/services/routemisr.services";
import ShopView from "@/app/_components/ShopView";

export default async function ShopPage() {
  const products = await getAllProduct();
  return <ShopView products={products} />;
}
