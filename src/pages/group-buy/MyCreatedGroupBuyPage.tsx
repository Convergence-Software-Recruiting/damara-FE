import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupBuyCard from "../../features/group-buy/components/GroupBuyCard";
import { getPostsByStudentId } from "../../features/group-buy/api/groupBuyApi";
import { toast } from "sonner";
import {
  ExceptionStatusBadge,
  TradeMethodBadge,
} from "../../features/group-buy/components/TrustBadges";
import { getEnhancedData } from "../../features/group-buy/utils/enhancedPostMapper";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function MyCreatedGroupBuyPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (!storedUser) {
        setError("로그인이 필요합니다.");
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
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div data-page="나의 공구">
      <p>나의 공구</p>
    </div>
  );
}