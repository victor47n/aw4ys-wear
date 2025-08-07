import Image from "next/image";
import Link from "next/link";

import { formatCentsToBRL } from "@/_helpers/money";
import { cn } from "@/_lib/utils";
import { productsTable, productVariantsTable } from "@/db/schema";

interface ProductItemProps {
  product: typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

export const ProductItem = ({
  product,
  textContainerClassName,
}: ProductItemProps) => {
  const firstVariant = product.variants[0];
  return (
    <Link
      href={`/product-variant/${firstVariant.slug}`}
      className="flex flex-col gap-4"
    >
      <Image
        src={firstVariant.imageUrl}
        alt={firstVariant.name}
        sizes="100vw"
        width={0}
        height={0}
        className="h-auto w-full rounded-3xl"
      />
      <div
        className={cn(
          "flex max-w-[200px] flex-col gap-1",
          textContainerClassName,
        )}
      >
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="mt-6 truncate text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};
