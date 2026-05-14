import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import GroupBuyCard from "../../features/group-buy/components/GroupBuyCard";
import { getParticipatedPosts, getPostDetail } from "../../features/group-buy/api/groupBuyApi";
import { mapApiPostToGroupBuyCard } from "../../features/group-buy/utils/postToCardProps";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import { HOME_BORDER, HOME_CANVAS } from "../../shared/constants/homeTheme";
import { UI_PAGE_PAD_X, UI_SECTION_GAP, UI_T_HEADER_TITLE } from "../../shared/constants/damaraUISystem";
import { ROUTES } from "../../app/router/routes";
import EmptyState from "../../shared/components/damara/EmptyState";
import { SkeletonGroupBuyRow } from "../../shared/components/damara/Skeleton";

export default function MyJoinedGroupBuyPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipatedPosts = async () => {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) {
        setError("로그인이 필요해요.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getParticipatedPosts(userId);
        const postsData = res.data?.posts || res.data || [];

        const postsWithDetails = await Promise.all(
          postsData.map(async (item: any) => {
            const post = item.post || item;
            const postId = post.id || post.postid;
            if (postId) {
              try {
                const detailRes = await getPostDetail(postId);
                const fullPost = detailRes.data;
                return {
                  ...item,
                  post: {
                    ...post,
                    ...fullPost,
                  },
                };
              } catch (err) {
                console.error(`게시글 ${postId} 상세 정보 가져오기 실패:`, err);
                return item;
              }
            }
            return item;
          })
        );

        setPosts(Array.isArray(postsWithDetails) ? postsWithDetails : []);
      } catch (err) {
        console.error(err);
        setError("목록을 불러올 수 없어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedPosts();
  }, []);

  const normalized = posts.map((item) => item.post || item);

  return (
    <div data-page="참여한 공구" style={{ minHeight: "100dvh", backgroundColor: HOME_CANVAS }}>
      <header
        style={{
          height: 56,
          padding: `12px ${UI_PAGE_PAD_X}px`,
          borderBottom: `1px solid ${HOME_BORDER}`,
          backgroundColor: HOME_CANVAS,
        }}
      >
        <h1 style={{ margin: 0, fontSize: UI_T_HEADER_TITLE.size, fontWeight: UI_T_HEADER_TITLE.weight, color: "#191f28" }}>
          참여한 공동구매
        </h1>
      </header>

      <main style={{ padding: `${UI_SECTION_GAP}px ${UI_PAGE_PAD_X}px 100px` }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SkeletonGroupBuyRow />
            <SkeletonGroupBuyRow />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Users size={48} strokeWidth={1.5} />}
            title="불러오지 못했어요"
            description={error}
            actionLabel="홈으로"
            onAction={() => nav(ROUTES.HOME)}
          />
        ) : normalized.length === 0 ? (
          <EmptyState
            icon={<Users size={48} strokeWidth={1.5} />}
            title="참여한 공동구매가 없어요"
            description="필요한 물건을 함께 살 수 있는 공구를 찾아보세요."
            actionLabel="공구 둘러보기"
            onAction={() => nav(ROUTES.HOME)}
          />
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {normalized.map((p: any) => (
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
