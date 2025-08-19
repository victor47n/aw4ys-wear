import { desc } from "drizzle-orm";

import { db } from "@/db";
import { productsTable } from "@/db/schema";

export const getProductsWithVariants = async () => {
  const products = await db.query.productsTable.findMany({
    with: {
      variants: true,
    },
  });
  return products;
};

export const getNewlyCreatedProducts = async () => {
  const products = await db.query.productsTable.findMany({
    orderBy: [desc(productsTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return products;
};
