import {
  blue50,
  BRAND_PRIMARY,
  HOME_BORDER,
  TEXT_META,
} from "../../../shared/constants/homeTheme";
import { UI_IX_BUTTON, UI_IX_HOVER_GREY50, UI_PAGE_PAD_X, UI_R_BADGE } from "../../../shared/constants/damaraUISystem";

import { HOME_CATEGORIES, type HomeCategoryId } from "../constants/homeCategoryChipsData";

const C_CHIP_BORDER = HOME_BORDER;

interface HomeCategoryChipsProps {
  activeCategory: HomeCategoryId;
  onChange: (id: HomeCategoryId) => void;
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
        gap: 7,
        padding: `10px ${UI_PAGE_PAD_X}px 12px`,
        scrollbarWidth: "none",
      }}
    >
      {HOME_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className={isActive ? UI_IX_BUTTON : `${UI_IX_BUTTON} ${UI_IX_HOVER_GREY50} bg-white`}
            style={{
              flexShrink: 0,
              height: 32,
              padding: "0 13px",
              borderRadius: UI_R_BADGE,
              border: isActive ? `1px solid ${blue50}` : `1px solid ${C_CHIP_BORDER}`,
              background: isActive ? blue50 : "#ffffff",
              color: isActive ? BRAND_PRIMARY : TEXT_META,
              fontSize: 12.5,
              lineHeight: "32px",
              fontWeight: isActive ? 800 : 600,
              whiteSpace: "nowrap",
              boxShadow: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
