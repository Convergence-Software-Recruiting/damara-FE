import { useEffect, useRef } from "react";

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
    <header>
      <div className="flex items-center justify-between">
        {!showSearch ? (
          <>
            <button type="button" className="flex items-center gap-1">
              
              <span>명지대</span>
              
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSearchOpen}
                aria-label="검색"
              >
                
              </button>
              <button
                type="button"
                onClick={onNotificationOpen}
                aria-label="알림"
              >
                
                {unreadCount > 0 && (
                  <span data-badge="unread">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              <button type="button" onClick={onMenuOpen} aria-label="메뉴">
                
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 flex items-center gap-2">
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="공동구매 검색..."
                className="flex-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="검색어 지우기"
                >
                  <X aria-hidden />
                </button>
              )}
            </div>
            <button type="button" onClick={onSearchClose}>
              취소
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
