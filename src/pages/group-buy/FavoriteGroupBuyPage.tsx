import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupBuyCard from "../../features/group-buy/components/GroupBuyCard";
import { getFavoritePosts } from "../../features/group-buy/api/groupBuyApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function FavoriteGroupBuyPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) {
        setError("로그인이 필요합니다.");
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
          setError("관심목록을 불러올 수 없습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, []);

  return (
    <div data-page="관심목록">
      <p>관심목록</p>
    </div>
  );
}