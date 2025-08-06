import type { productsTable, productVariantsTable } from "@/db/schema";

import { ProductItem } from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  })[];
}

export const ProductList = async ({ title, products }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
