export type SortKey = "latest" | "deadline" | "popular";

interface HomeSortTabsProps {
  sortBy: SortKey;
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
  onChange,
  onFilterClick,
}: HomeSortTabsProps) {
  return (
    <div className="flex items-center">
      <div role="tablist" aria-label="정렬" className="flex-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={sortBy === tab.key}
            data-active={sortBy === tab.key}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onFilterClick}>
        
        필터
      </button>
    </div>
  );
}
