import { HOME_BORDER, HOME_CONTROL_TEXT, HOME_SURFACE } from "../../../shared/constants/homeTheme";

import { HOME_CATEGORIES } from "../constants/homeCategoryChipsData";

interface HomeCategoryChipsProps {
  activeCategory: string;
  onChange: (id: string) => void;
}

export default function HomeCategoryChips({
  activeCategory,
  onChange,
}: HomeCategoryChipsProps) {
  return (
    <div
      role="tablist"
      aria-label="홈 카테고리 필터"
      className="no-scrollbar flex items-center overflow-x-auto"
      style={{
        gap: 5,
        padding: "4px 8px 4px 14px",
        scrollbarWidth: "none",
      }}
    >
      {HOME_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const isAll = cat.id === "all";
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className="flex items-center"
            style={{
              flexShrink: 0,
              gap: 4,
              height: isActive ? 28 : 30,
              padding: isAll ? "5px 11px" : "5px 10px",
              borderRadius: 999,
              border: isActive ? "1px solid transparent" : `1px solid ${HOME_BORDER}`,
              backgroundColor: isActive ? "#3d5cff" : HOME_SURFACE,
              color: isActive ? "#ffffff" : HOME_CONTROL_TEXT,
              fontSize: 11,
              lineHeight: "16px",
              fontWeight: isActive ? 700 : 500,
              whiteSpace: "nowrap",
              boxShadow: isActive ? "0 2px 4px rgba(61,92,255,0.28)" : "none",
            }}
          >
            {!isAll && cat.emoji ? (
              <span style={{ fontSize: 9, lineHeight: 1 }} aria-hidden>
                {cat.emoji}
              </span>
            ) : null}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
