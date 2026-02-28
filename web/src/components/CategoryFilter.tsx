"use client";

import { useState } from "react";
import { ArxivCategory } from "@/lib/types";

// 카테고리별 칩 색상
const chipColors: Record<string, string> = {
  "cs.AI": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  "cs.LG": "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  "cs.CL": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  "cs.CV": "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  "stat.ML": "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700",
  "cs.RO": "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  "cs.NE": "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700",
  "cs.IR": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
};

function getChipColor(categoryId: string, selected: boolean): string {
  if (!selected) {
    return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
  return chipColors[categoryId] ?? "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
}

interface CategoryFilterProps {
  categories: ArxivCategory[];
  onFilterChange: (selectedCategories: string[]) => void;
}

export default function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    const next = selected.includes(categoryId)
      ? selected.filter((id) => id !== categoryId)
      : [...selected, categoryId];
    setSelected(next);
    onFilterChange(next);
  };

  const toggleAll = () => {
    if (selected.length === 0) {
      // 전체 선택
      const all = categories.map((c) => c.id);
      setSelected(all);
      onFilterChange(all);
    } else {
      // 전체 해제
      setSelected([]);
      onFilterChange([]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={toggleAll}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          selected.length === 0
            ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => toggleCategory(cat.id)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${getChipColor(cat.id, selected.includes(cat.id))}`}
        >
          {cat.id}
        </button>
      ))}
    </div>
  );
}
