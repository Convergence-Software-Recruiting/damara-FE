import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import GroupBuyCard from "../../features/group-buy/components/GroupBuyCard";
import { getPostsByStudentId } from "../../features/group-buy/api/groupBuyApi";
import { mapApiPostToGroupBuyCard } from "../../features/group-buy/utils/postToCardProps";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import { HOME_BORDER, HOME_CANVAS } from "../../shared/constants/homeTheme";
import { UI_PAGE_PAD_X, UI_SECTION_GAP, UI_T_HEADER_TITLE } from "../../shared/constants/damaraUISystem";
import { ROUTES } from "../../app/router/routes";
import EmptyState from "../../shared/components/damara/EmptyState";
import { SkeletonGroupBuyRow } from "../../shared/components/damara/Skeleton";

export default function MyCreatedGroupBuyPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (!storedUser) {
        setError("로그인이 필요해요.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      try {
        setLoading(true);
        const res = await getPostsByStudentId(user.studentId);
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("목록을 불러올 수 없어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div data-page="나의 공구" style={{ minHeight: "100dvh", backgroundColor: HOME_CANVAS }}>
      <header
        style={{
          height: 56,
          padding: `12px ${UI_PAGE_PAD_X}px`,
          borderBottom: `1px solid ${HOME_BORDER}`,
          backgroundColor: HOME_CANVAS,
        }}
      >
        <h1 style={{ margin: 0, fontSize: UI_T_HEADER_TITLE.size, fontWeight: UI_T_HEADER_TITLE.weight, color: "#191f28" }}>
          등록한 공동구매
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
            icon={<Package size={48} strokeWidth={1.5} />}
            title="불러오지 못했어요"
            description={error}
            actionLabel="홈으로"
            onAction={() => nav(ROUTES.HOME)}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Package size={48} strokeWidth={1.5} />}
            title="등록한 공동구매가 없어요"
            description="같이 살 상품 정보를 알려주고 참여자를 모아보세요."
            actionLabel="공구 열기"
            onAction={() => nav(ROUTES.GROUP_BUY_CREATE)}
          />
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((p: any) => (
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
