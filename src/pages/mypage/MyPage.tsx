import { useEffect, useMemo, useState } from "react";
import { Bell, BookOpenText, ChevronRight, Heart, LogOut, MessageCircle, Package, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ROUTES } from "../../app/router/routes";
import { getParticipatedPosts, getPostsByStudentId } from "../../features/group-buy/api/groupBuyApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

type UserLite = {
  id?: string;
  nickname?: string;
  studentId?: string;
};

type QuickCard = {
  title: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  Icon: typeof Package;
  onClick: () => void;
};

export default function MyPage() {
  const nav = useNavigate();
  const [user, setUser] = useState<UserLite | null>(null);
  const [myPostsCount, setMyPostsCount] = useState(0);
  const [participatedCount, setParticipatedCount] = useState(0);
  const [favoriteCount] = useState(12);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (user?.studentId) {
          const myPostsRes = await getPostsByStudentId(user.studentId);
          setMyPostsCount(myPostsRes.data?.length || 0);
        }
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        if (userId) {
          const joinedRes = await getParticipatedPosts(userId);
          setParticipatedCount(joinedRes.data?.length || 0);
        }
      } catch (err) {
        console.error("마이페이지 수치 조회 실패:", err);
      }
    };
    fetchCounts();
  }, [user?.studentId]);

  const handleLogout = () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    nav(ROUTES.LOGIN);
  };

  const quickCards: QuickCard[] = useMemo(
    () => [
      {
        title: "내가 등록한 공구",
        desc: "내가 올린 공구를\n확인해보세요",
        iconBg: "#f4f6ff",
        iconColor: "#3d5cff",
        Icon: Package,
        onClick: () => nav(ROUTES.MY_CREATED),
      },
      {
        title: "내가 참여한 공구",
        desc: "참여한 공구 내역을\n확인해보세요",
        iconBg: "#f4f6ff",
        iconColor: "#3d5cff",
        Icon: Users,
        onClick: () => nav(ROUTES.MY_JOINED),
      },
      {
        title: "관심목록",
        desc: "관심있는 공구를\n모아보세요",
        iconBg: "#fff5f5",
        iconColor: "#fa5252",
        Icon: Heart,
        onClick: () => nav(ROUTES.FAVORITES),
      },
      {
        title: "채팅",
        desc: "판매자 및 참여자와\n대화하세요",
        iconBg: "#f4f6ff",
        iconColor: "#3d5cff",
        Icon: MessageCircle,
        onClick: () => nav(ROUTES.CHAT),
      },
    ],
    [nav]
  );

  return (
    <div data-page="마이페이지" style={{ minHeight: "100dvh", backgroundColor: "#fff" }}>
      <header
        style={{
          height: 60,
          backgroundColor: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #f1f3f5",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 16, lineHeight: "24px", fontWeight: 700, color: "#212529" }}>마이페이지</h1>
      </header>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <section
          style={{
            backgroundColor: "#f8fbff",
            border: "1px solid #f1f3f5",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 20, display: "flex", gap: 16, minHeight: 124 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#e9ecef",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 28 }}>👤</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 20, lineHeight: "30px", fontWeight: 700, color: "#212529" }}>
                {user?.nickname || "사용자"}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: "18px", color: "#3d5cff", fontWeight: 700 }}>
                명지대 학생 인증 완료
              </p>
              <div
                style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  height: 26.5,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: "1px solid #e9ecef",
                  backgroundColor: "#fff",
                }}
              >
                <span aria-hidden>🎓</span>
                <span style={{ fontSize: 11, color: "#495057" }}>
                  매너 학점 <strong style={{ color: "#3d5cff" }}>4.5</strong>
                  <span style={{ color: "#adb5bd" }}>/ 4.5</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "#f1f3f5" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", height: 90 }}>
            {[
              { label: "등록한 공구", value: myPostsCount },
              { label: "참여한 공구", value: participatedCount },
              { label: "관심목록", value: favoriteCount },
            ].map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (i === 0) nav(ROUTES.MY_CREATED);
                  if (i === 1) nav(ROUTES.MY_JOINED);
                  if (i === 2) nav(ROUTES.FAVORITES);
                }}
                style={{
                  border: 0,
                  borderLeft: i === 0 ? "none" : "1px solid #f1f3f5",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 12, color: "#495057", lineHeight: "18px" }}>{item.label}</span>
                <strong style={{ fontSize: 24, lineHeight: "36px", color: "#3d5cff" }}>{item.value}</strong>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {quickCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={card.onClick}
              style={{
                border: "1px solid #f1f3f5",
                borderRadius: 16,
                backgroundColor: "#fff",
                height: 144.5,
                padding: 14,
                textAlign: "left",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: card.iconBg,
                  color: card.iconColor,
                }}
              >
                <card.Icon size={20} strokeWidth={2.1} />
              </span>
              <ChevronRight size={12} color="#adb5bd" style={{ position: "absolute", right: 14, top: 16 }} />
              <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: "19.5px", fontWeight: 700, color: "#212529" }}>{card.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, lineHeight: "16.5px", color: "#868e96", whiteSpace: "pre-line" }}>{card.desc}</p>
            </button>
          ))}
        </section>

        <section>
          <h2 style={{ margin: "0 0 8px", fontSize: 16, lineHeight: "24px", color: "#212529" }}>계정 및 서비스</h2>
          <div style={{ border: "1px solid #f1f3f5", borderRadius: 16, backgroundColor: "#fff", padding: "0 17px" }}>
            {[
              { label: "공지사항", Icon: Bell, onClick: () => toast.message("공지사항은 곧 연결됩니다.") },
              { label: "FAQ", Icon: BookOpenText, onClick: () => nav(ROUTES.FAQ) },
              { label: "설정", Icon: Settings, onClick: () => nav(ROUTES.SETTINGS) },
              { label: "로그아웃", Icon: LogOut, onClick: handleLogout },
            ].map((menu, i, arr) => (
              <button
                key={menu.label}
                type="button"
                onClick={menu.onClick}
                style={{
                  width: "100%",
                  height: i === arr.length - 1 ? 55 : 56,
                  border: 0,
                  borderBottom: i === arr.length - 1 ? "none" : "1px solid #f1f3f5",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <menu.Icon size={20} color="#495057" />
                <span style={{ flex: 1, textAlign: "left", fontSize: 14, lineHeight: "21px", color: "#212529", fontWeight: 500 }}>
                  {menu.label}
                </span>
                <ChevronRight size={14} color="#adb5bd" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}