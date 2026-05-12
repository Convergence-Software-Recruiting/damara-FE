export interface CategoryItem {
  id: string;
  label: string;
  emoji: string;
}

/** 홈 상단 카테고리 칩 데이터 — 컴포넌트 파일과 분리해 HMR Fast Refresh가 깨지지 않게 함 */
export const HOME_CATEGORIES: CategoryItem[] = [
  { id: "all", label: "전체", emoji: "" },
  { id: "food", label: "먹거리", emoji: "🍴" },
  { id: "daily", label: "일상용품", emoji: "🛒" },
  { id: "beauty", label: "뷰티·패션", emoji: "💄" },
];
