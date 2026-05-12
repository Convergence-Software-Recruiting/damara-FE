import FavoriteHeartButton from "../../../features/group-buy/components/FavoriteHeartButton";
import { HOME_BORDER, HOME_CONTROL, HOME_CONTROL_TEXT, HOME_SURFACE } from "../../../shared/constants/homeTheme";

interface HomePopularListProps {
  posts: any[];
  onItemClick: (id: number | string) => void;
}

const pastelTop = ["#E4E2EE", "#F2EDE4", "#F0E5E3"];

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
    <section aria-label="지금 인기 공동구매" style={{ paddingTop: 12 }}>
      <div style={{ padding: "0 16px", marginBottom: 12 }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span style={{ fontSize: 14, lineHeight: "21px" }} aria-hidden>
            🔥
          </span>
          <h2
            style={{
              margin: 0,
              color: "#212529",
              fontSize: 18,
              fontWeight: 800,
              lineHeight: "27px",
            }}
          >
            지금 인기 공동구매
          </h2>
        </div>
      </div>

      <ul
        className="no-scrollbar flex overflow-x-auto"
        style={{
          gap: 10,
          padding: "0 16px 4px",
          margin: 0,
          scrollbarWidth: "none",
        }}
      >
        {sorted.map((post, idx) => {
          const imgUrl = getFirstImageUrl(post);
          const topBg = pastelTop[idx % pastelTop.length];
          const price = Math.floor(post.price ?? 0).toLocaleString();

          return (
            <li key={post.id} style={{ width: 124, flex: "0 0 124px" }}>
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
                  height: 202,
                  overflow: "hidden",
                  borderRadius: 16,
                  backgroundColor: HOME_SURFACE,
                  border: `1px solid ${HOME_BORDER}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}
              >
                <div className="relative" style={{ height: 100, width: "100%", backgroundColor: topBg }}>
                  {idx === 0 ? (
                    <span
                      style={{
                        position: "absolute",
                        left: 7,
                        top: 7,
                        height: 19,
                        padding: "1.5px 8px",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #ff4757, #fa5252)",
                        boxShadow: "0 2px 3px rgba(250,82,82,0.4)",
                        color: "#ffffff",
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: "15px",
                      }}
                    >
                      🔥 HOT
                    </span>
                  ) : null}
                  <FavoriteHeartButton
                    postId={post.id}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: 5,
                      padding: 2,
                      color: "#9ca3af",
                      zIndex: 2,
                    }}
                    iconClassName="size-4"
                  />
                  <div className="flex items-center justify-center" style={{ width: "100%", height: "100%" }}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt=""
                        style={{ maxWidth: 56, maxHeight: 56, objectFit: "contain" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 48,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: idx === 0 ? "#3d5cff" : idx === 1 ? "#ffd43b" : "#212529",
                        }}
                        aria-hidden
                      >
                        {post.icon ?? "📦"}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ padding: "9px 10px 12px" }}>
                  <div className="flex items-center" style={{ gap: 4, height: 18 }}>
                    <span
                      style={{
                        height: 18,
                        padding: "2px 7px",
                        borderRadius: 999,
                        backgroundColor: HOME_CONTROL,
                        color: HOME_CONTROL_TEXT,
                        fontSize: 9,
                        fontWeight: 700,
                        lineHeight: "13.5px",
                      }}
                    >
                      모집중
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: 9, lineHeight: "13.5px" }}>
                      {post.currentQuantity ?? 0}/{post.minParticipants ?? 2}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "5px 0 0",
                      minHeight: 33,
                      color: "#212529",
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: "16.5px",
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
                      margin: 0,
                      color: "#3d5cff",
                      fontSize: 16,
                      fontWeight: 800,
                      lineHeight: "24px",
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
