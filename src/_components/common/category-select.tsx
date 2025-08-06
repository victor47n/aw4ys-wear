import { categoriesTable } from "@/db/schema";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories: (typeof categoriesTable.$inferSelect)[];
}

export const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="rounded-full bg-white text-xs font-semibold"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
