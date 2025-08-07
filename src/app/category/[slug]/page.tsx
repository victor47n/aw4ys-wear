import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { Header } from "@/_components/common/header";
import { ProductItem } from "@/_components/common/product-item";
import { db } from "@/db";
import { categoriesTable, productsTable } from "@/db/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.slug, slug),
  });

  if (!category) {
    return notFound();
  }

  const products = await db.query.productsTable.findMany({
    where: eq(productsTable.categoryId, category.id),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="space-y-5 px-5">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              textContainerClassName="max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
