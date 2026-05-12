import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCw, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "../../app/router/routes";
import FavoriteHeartButton from "../../features/group-buy/components/FavoriteHeartButton";

/** Figma 노드 81:278 기준 */
const C_HEADER_BORDER = "#f3f4f6";
const C_SEARCH_BG = "#f5f6f8";
const C_PRIMARY = "#4358e8";
const C_CHIP_IDLE_BG = "#f8f9fa";
const C_CHIP_BORDER = "#eaecf0";
const C_CARD_BORDER = "#f1f3f5";
const C_TITLE = "#111827";
const C_META = "#888888";
const C_BADGE_GREEN = "#4eaa64";
const C_BADGE_RED = "#fa5252";

type FilterId = "all" | "food" | "daily" | "beauty" | "stationery";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "food", label: "🍴 먹거리" },
  { id: "daily", label: "🧴 생활용품" },
  { id: "beauty", label: "👜 뷰티·패션" },
  { id: "stationery", label: "✏️ 학용품" },
];

type ProductRow = {
  id: number;
  title: string;
  price: number;
  current: number;
  max: number;
  categories: FilterId[];
  thumbBg: string;
  badge: "recruiting" | "closing";
};

const FILTER_IDS = new Set<FilterId>(FILTERS.map((f) => f.id));

function parseCatParam(value: string | null): FilterId {
  if (value && FILTER_IDS.has(value as FilterId)) return value as FilterId;
  return "all";
}

const PRODUCTS: ProductRow[] = [
  {
    id: 101,
    title: "해태 허니버터칩 60g x 4개",
    price: 5200,
    current: 12,
    max: 20,
    categories: ["all", "food"],
    thumbBg: "#fff4d2",
    badge: "recruiting",
  },
  {
    id: 102,
    title: "비트 딥클린 액체세제 2.7L",
    price: 7900,
    current: 18,
    max: 30,
    categories: ["all", "daily"],
    thumbBg: "#e8f1f9",
    badge: "recruiting",
  },
  {
    id: 103,
    title: "케라시스 데미지 클리닉 샴푸",
    price: 6800,
    current: 15,
    max: 25,
    categories: ["all", "beauty", "daily"],
    thumbBg: "#f9ebef",
    badge: "recruiting",
  },
  {
    id: 104,
    title: "캠퍼스 B5 노트 옐로우 5권",
    price: 2900,
    current: 9,
    max: 20,
    categories: ["all", "stationery"],
    thumbBg: "#fdf7e5",
    badge: "recruiting",
  },
  {
    id: 105,
    title: "케라시스 퍼퓸 샴푸 400ml",
    price: 8500,
    current: 22,
    max: 25,
    categories: ["all", "beauty"],
    thumbBg: "#f9ebef",
    badge: "closing",
  },
  {
    id: 106,
    title: "오리온 꼬북칩 콘스프맛 65g",
    price: 3200,
    current: 5,
    max: 15,
    categories: ["all", "food"],
    thumbBg: "#e8f9ee",
    badge: "recruiting",
  },
];

function formatPrice(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

export default function CategoryPage() {
  const nav = useNavigate();
  const location = useLocation();
  const filter = useMemo(
    () => parseCatParam(new URLSearchParams(location.search).get("cat")),
    [location.search]
  );
  const [search, setSearch] = useState("");

  const setFilterAndUrl = (id: FilterId) => {
    const nextSearch = id === "all" ? "" : `?cat=${encodeURIComponent(id)}`;
    nav({ pathname: ROUTES.CATEGORY, search: nextSearch }, { replace: true });
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (filter !== "all" && !p.categories.includes(filter)) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q);
    });
  }, [filter, search]);

  return (
    <div
      data-page="카테고리"
      style={{
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 8px",
          borderBottom: `1px solid ${C_HEADER_BORDER}`,
          backgroundColor: "#fff",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: "#111",
            lineHeight: "27px",
            letterSpacing: "-0.02em",
          }}
        >
          카테고리
        </h1>
        <button
          type="button"
          aria-label="새로고침"
          onClick={() => toast.message("목록을 곧 새로고침합니다.")}
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#111",
          }}
        >
          <RotateCw size={20} strokeWidth={2} />
        </button>
      </div>

      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <label
          className="flex items-center gap-2"
          style={{
            height: 41,
            padding: "0 14px",
            borderRadius: 999,
            backgroundColor: C_SEARCH_BG,
            boxSizing: "border-box",
          }}
        >
          <Search size={14} strokeWidth={2} style={{ color: "rgba(17,17,17,0.45)", flexShrink: 0 }} aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="상품 검색"
            style={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              border: "none",
              background: "transparent",
              fontSize: 14,
              color: "#111",
              outline: "none",
            }}
          />
        </label>
      </div>

      <div
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 7,
          padding: "12px 16px",
          overflowX: "auto",
          flexShrink: 0,
          scrollbarWidth: "none",
        }}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterAndUrl(f.id)}
              style={{
                flexShrink: 0,
                height: 36.5,
                padding: "0 14px",
                borderRadius: 999,
                border: active ? "1.5px solid transparent" : `1.5px solid ${C_CHIP_BORDER}`,
                backgroundColor: active ? C_PRIMARY : C_CHIP_IDLE_BG,
                color: active ? "#fff" : "#555555",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                lineHeight: "19.5px",
                cursor: "pointer",
                boxShadow: active ? "0px 3px 5px rgba(67,88,232,0.3)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <main
        style={{
          flex: 1,
          padding: "0 14px 24px",
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {visible.map((p) => (
            <article
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => nav(ROUTES.GROUP_BUY_DETAIL.replace(":id", String(p.id)))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  nav(ROUTES.GROUP_BUY_DETAIL.replace(":id", String(p.id)));
                }
              }}
              style={{
                borderRadius: 16,
                border: `1px solid ${C_CARD_BORDER}`,
                backgroundColor: "#fff",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div className="relative" style={{ aspectRatio: "1", backgroundColor: p.thumbBg }}>
                <span
                  style={{
                    position: "absolute",
                    left: 8,
                    top: 8,
                    height: 22.5,
                    padding: "0 9px",
                    borderRadius: 999,
                    backgroundColor: p.badge === "closing" ? C_BADGE_RED : C_BADGE_GREEN,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: "22.5px",
                  }}
                >
                  {p.badge === "closing" ? "마감임박" : "모집중"}
                </span>
                <div
                  style={{ position: "absolute", right: 6, top: 6 }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="presentation"
                >
                  <FavoriteHeartButton
                    postId={p.id}
                    style={{
                      padding: 4,
                      color: "#9ca3af",
                      background: "rgba(255,255,255,0.65)",
                      borderRadius: 999,
                    }}
                    iconClassName="size-[18px]"
                  />
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.15,
                    pointerEvents: "none",
                  }}
                  aria-hidden
                >
                  <span style={{ fontSize: 56 }}>📦</span>
                </div>
              </div>
              <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: C_TITLE,
                    lineHeight: "19.5px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.title}
                </p>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C_PRIMARY, lineHeight: "25.5px" }}>
                  {formatPrice(p.price)}
                </p>
                <div className="flex items-center" style={{ gap: 4 }}>
                  <Users size={13} strokeWidth={2} style={{ color: C_META, flexShrink: 0 }} aria-hidden />
                  <span style={{ fontSize: 11, color: C_META, lineHeight: "16.5px" }}>
                    {p.current}/{p.max}명 참여중
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 ? (
          <p style={{ textAlign: "center", color: C_META, fontSize: 14, marginTop: 32 }}>해당하는 공구가 없습니다.</p>
        ) : null}
      </main>
    </div>
  );
}
