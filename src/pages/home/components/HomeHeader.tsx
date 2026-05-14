import { useEffect, useRef } from "react";
import { ChevronDown, Search, Bell, Menu, X } from "lucide-react";

interface HomeHeaderProps {
  showSearch: boolean;
  searchQuery: string;
  unreadCount: number;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  onSearchChange: (q: string) => void;
  onNotificationOpen: () => void;
  onMenuOpen: () => void;
}

export default function HomeHeader({
  showSearch,
  searchQuery,
  unreadCount,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onNotificationOpen,
  onMenuOpen,
}: HomeHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        {!showSearch ? (
          <>
            <button
              type="button"
              className="flex items-center gap-0.5 text-[15px] font-semibold text-foreground"
            >
              명지대
              <ChevronDown className="size-4 text-muted-foreground" strokeWidth={2} />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onSearchOpen}
                className="flex size-10 items-center justify-center rounded-full text-muted-foreground"
                aria-label="검색"
              >
                <Search className="size-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={onNotificationOpen}
                className="relative flex size-10 items-center justify-center rounded-full text-muted-foreground"
                aria-label="알림"
              >
                <Bell className="size-5" strokeWidth={2} />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={onMenuOpen}
                className="flex size-10 items-center justify-center rounded-full text-muted-foreground"
                aria-label="메뉴"
              >
                <Menu className="size-5" strokeWidth={2} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-muted px-3 py-2">
              <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="공동구매 검색..."
                className="min-w-0 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="shrink-0 text-muted-foreground"
                  aria-label="검색어 지우기"
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onSearchClose}
              className="shrink-0 text-[14px] font-medium text-primary"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
