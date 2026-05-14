import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import GroupBuyCard from "../../features/group-buy/components/GroupBuyCard";
import { getFavoritePosts } from "../../features/group-buy/api/groupBuyApi";
import { mapApiPostToGroupBuyCard } from "../../features/group-buy/utils/postToCardProps";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import { HOME_BORDER, HOME_CANVAS } from "../../shared/constants/homeTheme";
import { UI_PAGE_PAD_X, UI_SECTION_GAP, UI_T_HEADER_TITLE } from "../../shared/constants/damaraUISystem";
import { ROUTES } from "../../app/router/routes";
import EmptyState from "../../shared/components/damara/EmptyState";
import { SkeletonGroupBuyRow } from "../../shared/components/damara/Skeleton";

export default function FavoriteGroupBuyPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) {
        setError("로그인이 필요해요.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getFavoritePosts(userId);

        let postsData: any[] = [];
        if (Array.isArray(res.data)) {
          postsData = res.data;
        } else if (res.data?.posts && Array.isArray(res.data.posts)) {
          postsData = res.data.posts;
        } else if (res.data?.favorites && Array.isArray(res.data.favorites)) {
          postsData = res.data.favorites;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          postsData = res.data.data;
        }

        setPosts(postsData);
      } catch (err: any) {
        console.error("관심목록 로드 실패:", err);
        if (err.response?.status === 404) {
          setPosts([]);
          setError(null);
        } else {
          setError("목록을 불러올 수 없어요.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, []);

  const normalized = posts.map((item) => {
    const p = item.post ?? item;
    return p;
  });

  return (
    <div data-page="관심목록" style={{ minHeight: "100dvh", backgroundColor: HOME_CANVAS }}>
      <header
        style={{
          height: 56,
          padding: `12px ${UI_PAGE_PAD_X}px`,
          borderBottom: `1px solid ${HOME_BORDER}`,
          backgroundColor: HOME_CANVAS,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: UI_T_HEADER_TITLE.size,
            fontWeight: UI_T_HEADER_TITLE.weight,
            color: "#191f28",
            letterSpacing: "-0.02em",
          }}
        >
          관심목록
        </h1>
      </header>

      <main style={{ padding: `${UI_SECTION_GAP}px ${UI_PAGE_PAD_X}px 100px` }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SkeletonGroupBuyRow />
            <SkeletonGroupBuyRow />
            <SkeletonGroupBuyRow />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Heart size={48} strokeWidth={1.5} />}
            title="불러오지 못했어요"
            description={error}
            actionLabel="홈으로"
            onAction={() => nav(ROUTES.HOME)}
          />
        ) : normalized.length === 0 ? (
          <EmptyState
            icon={<Heart size={48} strokeWidth={1.5} />}
            title="관심목록이 비어 있어요"
            description="마음에 드는 공동구매를 찜해두면 여기에서 볼 수 있어요."
            actionLabel="공구 둘러보기"
            onAction={() => nav(ROUTES.HOME)}
          />
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {normalized.map((p) => (
              <li key={p.id}>
                <GroupBuyCard
                  {...mapApiPostToGroupBuyCard(p, () => nav(ROUTES.GROUP_BUY_DETAIL.replace(":id", String(p.id))))}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
