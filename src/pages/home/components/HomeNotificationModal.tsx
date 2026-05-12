import { X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  content?: string;
  isRead?: boolean;
  createdAt?: string;
}

interface HomeNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  onRead: (id: string) => void;
  onReadAll: () => void;
}

export default function HomeNotificationModal({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  loading,
  onRead,
  onReadAll,
}: HomeNotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="알림" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>알림</h3>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X aria-hidden />
          </button>
        </header>

        <div>
          {loading ? (
            <div data-state="loading">불러오는 중...</div>
          ) : notifications.length === 0 ? (
            <div data-state="empty">알림이 없습니다.</div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  data-unread={!n.isRead}
                  onClick={() => !n.isRead && onRead(n.id)}
                >
                  
                  <div>
                    <div>
                      <span>{n.title}</span>
                      {!n.isRead && <span data-badge="new">NEW</span>}
                    </div>
                    <p>{n.message || n.content}</p>
                    <p>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString("ko-KR")
                        : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer>
          <button
            type="button"
            onClick={onReadAll}
            disabled={unreadCount === 0}
          >
            모두 읽음으로 표시 {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </footer>
      </div>
    </div>
  );
}
