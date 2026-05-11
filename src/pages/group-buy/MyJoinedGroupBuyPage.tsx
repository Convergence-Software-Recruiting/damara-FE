import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupBuyCard from "../../features/group-buy/components/GroupBuyCard";
import {
  getParticipatedPosts,
  getPostDetail,
} from "../../features/group-buy/api/groupBuyApi";
import { getImageUrl } from "../../shared/utils/imageUrl";
import { toast } from "sonner";
import {
  ExceptionStatusBadge,
  TradeMethodBadge,
} from "../../features/group-buy/components/TrustBadges";
import { getEnhancedData } from "../../features/group-buy/utils/enhancedPostMapper";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function MyJoinedGroupBuyPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipatedPosts = async () => {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) {
        setError("로그인이 필요합니다.");
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
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedPosts();
  }, []);

  return (
    <div data-page="참여한 공구">
      <p>참여한 공구</p>
    </div>
  );
}