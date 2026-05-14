export type HomeCategoryId = "all" | "food" | "daily" | "beauty" | "stationery";

export interface CategoryItem {
  id: HomeCategoryId;
  label: string;
  emoji: string;
}

/** 카테고리 탭과 동일한 id·라벨 — 홈 상단 칩과 목록 필터 기준을 맞춤 */
export const HOME_CATEGORIES: CategoryItem[] = [
  { id: "all", label: "전체", emoji: "" },
  { id: "food", label: "🍴 먹거리", emoji: "" },
  { id: "daily", label: "🧴 생활용품", emoji: "" },
  { id: "beauty", label: "👜 뷰티·패션", emoji: "" },
  { id: "stationery", label: "✏️ 학용품", emoji: "" },
];
