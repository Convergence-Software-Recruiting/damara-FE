import { Home, LayoutGrid, MessageSquareMore, Plus, User, type LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/router/routes";
import { blue50, BRAND_PRIMARY, grey500 } from "../../constants/homeTheme";
import { UI_IX_BUTTON, UI_IX_HOVER_GREY50 } from "../../constants/damaraUISystem";

interface BottomTabBarProps {
  className?: string;
  onCreateClick?: () => void;
}

const ICON_PX = 16;
const TAB_ACTIVE = BRAND_PRIMARY;
const TAB_INACTIVE = grey500;

type TabDef = {
  to: string;
  label: string;
  Icon: LucideIcon;
};

const LEFT_TABS: TabDef[] = [
  { to: ROUTES.HOME, label: "홈", Icon: Home },
  { to: ROUTES.CATEGORY, label: "카테고리", Icon: LayoutGrid },
];

const RIGHT_TABS: TabDef[] = [
  { to: ROUTES.CHAT, label: "채팅", Icon: MessageSquareMore },
  { to: ROUTES.MYPAGE, label: "마이페이지", Icon: User },
];

export default function BottomTabBar({ className, onCreateClick }: BottomTabBarProps) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const handleTabClick = (to: string) => {
    if (pathname === to) return;
    nav(to);
    window.setTimeout(() => {
      if (window.location.pathname !== to) {
        window.location.assign(to);
      }
    }, 0);
  };

  const renderTab = ({ Icon, to, label }: TabDef) => {
    const isActive = pathname === to;

    return (
      <button
        key={to}
        type="button"
        onClick={() => handleTabClick(to)}
        className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0 rounded-full py-1.5 no-underline ${
          isActive ? UI_IX_BUTTON : `${UI_IX_BUTTON} ${UI_IX_HOVER_GREY50}`
        }`}
        style={{
          color: isActive ? TAB_ACTIVE : TAB_INACTIVE,
          backgroundColor: isActive ? blue50 : "transparent",
        }}
        aria-label={label}
      >
        <span className="flex shrink-0 items-center justify-center" style={{ width: ICON_PX, height: ICON_PX }}>
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
            fontSize: 8,
            marginTop: 2,
            letterSpacing: 0,
            fontWeight: isActive ? 700 : 600,
          }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`pointer-events-auto fixed bottom-0 left-0 right-0 z-[100] mx-auto max-w-[430px] ${className ?? ""}`}
      style={{
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 14,
        paddingBottom: "max(6px, env(safe-area-inset-bottom, 0px))",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <nav
        className="pointer-events-auto flex w-full items-center justify-between rounded-full bg-white px-1 py-1"
        style={{
          borderRadius: 9999,
          minHeight: 46,
          border: "1px solid rgba(49, 130, 246, 0.10)",
          boxShadow: "0 8px 24px rgba(49, 130, 246, 0.10), 0 2px 6px rgba(15, 23, 42, 0.05)",
        }}
        aria-label="하단 메뉴"
      >
        {LEFT_TABS.map(renderTab)}

        <button
          type="button"
          aria-label="공구 등록"
          onClick={onCreateClick}
          className={UI_IX_BUTTON}
          style={{
            width: 50,
            height: 50,
            margin: "-16px 8px 0",
            border: 0,
            borderRadius: 9999,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: "#ffffff",
            background: `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #2272eb 100%)`,
            boxShadow: "0 10px 22px rgba(49, 130, 246, 0.30)",
            cursor: "pointer",
          }}
        >
          <Plus size={24} strokeWidth={2.7} aria-hidden />
        </button>

        {RIGHT_TABS.map(renderTab)}
      </nav>
    </div>
  );
}
