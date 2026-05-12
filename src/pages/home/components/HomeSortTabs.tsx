import { Filter } from "lucide-react";

import { HOME_BORDER, HOME_CANVAS, HOME_CONTROL, HOME_CONTROL_TEXT } from "../../../shared/constants/homeTheme";

export type SortKey = "latest" | "deadline" | "popular";

interface HomeSortTabsProps {
  sortBy: SortKey;
  totalCount: number;
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
  onChange,
  onFilterClick,
}: HomeSortTabsProps) {
  return (
    <div
      className="flex items-center"
      style={{
        height: 45,
        padding: "0 16px",
        borderTop: `1px solid ${HOME_BORDER}`,
        borderBottom: `1px solid ${HOME_BORDER}`,
        backgroundColor: HOME_CANVAS,
        fontSize: 13,
      }}
    >
      <p style={{ flexShrink: 0, margin: 0, color: "#9ca3af", fontSize: 12, lineHeight: "18px" }}>
        총 <span style={{ color: "#212529", fontWeight: 700 }}>{totalCount}</span>개
      </p>
      <span
        aria-hidden
        style={{ width: 1, height: 11, flexShrink: 0, margin: "0 10px", backgroundColor: HOME_BORDER }}
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
                padding: "0 8px",
                color: active ? "#3d5cff" : "#9ca3af",
                fontWeight: active ? 700 : 400,
                fontSize: 13,
                letterSpacing: "-0.1px",
              }}
            >
              {tab.label}
              {active ? (
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    width: 56,
                    height: 3,
                    maxWidth: "90%",
                    transform: "translateX(-50%)",
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    background: "linear-gradient(90deg, #3d5cff, #7b95ff)",
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
        className="flex items-center"
        style={{
          flexShrink: 0,
          gap: 5,
          height: 30,
          padding: "6px 12px",
          borderRadius: 999,
          backgroundColor: HOME_CONTROL,
          color: HOME_CONTROL_TEXT,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <Filter className="size-[13px]" strokeWidth={2.2} color={HOME_CONTROL_TEXT} />
        필터
      </button>
    </div>
  );
}
