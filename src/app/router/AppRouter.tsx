import { Routes, Route, useLocation } from "react-router-dom";

import SplashPage from "../../pages/splash/SplashPage";
import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import HomePage from "../../pages/home/HomePage";
import ChatListPage from "../../pages/chat/ChatListPage";
import MyPage from "../../pages/mypage/MyPage";
import GroupBuyCreatePage from "../../pages/group-buy/GroupBuyCreatePage";
import GroupBuyDetailPage from "../../pages/group-buy/GroupBuyDetailPage";
import MyCreatedGroupBuyPage from "../../pages/group-buy/MyCreatedGroupBuyPage";
import MyJoinedGroupBuyPage from "../../pages/group-buy/MyJoinedGroupBuyPage";
import FavoriteGroupBuyPage from "../../pages/group-buy/FavoriteGroupBuyPage";
import TrustInfoPage from "../../pages/mypage/TrustInfoPage";
import SettingsPage from "../../pages/mypage/SettingsPage";
import FAQPage from "../../pages/mypage/FAQPage";
import CategoryPage from "../../pages/category/CategoryPage";

import MobileLayout from "../../shared/components/layout/MobileLayout";
import BottomTabBar from "../../shared/components/layout/BottomTabBar";

import { ROUTES, SHOW_BOTTOM_NAV_PATHS } from "./routes";

export default function AppRouter() {
  const { pathname } = useLocation();
  const showBottomNav = SHOW_BOTTOM_NAV_PATHS.includes(pathname);

  return (
    <MobileLayout>
      <Routes>
        <Route path={ROUTES.SPLASH} element={<SplashPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CHAT} element={<ChatListPage />} />
        <Route path={ROUTES.MYPAGE} element={<MyPage />} />
        <Route path={ROUTES.GROUP_BUY_CREATE} element={<GroupBuyCreatePage />} />
        <Route path={ROUTES.GROUP_BUY_DETAIL} element={<GroupBuyDetailPage />} />
        <Route path={ROUTES.MY_CREATED} element={<MyCreatedGroupBuyPage />} />
        <Route path={ROUTES.MY_JOINED} element={<MyJoinedGroupBuyPage />} />
        <Route path={ROUTES.FAVORITES} element={<FavoriteGroupBuyPage />} />
        <Route path={ROUTES.TRUST_INFO} element={<TrustInfoPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path={ROUTES.FAQ} element={<FAQPage />} />
        <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
      </Routes>

      {showBottomNav && <BottomTabBar />}
    </MobileLayout>
  );
}
