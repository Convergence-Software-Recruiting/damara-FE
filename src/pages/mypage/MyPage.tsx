import { useEffect, useMemo, useState } from "react";
import type React from "react";
import {
  Bell,
  BookOpenText,
  ChevronRight,
  Heart,
  LogOut,
  MessageCircle,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  UserMinus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../app/router/routes";
import {
  getFavoritePosts,
  getParticipatedPosts,
  getPostsByStudentId,
} from "../../features/group-buy/api/groupBuyApi";
import {
  BADGE_TRUST_BG,
  BADGE_TRUST_TEXT,
  BRAND_PRIMARY,
  BRAND_PRIMARY_TEXT,
  DANGER,
  DANGER_BG,
  HOME_BORDER,
  HOME_CANVAS,
  TEXT_BODY,
  TEXT_META,
  TEXT_TITLE,
  blue50,
  grey100,
  grey200,
  grey400,
  grey500,
  grey600,
  grey900,
  teal50,
  teal600,
} from "../../shared/constants/homeTheme";
import { UI_PAGE_PAD_X, UI_TRANSITION } from "../../shared/constants/damaraUISystem";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

type UserLite = {
  id?: string;
  nickname?: string;
  studentId?: string;
  department?: string;
};

type CountKey = "created" | "joined" | "favorites";

type QuickAction = {
  title: string;
  desc: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
};

type ServiceItem = {
  title: string;
  desc: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  route: string;
  danger?: boolean;
};

const cardBase: React.CSSProperties = {
  border: `1px solid ${HOME_BORDER}`,
  borderRadius: 16,
  backgroundColor: "#fff",
  boxShadow: "0 4px 18px rgba(2, 32, 71, 0.045)",
};

function StatSkeleton() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 34,
        height: 20,
        borderRadius: 7,
        background: "linear-gradient(90deg, #f2f4f6 0%, #ffffff 50%, #f2f4f6 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export default function MyPage() {
  const nav = useNavigate();
  const [user, setUser] = useState<UserLite | null>(null);
  const [counts, setCounts] = useState<Record<CountKey, number>>({
    created: 0,
    joined: 0,
    favorites: 0,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!storedUser) return;

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      setCountsLoading(true);

      try {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        const [createdRes, joinedRes, favoriteRes] = await Promise.allSettled([
          user?.studentId ? getPostsByStudentId(user.studentId) : Promise.resolve({ data: [] }),
          userId ? getParticipatedPosts(userId) : Promise.resolve({ data: [] }),
          userId ? getFavoritePosts(userId) : Promise.resolve({ data: [] }),
        ]);

        setCounts({
          created: createdRes.status === "fulfilled" ? createdRes.value.data?.length || 0 : 0,
          joined: joinedRes.status === "fulfilled" ? joinedRes.value.data?.length || 0 : 0,
          favorites: favoriteRes.status === "fulfilled" ? favoriteRes.value.data?.length || 0 : 0,
        });
      } finally {
        setCountsLoading(false);
      }
    };

    fetchCounts();
  }, [user?.studentId]);

  const nickname = user?.nickname || "사용자";
  const studentId = user?.studentId || "학번 정보 없음";

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        title: "내가 올린 공구",
        desc: "작성한 모집글 관리",
        Icon: Package,
        iconBg: blue50,
        iconColor: BRAND_PRIMARY_TEXT,
        onClick: () => nav(ROUTES.MY_CREATED),
      },
      {
        title: "참여한 공구",
        desc: "진행 중인 거래 확인",
        Icon: Users,
        iconBg: teal50,
        iconColor: teal600,
        onClick: () => nav(ROUTES.MY_JOINED),
      },
      {
        title: "관심목록",
        desc: "찜한 공구 모아보기",
        Icon: Heart,
        iconBg: DANGER_BG,
        iconColor: DANGER,
        onClick: () => nav(ROUTES.FAVORITES),
      },
      {
        title: "채팅",
        desc: "거래 대화 이어가기",
        Icon: MessageCircle,
        iconBg: grey100,
        iconColor: BRAND_PRIMARY_TEXT,
        onClick: () => nav(ROUTES.CHAT),
      },
    ],
    [nav]
  );

  const serviceItems: ServiceItem[] = [
    {
      title: "공지사항",
      desc: "서비스 소식 확인",
      Icon: Bell,
      iconBg: blue50,
      iconColor: BRAND_PRIMARY_TEXT,
      route: ROUTES.NOTICE,
    },
    {
      title: "FAQ",
      desc: "자주 묻는 질문",
      Icon: BookOpenText,
      iconBg: grey100,
      iconColor: grey600,
      route: ROUTES.FAQ,
    },
    {
      title: "설정",
      desc: "알림과 앱 환경 관리",
      Icon: Settings,
      iconBg: grey100,
      iconColor: grey600,
      route: ROUTES.SETTINGS,
    },
    {
      title: "회원 탈퇴",
      desc: "계정과 연결 기록 삭제",
      Icon: UserMinus,
      iconBg: DANGER_BG,
      iconColor: DANGER,
      route: ROUTES.WITHDRAW,
      danger: true,
    },
    {
      title: "로그아웃",
      desc: "이 기기에서 계정 연결 해제",
      Icon: LogOut,
      iconBg: DANGER_BG,
      iconColor: DANGER,
      route: ROUTES.LOGOUT,
      danger: true,
    },
  ];

  return (
    <div data-page="마이페이지" style={{ minHeight: "100dvh", backgroundColor: HOME_CANVAS }}>
      <header
        style={{
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${UI_PAGE_PAD_X}px`,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderBottom: `1px solid rgba(229, 232, 235, 0.72)`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, color: TEXT_TITLE, fontSize: 19, fontWeight: 850, lineHeight: "27px", letterSpacing: 0 }}>
          마이페이지
        </h1>
        <button type="button" aria-label="설정" onClick={() => nav(ROUTES.SETTINGS)} style={headerIconButton}>
          <Settings size={17} strokeWidth={2.1} aria-hidden />
        </button>
      </header>

      <main style={{ padding: `14px ${UI_PAGE_PAD_X}px 96px`, display: "flex", flexDirection: "column", gap: 12 }}>
        <section
          style={{
            ...cardBase,
            overflow: "hidden",
            borderRadius: 18,
            border: "1px solid rgba(49, 130, 246, 0.12)",
            background: "linear-gradient(145deg, #ffffff 0%, #f7fbff 52%, #eef6ff 100%)",
          }}
        >
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={avatarStyle}>
                <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{nickname.slice(0, 1).toUpperCase()}</span>
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={verifiedBadgeStyle}>
                  <ShieldCheck size={13} strokeWidth={2.2} aria-hidden />
                  명지인 인증 완료
                </div>
                <h2 style={profileNameStyle}>{nickname}</h2>
                <p style={{ margin: "2px 0 0", color: TEXT_META, fontSize: 12, fontWeight: 650, lineHeight: "18px" }}>
                  {studentId}
                </p>
              </div>
            </div>

            <div style={mannerBoxStyle}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, color: TEXT_TITLE, fontSize: 13, fontWeight: 850, lineHeight: "18px" }}>
                  매너 점수 4.5
                  <span style={{ color: grey400, fontWeight: 750 }}> / 4.5</span>
                </p>
                <p style={{ margin: "3px 0 0", color: TEXT_BODY, fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>
                  신뢰도 좋은 거래 파트너예요
                </p>
              </div>
              <Sparkles size={20} color={BRAND_PRIMARY_TEXT} strokeWidth={2.1} aria-hidden />
            </div>
          </div>
        </section>

        <section style={{ ...cardBase, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", overflow: "hidden", borderRadius: 14 }}>
          {[
            { label: "등록 공구", value: counts.created, route: ROUTES.MY_CREATED },
            { label: "참여 공구", value: counts.joined, route: ROUTES.MY_JOINED },
            { label: "관심목록", value: counts.favorites, route: ROUTES.FAVORITES },
          ].map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => nav(item.route)}
              style={{
                minHeight: 70,
                border: 0,
                borderLeft: index === 0 ? "none" : `1px solid ${HOME_BORDER}`,
                backgroundColor: "#fff",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span style={{ color: grey500, fontSize: 11, fontWeight: 700, lineHeight: "16px" }}>{item.label}</span>
              <strong style={{ color: TEXT_TITLE, fontSize: 18, fontWeight: 900, lineHeight: "24px" }}>
                {countsLoading ? <StatSkeleton /> : item.value}
              </strong>
            </button>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {quickActions.map(({ title, desc, Icon, iconBg, iconColor, onClick }) => (
            <button key={title} type="button" onClick={onClick} style={quickCardStyle}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ ...quickIconStyle, backgroundColor: iconBg, color: iconColor }}>
                  <Icon size={17} strokeWidth={2.15} aria-hidden />
                </span>
                <ChevronRight size={15} color={grey400} strokeWidth={2.1} aria-hidden />
              </span>
              <span>
                <span style={{ display: "block", color: TEXT_TITLE, fontSize: 14, fontWeight: 850, lineHeight: "20px" }}>
                  {title}
                </span>
                <span style={{ display: "block", marginTop: 3, color: TEXT_META, fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>
                  {desc}
                </span>
              </span>
            </button>
          ))}
        </section>

        <button type="button" onClick={() => nav(ROUTES.TRUST_INFO)} style={trustBannerStyle}>
          <span style={trustIconStyle}>
            <ShieldCheck size={18} strokeWidth={2.15} aria-hidden />
          </span>
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: "block", color: TEXT_TITLE, fontSize: 13, fontWeight: 850, lineHeight: "19px" }}>
              안전거래 프로필
            </span>
            <span style={{ display: "block", marginTop: 2, color: TEXT_BODY, fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>
              인증 정보와 거래 신뢰도를 관리해요
            </span>
          </span>
          <span style={bluePillStyle}>보기</span>
        </button>

        <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h2 style={sectionTitleStyle}>계정 및 서비스</h2>
          <div style={servicePanelStyle}>
            {serviceItems.map((item, index) => (
              <ServiceRow
                key={item.title}
                item={item}
                showDivider={index !== serviceItems.length - 1}
                onClick={() => nav(item.route)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ServiceRow({ item, showDivider, onClick }: { item: ServiceItem; showDivider: boolean; onClick: () => void }) {
  const { Icon } = item;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 58,
        padding: "11px 14px",
        border: 0,
        borderBottom: showDivider ? `1px solid ${grey200}` : 0,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ ...serviceIconStyle, backgroundColor: item.iconBg, color: item.iconColor }}>
        <Icon size={18} strokeWidth={2.1} aria-hidden />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            color: item.danger ? DANGER : grey900,
            fontSize: 13,
            lineHeight: "18px",
            fontWeight: 850,
          }}
        >
          {item.title}
        </span>
        <span style={{ display: "block", marginTop: 2, color: grey500, fontSize: 11, lineHeight: "16px", fontWeight: 600 }}>
          {item.desc}
        </span>
      </span>
      <ChevronRight size={15} color={grey400} strokeWidth={2.1} aria-hidden />
    </button>
  );
}

const headerIconButton: React.CSSProperties = {
  width: 34,
  height: 34,
  border: `1px solid ${HOME_BORDER}`,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  color: grey600,
  backgroundColor: "#fff",
  cursor: "pointer",
};

const avatarStyle: React.CSSProperties = {
  width: 62,
  height: 62,
  borderRadius: 20,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  color: BRAND_PRIMARY_TEXT,
  background: `linear-gradient(135deg, ${blue50} 0%, #ffffff 100%)`,
  border: "1px solid rgba(49, 130, 246, 0.12)",
  boxShadow: "0 10px 22px rgba(2, 32, 71, 0.07)",
};

const verifiedBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  minHeight: 24,
  padding: "0 9px",
  borderRadius: 999,
  color: BADGE_TRUST_TEXT,
  backgroundColor: BADGE_TRUST_BG,
  fontSize: 11,
  fontWeight: 800,
};

const profileNameStyle: React.CSSProperties = {
  margin: "9px 0 0",
  color: grey900,
  fontSize: 22,
  fontWeight: 900,
  lineHeight: "29px",
  letterSpacing: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const mannerBoxStyle: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 13px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.82)",
  backgroundColor: "rgba(255,255,255,0.82)",
};

const quickCardStyle: React.CSSProperties = {
  ...cardBase,
  minHeight: 104,
  padding: 14,
  textAlign: "left",
  cursor: "pointer",
  transition: UI_TRANSITION,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const quickIconStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 11,
  display: "grid",
  placeItems: "center",
};

const trustBannerStyle: React.CSSProperties = {
  ...cardBase,
  width: "100%",
  border: "1px solid rgba(49, 130, 246, 0.14)",
  borderRadius: 16,
  padding: "14px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: `linear-gradient(135deg, ${blue50} 0%, #ffffff 100%)`,
  cursor: "pointer",
  textAlign: "left",
};

const trustIconStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  color: BRAND_PRIMARY_TEXT,
  background: "rgba(49, 130, 246, 0.10)",
  flexShrink: 0,
};

const bluePillStyle: React.CSSProperties = {
  borderRadius: 999,
  minWidth: 50,
  height: 30,
  padding: "0 12px",
  color: "#fff",
  background: BRAND_PRIMARY,
  fontSize: 12,
  fontWeight: 850,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 18px rgba(49, 130, 246, 0.16)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "4px 2px 0",
  color: TEXT_TITLE,
  fontSize: 13,
  fontWeight: 900,
  lineHeight: "19px",
  letterSpacing: 0,
};

const servicePanelStyle: React.CSSProperties = {
  ...cardBase,
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid rgba(49, 130, 246, 0.08)",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.045)",
};

const serviceIconStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 11,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
};
