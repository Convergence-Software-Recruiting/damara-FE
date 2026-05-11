import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../features/group-buy/api/groupBuyApi";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../../features/user/api/notificationApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

import HomeHeader from "./components/HomeHeader";
import HomeBanner from "./components/HomeBanner";
import HomeCategoryChips from "./components/HomeCategoryChips";
import HomePopularList from "./components/HomePopularList";
import HomeSortTabs, { type SortKey } from "./components/HomeSortTabs";
import HomePostList from "./components/HomePostList";
import TradeTypeSheet, { type TradeType } from "./components/TradeTypeSheet";
import HomeMenuModal from "./components/HomeMenuModal";
import HomeNotificationModal from "./components/HomeNotificationModal";

export default function HomePage() {
  const nav = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showTradeTypeSheet, setShowTradeTypeSheet] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("latest");

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID) || "";

  const filteredPosts = posts.filter((post) => {
    if (searchQuery === "") return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(q) ||
      post.content?.toLowerCase().includes(q) ||
      post.pickupLocation?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryParam =
          activeCategory === "all" ? undefined : activeCategory;
        const res = await getPosts(20, 0, categoryParam);
        setPosts(res.data);
      } catch (e) {
        setError("게시글을 불러올 수 없습니다.");
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory]);

  const fetchNotifications = async () => {
    if (!userId) return;
    setNotificationsLoading(true);
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error("알림 조회 실패:", e);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await getUnreadCount(userId);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error("읽지 않은 알림 개수 조회 실패:", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      await markAllAsRead(userId);
      fetchNotifications();
    } catch (e) {
      console.error("모든 알림 읽음 처리 실패:", e);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!userId) return;
    try {
      await markAsRead(notificationId, userId);
      fetchNotifications();
    } catch (e) {
      console.error("알림 읽음 처리 실패:", e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showNotificationModal) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotificationModal]);

  useEffect(() => {
    const handleOpenSheet = () => setShowTradeTypeSheet(true);
    window.addEventListener("openTradeTypeSheet", handleOpenSheet);
    return () => {
      window.removeEventListener("openTradeTypeSheet", handleOpenSheet);
    };
  }, []);

  const handleSelectTradeType = (type: TradeType) => {
    setShowTradeTypeSheet(false);
    nav(`/create?type=${type}`);
  };

  const handleLogout = () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    nav("/login");
  };

  return (
    <div data-page="홈">
      <p>홈</p>

      <TradeTypeSheet isOpen={showTradeTypeSheet} onClose={()=>setShowTradeTypeSheet(false)} onSelect={handleSelectTradeType} />
      <HomeMenuModal isOpen={showMenuModal} onClose={()=>setShowMenuModal(false)} onProfile={()=>{setShowMenuModal(false);nav("/profile");}} onSettings={()=>{setShowMenuModal(false);nav("/settings");}} onFaq={()=>{setShowMenuModal(false);nav("/faq");}} onLogout={()=>{setShowMenuModal(false);handleLogout();}} />
      <HomeNotificationModal isOpen={showNotificationModal} onClose={()=>setShowNotificationModal(false)} notifications={notifications} unreadCount={unreadCount} loading={notificationsLoading} onRead={handleMarkAsRead} onReadAll={handleMarkAllAsRead} />
      <button type="button" onClick={()=>setShowTradeTypeSheet(true)} aria-label="공구 등록" />
    </div>
  );
}