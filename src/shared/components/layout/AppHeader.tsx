import React from "react";
import { Bell, ChevronDown, Landmark, Menu, Search } from "lucide-react";
import { toast } from "sonner";

import { APP_HEADER_BG, HOME_BORDER } from "../../constants/homeTheme";
import { APP_HEADER_HEIGHT_PX } from "./appShellConstants";

const BRAND_BLUE = "#3D5CFF";
const ICON_INK = "#111827";

export default function AppHeader() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 mx-auto max-w-[430px]"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        backgroundColor: APP_HEADER_BG,
        borderTop: `1px solid ${HOME_BORDER}`,
        borderBottom: `1px solid ${HOME_BORDER}`,
      }}
    >
      <div
        className="flex items-center justify-between px-4"
        style={{ height: APP_HEADER_HEIGHT_PX }}
      >
        <button
          type="button"
          className="flex min-w-0 items-center gap-1.5 rounded-lg py-1 pr-1"
          style={{
            margin: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: BRAND_BLUE,
          }}
          onClick={() => toast.message("캠퍼스 선택은 곧 연결됩니다.")}
          aria-label="캠퍼스 선택, 명지대"
        >
          <Landmark className="size-[22px] shrink-0" strokeWidth={2} aria-hidden />
          <span
            className="truncate text-[17px] leading-none"
            style={{ fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            명지대
          </span>
          <ChevronDown className="size-[18px] shrink-0 opacity-90" strokeWidth={2.25} aria-hidden />
        </button>

        <div className="flex shrink-0 items-center" style={{ gap: 2 }}>
          <button
            type="button"
            aria-label="검색"
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ color: ICON_INK }}
            onClick={() => toast.message("검색은 곧 연결됩니다.")}
          >
            <Search className="size-[22px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="알림"
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ color: ICON_INK }}
            onClick={() => toast.message("알림은 곧 연결됩니다.")}
          >
            <Bell className="size-[22px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="메뉴"
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ color: ICON_INK }}
            onClick={() => toast.message("메뉴는 곧 연결됩니다.")}
          >
            <Menu className="size-[22px]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
