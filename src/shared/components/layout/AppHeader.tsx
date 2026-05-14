import React from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { toast } from "sonner";

import { grey400, grey500, grey900, HOME_CANVAS } from "../../constants/homeTheme";
import { APP_HEADER_HEIGHT_PX } from "./appShellConstants";

export default function AppHeader() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 mx-auto max-w-[430px]"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        backgroundColor: HOME_CANVAS,
        borderBottom: "1px solid rgba(229, 232, 235, 0.45)",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ height: APP_HEADER_HEIGHT_PX, paddingLeft: 18, paddingRight: 18 }}
      >
        <button
          type="button"
          className="flex min-w-0 items-center gap-1.5 rounded-xl py-1 pr-1"
          style={{
            margin: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: grey900,
          }}
          onClick={() => toast.message("캠퍼스 선택은 곧 연결됩니다.")}
          aria-label="캠퍼스 선택, 명지대"
        >
          <span
            className="truncate text-[18px] leading-none"
            style={{ fontWeight: 850, letterSpacing: "-0.025em", color: grey900 }}
          >
            명지대
          </span>
          <ChevronDown className="size-[16px] shrink-0" color={grey400} strokeWidth={2.35} aria-hidden />
        </button>

        <div className="flex shrink-0 items-center" style={{ gap: 3 }}>
          <button
            type="button"
            aria-label="검색"
            className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
            style={{ color: grey500, backgroundColor: "transparent" }}
            onClick={() => toast.message("검색은 곧 연결됩니다.")}
          >
            <Search className="size-[21px]" strokeWidth={2.15} />
          </button>
          <button
            type="button"
            aria-label="알림"
            className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
            style={{ color: grey500, backgroundColor: "transparent" }}
            onClick={() => toast.message("알림은 곧 연결됩니다.")}
          >
            <Bell className="size-[21px]" strokeWidth={2.15} />
          </button>
          <button
            type="button"
            aria-label="메뉴"
            className="flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
            style={{ color: grey500, backgroundColor: "transparent" }}
            onClick={() => toast.message("메뉴는 곧 연결됩니다.")}
          >
            <Menu className="size-[22px]" strokeWidth={2.15} />
          </button>
        </div>
      </div>
    </header>
  );
}
