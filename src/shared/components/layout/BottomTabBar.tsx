import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, MessageSquareMore, User } from "lucide-react";

import { ROUTES } from "../../../app/router/routes";

interface BottomTabBarProps {
  className?: string;
}

const ICON_PX = 18;
const TAB_ACTIVE = "#3D5CFF";
const TAB_INACTIVE = "#8E94A3";
const ACTIVE_PILL_BG = "rgba(15, 23, 42, 0.06)";

type TabDef = {
  to: string;
  label: string;
  Icon: typeof Home;
};

const TABS: TabDef[] = [
  { to: ROUTES.HOME, label: "홈", Icon: Home },
  { to: ROUTES.CATEGORY, label: "카테고리", Icon: LayoutGrid },
  { to: ROUTES.CHAT, label: "채팅", Icon: MessageSquareMore },
  { to: ROUTES.MYPAGE, label: "마이페이지", Icon: User },
];

export default function BottomTabBar({ className }: BottomTabBarProps) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const handleTabClick = (to: string) => {
    if (pathname === to) return;
    nav(to);
    // 일부 환경에서 SPA 이동이 먹히지 않으면 전체 이동으로 보정
    window.setTimeout(() => {
      if (window.location.pathname !== to) {
        window.location.assign(to);
      }
    }, 0);
  };

  return (
    <div
      className={`pointer-events-auto fixed bottom-0 left-0 right-0 z-[100] mx-auto max-w-[430px] ${className ?? ""}`}
      style={{
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: "max(6px, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <nav
        className="pointer-events-auto flex w-full items-center justify-between rounded-full bg-white px-0.5 py-0.5"
        style={{
          borderRadius: 9999,
          minHeight: 40,
          border: "1px solid rgba(15, 23, 42, 0.07)",
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.05)",
        }}
        aria-label="하단 메뉴"
      >
        {TABS.map((tab) => {
          const { Icon, to, label } = tab;
          const isActive = pathname === to;
          return (
            <button
              key={to}
              type="button"
              onClick={() => handleTabClick(to)}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0 rounded-full py-1 no-underline transition-[color,background-color] duration-150"
              style={{
                color: isActive ? TAB_ACTIVE : TAB_INACTIVE,
                backgroundColor: isActive ? ACTIVE_PILL_BG : "transparent",
              }}
              aria-label={label}
            >
              <span
                className="flex items-center justify-center shrink-0"
                style={{ width: ICON_PX, height: ICON_PX }}
              >
                <Icon
                  size={ICON_PX}
                  strokeWidth={isActive ? 2.35 : 2}
                  fill="none"
                  color={isActive ? TAB_ACTIVE : TAB_INACTIVE}
                  aria-hidden
                />
              </span>
              <span
                className="max-w-full truncate px-0.5 text-center font-medium leading-none"
                style={{
                  fontSize: 9,
                  marginTop: 2,
                  letterSpacing: "-0.02em",
                  fontWeight: isActive ? 700 : 600,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
