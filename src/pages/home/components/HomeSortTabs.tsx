import { SlidersHorizontal } from "lucide-react";

import { BRAND_PRIMARY, blue50, HOME_BORDER, TEXT_META, TEXT_TITLE } from "../../../shared/constants/homeTheme";

export type SortKey = "latest" | "deadline" | "popular";

interface HomeSortTabsProps {
  sortBy: SortKey;
  totalCount: number;
  /** 카테고리 등 적용된 필터 개수 — 0이면 필터 버튼에 숫자 배지 숨김 */
  appliedFilterCount?: number;
  onChange: (key: SortKey) => void;
  onFilterClick?: () => void;
}

const TABS: { key: SortKey; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "deadline", label: "마감임박순" },
  { key: "popular", label: "인기순" },
];

export default function HomeSortTabs({
  sortBy,
  totalCount,
  appliedFilterCount = 0,
  onChange,
  onFilterClick,
}: HomeSortTabsProps) {
  return (
    <div
      className="flex items-center"
      style={{
        height: 44,
        padding: "0 20px",
        backgroundColor: "transparent",
        fontSize: 12,
      }}
    >
      <p style={{ flexShrink: 0, margin: 0, color: TEXT_META, fontSize: 11, lineHeight: "16px" }}>
        총 <span style={{ color: TEXT_TITLE, fontWeight: 700 }}>{totalCount}</span>개
      </p>
      <span
        aria-hidden
        style={{ width: 1, height: 10, flexShrink: 0, margin: "0 11px", backgroundColor: HOME_BORDER }}
      />
      <div role="tablist" aria-label="정렬" className="flex" style={{ minWidth: 0, flex: 1, height: "100%" }}>
        {TABS.map((tab) => {
          const active = sortBy === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.key)}
              className="relative flex items-center justify-center"
              style={{
                flexShrink: 0,
                height: "100%",
                padding: "0 7px",
                color: active ? BRAND_PRIMARY : TEXT_META,
                fontWeight: active ? 800 : 600,
                fontSize: 12,
                letterSpacing: "-0.02em",
              }}
            >
              {tab.label}
              {active ? (
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    width: 36,
                    height: 2,
                    maxWidth: "90%",
                    transform: "translateX(-50%)",
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    background: BRAND_PRIMARY,
                  }}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        aria-label={appliedFilterCount > 0 ? `필터, ${appliedFilterCount}개 적용됨` : "필터"}
        className="relative flex items-center justify-center"
        style={{
          flexShrink: 0,
          gap: 4,
          height: 30,
          padding: "0 12px",
          borderRadius: 999,
          border: `1px solid ${blue50}`,
          backgroundColor: blue50,
          color: BRAND_PRIMARY,
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
          boxShadow: "0 1px 4px rgba(49,130,246,0.10)",
        }}
      >
        <SlidersHorizontal
          size={11}
          strokeWidth={1.8}
          color={BRAND_PRIMARY}
          className="shrink-0"
          aria-hidden
        />
        필터
        {appliedFilterCount > 0 ? (
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -4,
              right: -2,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 999,
              backgroundColor: BRAND_PRIMARY,
              color: "#fff",
              fontSize: 9,
              fontWeight: 800,
              lineHeight: "16px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            {appliedFilterCount > 99 ? "99+" : appliedFilterCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}
