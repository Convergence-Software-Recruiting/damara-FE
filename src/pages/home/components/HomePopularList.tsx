interface HomePopularListProps {
  posts: any[];
  onItemClick: (id: number | string) => void;
}

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

export default function HomePopularList({
  posts,
  onItemClick,
}: HomePopularListProps) {
  if (posts.length === 0) return null;

  const sorted = [...posts]
    .sort((a, b) => (b.currentQuantity ?? 0) - (a.currentQuantity ?? 0))
    .slice(0, 6);

  return (
    <section aria-label="지금 인기 공동구매">
      <div className="flex items-center justify-between">
        <div>
          
          <span>지금 인기 공동구매</span>
        </div>
        <button type="button">더보기&gt;</button>
      </div>

      <ul>
        {sorted.map((post, idx) => {
          const imgUrl = getFirstImageUrl(post);

          return (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => onItemClick(post.id)}
                className="text-left"
              >
                <div>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={post.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div aria-hidden>🛒</div>
                  )}
                  {idx < 3 && <span data-badge="hot">HOT</span>}
                  <span data-badge="status">모집중</span>
                  <span data-badge="participants">
                    👥 {post.currentQuantity ?? 0}/{post.minParticipants ?? 2}
                  </span>
                </div>
                <p>{post.title}</p>
                <p>{Math.floor(post.price ?? 0).toLocaleString()}원</p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
