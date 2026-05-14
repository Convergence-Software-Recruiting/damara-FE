import { Flame } from "lucide-react";

import FavoriteHeartButton from "../../../features/group-buy/components/FavoriteHeartButton";
import {
  BADGE_INFO_TEXT,
  background,
  BRAND_PRIMARY,
  DANGER,
  GHOST_ON_SOLID,
  HOME_BORDER,
  grey50,
  TEXT_META,
  TEXT_TITLE,
} from "../../../shared/constants/homeTheme";

interface HomePopularListProps {
  posts: any[];
  onItemClick: (id: number | string) => void;
}

const vividTop = [
  "linear-gradient(145deg, #f4f8ff 0%, #eaf3ff 100%)",
  "linear-gradient(145deg, #f7f8fa 0%, #eef2f6 100%)",
  "linear-gradient(145deg, #f2fbf6 0%, #e7f8ed 100%)",
] as const;

function getFirstImageUrl(post: any): string | null {
  const firstImage = post.images?.[0];
  const img =
    (typeof firstImage === "string" ? firstImage : undefined) ||
    firstImage?.imageUrl ||
    firstImage?.url ||
    post.image ||
    null;
  if (!img) return null;
  return img.startsWith("http")
    ? img
    : `${import.meta.env.VITE_API_BASE_URL ?? ""}${img}`;
}

export default function HomePopularList({ posts, onItemClick }: HomePopularListProps) {
  if (posts.length === 0) return null;

  const sorted = [...posts]
    .sort((a, b) => (b.currentQuantity ?? 0) - (a.currentQuantity ?? 0))
    .slice(0, 6);

  return (
    <section aria-label="지금 인기 공동구매" style={{ paddingTop: 14 }}>
      <div style={{ padding: "0 20px", marginBottom: 10 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              background: "transparent",
              flexShrink: 0,
            }}
            aria-hidden
          >
            <Flame size={17} strokeWidth={2} color={DANGER} fill="rgba(240,68,82,0.12)" aria-hidden />
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: TEXT_META, fontSize: 11, fontWeight: 700, lineHeight: "16px" }}>
              실시간 인기
            </p>
            <h2
              style={{
                margin: "2px 0 0",
                color: TEXT_TITLE,
                fontSize: 20,
                fontWeight: 850,
                lineHeight: "29px",
                letterSpacing: "-0.03em",
              }}
            >
              지금 인기 공동구매
            </h2>
          </div>
        </div>
      </div>

      <ul
        className="no-scrollbar flex overflow-x-auto"
        style={{
          gap: 9,
          padding: "0 20px 4px",
          margin: 0,
          scrollbarWidth: "none",
        }}
      >
        {sorted.map((post, idx) => {
          const imgUrl = getFirstImageUrl(post);
          const topBg = vividTop[idx % vividTop.length];
          const price = Math.floor(post.price ?? 0).toLocaleString();

          return (
            <li key={post.id} style={{ width: 112, flex: "0 0 112px" }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onItemClick(post.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onItemClick(post.id);
                  }
                }}
                className="text-left"
                style={{
                  width: "100%",
                  height: 174,
                  overflow: "hidden",
                  borderRadius: 17,
                  backgroundColor: "#ffffff",
                  border: `1px solid ${HOME_BORDER}`,
                  boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
                  cursor: "pointer",
                }}
              >
                <div className="relative" style={{ height: 78, width: "100%", background: topBg }}>
                  {idx === 0 ? (
                    <span
                      style={{
                        position: "absolute",
                        left: 8,
                        top: 8,
                        height: 19,
                        padding: "0 8px 0 6px",
                        borderRadius: 999,
                        backgroundColor: DANGER,
                        color: background,
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: "19px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Flame size={11} strokeWidth={1.9} color={background} fill={GHOST_ON_SOLID} aria-hidden />
                      HOT
                    </span>
                  ) : null}
                  <FavoriteHeartButton
                    postId={post.id}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: 5,
                      padding: 2,
                      color: TEXT_META,
                      zIndex: 2,
                    }}
                    iconClassName="size-4"
                  />
                  <div className="flex items-center justify-center" style={{ width: "100%", height: "100%" }}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt=""
                        style={{ maxWidth: 48, maxHeight: 48, objectFit: "contain" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 32,
                          fontWeight: 700,
                          lineHeight: 1,
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
                        }}
                        aria-hidden
                      >
                        {post.icon ?? "📦"}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ padding: "9px 10px 10px" }}>
                  <div className="flex items-center" style={{ gap: 5, height: 18 }}>
                    <span
                      style={{
                        height: 18,
                        padding: "0 8px",
                        borderRadius: 999,
                        backgroundColor: grey50,
                        color: BADGE_INFO_TEXT,
                        fontSize: 9,
                        fontWeight: 700,
                        lineHeight: "18px",
                      }}
                    >
                      모집중
                    </span>
                    <span style={{ color: TEXT_META, fontSize: 9, lineHeight: "13.5px" }}>
                      {post.currentQuantity ?? 0}/{post.minParticipants ?? 2}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "6px 0 0",
                      minHeight: 30,
                      color: TEXT_TITLE,
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: "17px",
                      letterSpacing: "-0.02em",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: BRAND_PRIMARY,
                      fontSize: 14,
                      fontWeight: 800,
                      lineHeight: "22px",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {price}원
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
