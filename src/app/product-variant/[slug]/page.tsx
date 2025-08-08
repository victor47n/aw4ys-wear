import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Footer } from "@/_components/common/footer";
import { Header } from "@/_components/common/header";
import { ProductList } from "@/_components/common/product-list";
import { formatCentsToBRL } from "@/_helpers/money";
import { db } from "@/db";
import { productsTable, productVariantsTable } from "@/db/schema";

import { ProductActions } from "./_components/product-actions";
import { VariantSelector } from "./_components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;

  const productVariant = await db.query.productVariantsTable.findFirst({
    where: eq(productVariantsTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }
  const likelyProducts = await db.query.productsTable.findMany({
    where: eq(productsTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  if (!productVariant) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        <Image
          src={productVariant.imageUrl}
          alt={productVariant.name}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full"
        />

        <div className="px-5">
          <VariantSelector
            selectedVariantSlug={productVariant.slug}
            variants={productVariant.product.variants}
          />
        </div>

        <div className="px-5">
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={productVariant.id} />

        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
