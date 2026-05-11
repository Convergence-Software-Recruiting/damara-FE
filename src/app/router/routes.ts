export const ROUTES = {
  SPLASH: "/",
  LOGIN: "/login",
  SIGNUP: "/register",
  HOME: "/home",
  CHAT: "/chat",
  MYPAGE: "/profile",
  GROUP_BUY_CREATE: "/create",
  GROUP_BUY_DETAIL: "/post/:id",
  MY_CREATED: "/my-posts",
  MY_JOINED: "/participated",
  FAVORITES: "/favorites",
  TRUST_INFO: "/trust-info",
  SETTINGS: "/settings",
  FAQ: "/faq",
  CATEGORY: "/category",
} as const;

export const SHOW_BOTTOM_NAV_PATHS: string[] = [
  ROUTES.HOME,
  ROUTES.CATEGORY,
  ROUTES.CHAT,
  ROUTES.MYPAGE,
];
