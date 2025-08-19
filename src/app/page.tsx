import { desc } from "drizzle-orm";
import Image from "next/image";

import { CategorySelector } from "@/_components/common/category-selector";
import { Footer } from "@/_components/common/footer";
import { Header } from "@/_components/common/header";
import { ProductList } from "@/_components/common/product-list";
import { getCategories } from "@/_data/categories/get";
import {
  getNewlyCreatedProducts,
  getProductsWithVariants,
} from "@/_data/products/get";

export default async function Home() {
  const [products, newlyCreatedProducts, categories] = await Promise.all([
    getProductsWithVariants(),
    getNewlyCreatedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Header />

      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banner-01.png"
            alt="LEve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList title="Mais vendidos" products={products} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <Image
            src="/banner-02.png"
            alt="LEve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList products={newlyCreatedProducts} title="Novos produtos" />

        <Footer />
      </div>
    </>
  );
}
