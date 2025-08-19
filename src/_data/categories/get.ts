import { db } from "@/db";

export const getCategories = async () => {
  const categories = await db.query.categoriesTable.findMany();
  return categories;
};
