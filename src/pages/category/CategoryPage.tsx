import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCw, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "../../app/router/routes";
import FavoriteHeartButton from "../../features/group-buy/components/FavoriteHeartButton";
import EmptyState from "../../shared/components/damara/EmptyState";
import {
  BADGE_INFO_BG,
  BADGE_INFO_TEXT,
  BADGE_URGENT_BG,
  BADGE_URGENT_TEXT,
  blue50,
  BRAND_PRIMARY,
  green50,
  HOME_BORDER,
  HOME_CANVAS,
  purple50,
  SCRIM_LIGHT,
  TEXT_META,
  yellow50,
  grey500,
  grey900,
} from "../../shared/constants/homeTheme";
import {
  UI_BADGE_FS,
  UI_BADGE_FW,
  UI_PAGE_PAD_X,
  UI_R_BADGE,
  UI_IX_BUTTON,
  UI_IX_HOVER_GREY50,
} from "../../shared/constants/damaraUISystem";

/** 홈과 동일 토큰 + 포인트 컬러 */
const C_SEARCH_BG = "#ffffff";
const C_CHIP_BORDER = HOME_BORDER;

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
    thumbBg: yellow50,
    badge: "recruiting",
  },
  {
    id: 102,
    title: "비트 딥클린 액체세제 2.7L",
    price: 7900,
    current: 18,
    max: 30,
    categories: ["all", "daily"],
    thumbBg: blue50,
    badge: "recruiting",
  },
  {
    id: 103,
    title: "케라시스 데미지 클리닉 샴푸",
    price: 6800,
    current: 15,
    max: 25,
    categories: ["all", "beauty", "daily"],
    thumbBg: purple50,
    badge: "recruiting",
  },
  {
    id: 104,
    title: "캠퍼스 B5 노트 옐로우 5권",
    price: 2900,
    current: 9,
    max: 20,
    categories: ["all", "stationery"],
    thumbBg: yellow50,
    badge: "recruiting",
  },
  {
    id: 105,
    title: "케라시스 퍼퓸 샴푸 400ml",
    price: 8500,
    current: 22,
    max: 25,
    categories: ["all", "beauty"],
    thumbBg: purple50,
    badge: "closing",
  },
  {
    id: 106,
    title: "오리온 꼬북칩 콘스프맛 65g",
    price: 3200,
    current: 5,
    max: 15,
    categories: ["all", "food"],
    thumbBg: green50,
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
        backgroundColor: HOME_CANVAS,
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
          padding: `8px ${UI_PAGE_PAD_X}px 6px`,
          backgroundColor: "rgba(249, 250, 251, 0.94)",
          borderBottom: `1px solid rgba(229, 232, 235, 0.56)`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 850,
            color: grey900,
            lineHeight: "28px",
            letterSpacing: "-0.025em",
          }}
        >
          카테고리
        </h1>
        <button
          type="button"
          aria-label="새로고침"
          onClick={() => toast.message("목록을 곧 새로고침해요.")}
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "#fff",
            borderRadius: 999,
            cursor: "pointer",
            color: grey500,
          }}
        >
          <RotateCw size={16} strokeWidth={2.1} />
        </button>
      </div>

      <div style={{ padding: `12px ${UI_PAGE_PAD_X}px 0`, flexShrink: 0 }}>
        <label
          className="flex items-center gap-2"
          style={{
            height: 46,
            padding: "0 15px",
            borderRadius: 15,
            border: `1px solid rgba(229, 232, 235, 0.92)`,
            backgroundColor: C_SEARCH_BG,
            boxSizing: "border-box",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.035)",
          }}
        >
          <Search size={18} strokeWidth={2} style={{ color: grey500, flexShrink: 0 }} aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="상품 검색"
            className="placeholder:text-[#b0b8c1]"
            style={{
              flex: 1,
              minWidth: 0,
              height: "100%",
              border: "none",
              background: "transparent",
              fontSize: 14,
              fontWeight: 500,
              color: grey900,
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
          padding: `10px ${UI_PAGE_PAD_X}px 12px`,
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
              className={active ? UI_IX_BUTTON : `${UI_IX_BUTTON} ${UI_IX_HOVER_GREY50} bg-white`}
              style={{
                flexShrink: 0,
                height: 32,
                padding: "0 13px",
                borderRadius: UI_R_BADGE,
                border: active ? `1px solid ${blue50}` : `1px solid ${C_CHIP_BORDER}`,
                background: active ? blue50 : "#ffffff",
                color: active ? BRAND_PRIMARY : TEXT_META,
                fontSize: 12.5,
                fontWeight: active ? 800 : 600,
                lineHeight: "32px",
                cursor: "pointer",
                boxShadow: "none",
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
          padding: `0 ${UI_PAGE_PAD_X}px 96px`,
          minHeight: 0,
        }}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={<Search size={56} strokeWidth={1.25} />}
            title="검색 결과가 없어요"
            description="다른 검색어나 카테고리로 다시 찾아볼까요?"
          />
        ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
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
              className="transition-[transform,background-color] duration-150 ease-out active:scale-[0.98]"
              style={{
                borderRadius: 18,
                border: `1px solid rgba(229, 232, 235, 0.92)`,
                backgroundColor: "#ffffff",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.035)",
              }}
            >
              <div className="relative" style={{ height: 136, background: `linear-gradient(145deg, ${p.thumbBg} 0%, ${blue50} 100%)` }}>
                <span
                  style={{
                    position: "absolute",
                    left: 8,
                    top: 8,
                    height: 20,
                    padding: "0 8px",
                    borderRadius: UI_R_BADGE,
                    backgroundColor: p.badge === "closing" ? BADGE_URGENT_BG : BADGE_INFO_BG,
                    color: p.badge === "closing" ? BADGE_URGENT_TEXT : BADGE_INFO_TEXT,
                    fontSize: 10,
                    fontWeight: UI_BADGE_FW,
                    lineHeight: "20px",
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
                      color: TEXT_META,
                      background: SCRIM_LIGHT,
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
                  <span style={{ fontSize: 46 }}>📦</span>
                </div>
              </div>
              <div style={{ padding: "11px 12px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: grey900,
                    lineHeight: "18.5px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.title}
                </p>
                <p style={{ margin: 0, fontSize: 16.5, fontWeight: 850, color: BRAND_PRIMARY, lineHeight: "21px", letterSpacing: "-0.03em" }}>
                  {formatPrice(p.price)}
                </p>
                <div className="flex items-center" style={{ gap: 4 }}>
                  <Users size={13} strokeWidth={2} style={{ color: TEXT_META, flexShrink: 0 }} aria-hidden />
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: TEXT_META, lineHeight: "17px" }}>
                    {p.current}/{p.max}명 참여 중
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}
