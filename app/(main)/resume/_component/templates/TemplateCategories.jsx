"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const TemplateCategories = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={`relative px-6 py-3 rounded-full transition-all duration-200 ${
            selectedCategory === category.id
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {category.name}
          <Badge
            variant="secondary"
            className={`ml-3 ${
              selectedCategory === category.id
                ? "bg-white text-blue-600"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};
