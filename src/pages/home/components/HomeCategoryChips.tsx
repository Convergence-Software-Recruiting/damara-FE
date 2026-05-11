import type { ElementType } from "react";

export interface CategoryItem {
  id: string;
  label: string;
  Icon: ElementType;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "all", label: "전체", Icon: LayoutGrid },
  { id: "food", label: "먹거리", Icon: Utensils },
  { id: "daily", label: "일상용품", Icon: ShoppingBag },
  { id: "beauty", label: "뷰티·패션", Icon: Sparkles },
  { id: "school", label: "학용품", Icon: Pencil },
];

interface HomeCategoryChipsProps {
  categories?: CategoryItem[];
  activeCategory: string;
  onChange: (id: string) => void;
}

export default function HomeCategoryChips({
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onChange,
}: HomeCategoryChipsProps) {
  return (
    <div role="tablist" aria-label="카테고리">
      {categories.map((cat) => {
        const Icon = cat.Icon;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-active={isActive}
            onClick={() => onChange(cat.id)}
          >
            <Icon aria-hidden />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
