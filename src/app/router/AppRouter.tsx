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
import AppHeader from "../../shared/components/layout/AppHeader";
import { APP_HEADER_HEIGHT_PX, APP_TAB_BAR_HEIGHT_PX } from "../../shared/components/layout/appShellConstants";

import { ROUTES, SHOW_APP_CHROME_PATHS, SHOW_BOTTOM_NAV_PATHS, normalizeAppPath } from "./routes";

export default function AppRouter() {
  const { pathname } = useLocation();
  const pathKey = normalizeAppPath(pathname);
  const showBottomNav = SHOW_BOTTOM_NAV_PATHS.includes(pathKey);
  const showAppChrome = SHOW_APP_CHROME_PATHS.includes(pathKey);

  const contentPaddingTop = showAppChrome
    ? `calc(${APP_HEADER_HEIGHT_PX}px + env(safe-area-inset-top, 0px))`
    : 0;
  const contentPaddingBottom = showBottomNav
    ? `calc(${APP_TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom, 0px))`
    : 0;

  return (
    <MobileLayout>
      {showAppChrome && <AppHeader />}
      <div
        className="w-full box-border"
        style={{
          paddingTop: contentPaddingTop,
          paddingBottom: contentPaddingBottom,
        }}
      >
        <Routes>
          <Route path={ROUTES.SPLASH} element={<SplashPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
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
        </Routes>
      </div>

      {showBottomNav && <BottomTabBar />}
    </MobileLayout>
  );
}
