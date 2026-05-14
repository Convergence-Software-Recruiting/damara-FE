import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CheckCheck,
  Clock3,
  Cookie,
  Droplets,
  MapPin,
  MessageCircle,
  MoreVertical,
  Package,
  Package2,
  Plus,
  SendHorizontal,
  Search,
  Store,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { damaraToast, damaraToastMessages } from "../../shared/lib/damaraToast";
import EmptyState from "../../shared/components/damara/EmptyState";
import {
  UI_BADGE_FS,
  UI_BADGE_FW,
  UI_BADGE_H,
  UI_BADGE_PAD_X,
  UI_PAGE_PAD_X,
  UI_R_BADGE,
  UI_R_THUMB,
  UI_SHADOW_SHEET,
} from "../../shared/constants/damaraUISystem";
import {
  BADGE_INFO_BG,
  BADGE_INFO_TEXT,
  BADGE_URGENT_BG,
  BADGE_URGENT_TEXT,
  blue50,
  blue500,
  blue600,
  BRAND_PRIMARY,
  green50,
  grey400,
  grey900,
  HOME_BORDER,
  HOME_CANVAS,
  HOME_CONTROL,
  HOME_CONTROL_TEXT,
  orange50,
  orange500,
  orange600,
  purple50,
  purple500,
  TEXT_META,
  TEXT_SUB,
  TEXT_TITLE,
  teal500,
  background,
} from "../../shared/constants/homeTheme";

type ChatFilter = "all" | "ongoing" | "unread";
type RoomStatus = "ongoing" | "closing" | "seller";

type ChatPreview = {
  id: number;
  title: string;
  status: RoomStatus;
  timeLabel: string;
  locationLabel: string;
  locationKind: "people" | "seller";
  preview: string;
  unreadCount: number;
  thumbType: "box" | "bar" | "snack" | "bottle" | "note" | "avatar";
};

type DetailMessage = {
  id: string;
  type: "seller" | "participant" | "me";
  senderLabel: string;
  subLabel: string;
  text: string;
  time: string;
};

const C_PRIMARY = BRAND_PRIMARY;
const C_TEXT_MAIN = TEXT_TITLE;
const C_TEXT_SUB = TEXT_SUB;
const C_TEXT_META = TEXT_META;
const C_TEXT_TIME = grey400;
const THUMB_TONES = [blue50, purple50, green50, orange50] as const;

const FILTERS: { id: ChatFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "ongoing", label: "진행중" },
  { id: "unread", label: "읽지 않음" },
];

const CHATS: ChatPreview[] = [
  { id: 1, title: "물티슈 공동구매", status: "ongoing", timeLabel: "오후 2:30", locationLabel: "명지대 정문앞", locationKind: "people", preview: "오늘 오후 5시까지 명지대 정문앞에서 픽업해요!", unreadCount: 2, thumbType: "box" },
  { id: 2, title: "닥터유 단백질바 박스공구", status: "ongoing", timeLabel: "오후 12:45", locationLabel: "학생회관 2층", locationKind: "people", preview: "입금 확인했습니다 :) 감사합니다!", unreadCount: 1, thumbType: "bar" },
  { id: 3, title: "프링글스 12개입 공구", status: "closing", timeLabel: "오전 11:20", locationLabel: "인문캠퍼스", locationKind: "people", preview: "오늘 자정에 마감돼요! 서두르세요 ⏰", unreadCount: 3, thumbType: "snack" },
  { id: 4, title: "샴푸 공동구매", status: "ongoing", timeLabel: "어제", locationLabel: "뷰티에 진심인 사람들", locationKind: "people", preview: "유진님이 참여하셨습니다.", unreadCount: 1, thumbType: "bottle" },
  { id: 5, title: "옥스퍼드 노트 구매하실분~", status: "ongoing", timeLabel: "어제", locationLabel: "명지대 문구덕후", locationKind: "people", preview: "내일(금) 오전에 학교에서 전달드릴게요!", unreadCount: 0, thumbType: "note" },
  { id: 6, title: "효진 판매자", status: "seller", timeLabel: "4일 전", locationLabel: "판매자", locationKind: "seller", preview: "안녕하세요! 문의주셔서 감사합니다 😊", unreadCount: 0, thumbType: "avatar" },
];

const DETAIL_MESSAGES: DetailMessage[] = [
  { id: "m1", type: "seller", senderLabel: "판매자", subLabel: "명지대 정문앞", text: "안녕하세요!", time: "오후 2:30" },
  { id: "m2", type: "seller", senderLabel: "판매자", subLabel: "명지대 정문앞", text: "오늘 오후 5시까지 명지대 정문앞에서 픽업 가능해요.", time: "오후 2:30" },
  { id: "m3", type: "me", senderLabel: "나", subLabel: "", text: "네 확인했습니다!", time: "오후 2:31" },
  { id: "m4", type: "me", senderLabel: "나", subLabel: "", text: "입금도 완료했어요.", time: "오후 2:31" },
  { id: "m5", type: "seller", senderLabel: "판매자", subLabel: "명지대 정문앞", text: "입금 확인됐습니다. 감사합니다 :)", time: "오후 2:32" },
  { id: "m6", type: "participant", senderLabel: "참여자", subLabel: "효진", text: "혹시 4시 반쯤 가도 될까요?", time: "오후 2:38" },
  { id: "m7", type: "seller", senderLabel: "판매자", subLabel: "명지대 정문앞", text: "네 가능합니다. 오시면 채팅 주세요.", time: "오후 2:38" },
  { id: "m8", type: "me", senderLabel: "나", subLabel: "", text: "저는 5시 전에 도착할게요.", time: "오후 2:39" },
];

function ChatBadge({ status }: { status: RoomStatus }) {
  if (status === "seller") return null;
  const isClosing = status === "closing";
  return (
    <span
      style={{
        height: UI_BADGE_H,
        padding: `0 ${UI_BADGE_PAD_X}px`,
        borderRadius: UI_R_BADGE,
        backgroundColor: isClosing ? BADGE_URGENT_BG : BADGE_INFO_BG,
        color: isClosing ? BADGE_URGENT_TEXT : BADGE_INFO_TEXT,
        fontSize: UI_BADGE_FS,
        fontWeight: UI_BADGE_FW,
        lineHeight: `${UI_BADGE_H}px`,
        whiteSpace: "nowrap",
      }}
    >
      {isClosing ? "마감임박" : "진행중"}
    </span>
  );
}

function ChatThumb({ type }: { type: ChatPreview["thumbType"] }) {
  const tone = (i: number) => THUMB_TONES[i % THUMB_TONES.length];
  const shell = (i: number, children: React.ReactNode) => (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 16,
        background: `linear-gradient(145deg, ${tone(i)} 0%, ${blue50} 100%)`,
        display: "grid",
        placeItems: "center",
        border: "1px solid rgba(229, 232, 235, 0.92)",
      }}
    >
      {children}
    </div>
  );
  if (type === "avatar") {
    return (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: blue50,
          display: "grid",
          placeItems: "center",
          border: "1px solid rgba(229, 232, 235, 0.92)",
        }}
      >
        <User size={26} color={blue600} strokeWidth={1.65} aria-hidden />
      </div>
    );
  }
  if (type === "box") return shell(0, <Package size={26} color={blue500} strokeWidth={1.65} aria-hidden />);
  if (type === "bar") return shell(1, <Cookie size={26} color={orange600} strokeWidth={1.6} aria-hidden />);
  if (type === "snack") return shell(2, <Package2 size={26} color={teal500} strokeWidth={1.65} aria-hidden />);
  if (type === "bottle") return shell(3, <Droplets size={26} color={blue600} strokeWidth={1.65} aria-hidden />);
  return shell(0, <BookOpen size={26} color={purple500} strokeWidth={1.65} aria-hidden />);
}

function OtherBubble({ msg }: { msg: DetailMessage }) {
  const avatar =
    msg.type === "participant" ? (
      <User size={17} color={HOME_CONTROL_TEXT} strokeWidth={1.85} aria-hidden />
    ) : (
      <Store size={16} color={C_PRIMARY} strokeWidth={2} aria-hidden />
    );
  return (
    <div style={{ display: "flex", gap: 9, padding: "7px 18px" }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 12,
          background: msg.type === "participant" ? "#fff" : blue50,
          border: "1px solid rgba(229, 232, 235, 0.92)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {avatar}
      </div>
      <div style={{ maxWidth: 286 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: C_TEXT_SUB, fontSize: 10.5, fontWeight: 800 }}>{msg.senderLabel}</span>
          <span style={{ color: C_TEXT_META, fontSize: 11 }}>{msg.subLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <div
            style={{
              backgroundColor: background,
              border: "1px solid rgba(229, 232, 235, 0.92)",
              borderRadius: "6px 17px 17px 17px",
              padding: "10px 13px",
              color: C_TEXT_MAIN,
              fontSize: 12.5,
              lineHeight: "19px",
              whiteSpace: "pre-line",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.035)",
            }}
          >
            {msg.text}
          </div>
          <span style={{ color: C_TEXT_TIME, fontSize: 10, lineHeight: "15px", whiteSpace: "nowrap" }}>{msg.time}</span>
        </div>
      </div>
    </div>
  );
}

function MyBubble({ msg }: { msg: DetailMessage }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: 268 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
          <span style={{ color: C_TEXT_TIME, fontSize: 10, lineHeight: "15px" }}>{msg.time}</span>
          <span style={{ display: "inline-flex", alignItems: "center", color: C_PRIMARY }}>
            <CheckCheck size={12} strokeWidth={2} />
          </span>
        </div>
        <div
          style={{
            background: `linear-gradient(135deg, ${C_PRIMARY} 0%, #5b9fff 100%)`,
            borderRadius: "17px 17px 6px 17px",
            padding: "10px 13px",
            color: background,
            fontSize: 12.5,
            lineHeight: "19px",
            whiteSpace: "pre-line",
            boxShadow: "0 6px 16px rgba(49, 130, 246, 0.2)",
          }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function ChatDetailOverlay({ chat, onClose }: { chat: ChatPreview; onClose: () => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, backgroundColor: HOME_CANVAS, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100dvh", backgroundColor: HOME_CANVAS, display: "flex", flexDirection: "column" }}>
        <header style={{ height: 56, backgroundColor: HOME_CANVAS, borderBottom: `1px solid rgba(229, 232, 235, 0.56)`, display: "flex", alignItems: "center", padding: `0 ${UI_PAGE_PAD_X}px`, gap: 8 }}>
          <button type="button" onClick={onClose} aria-label="뒤로가기" style={{ width: 36, height: 36, flexShrink: 0, border: 0, background: "transparent", borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ArrowLeft size={18} strokeWidth={2} color={grey900} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, color: grey900, fontSize: 16, lineHeight: "22px", fontWeight: 850, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title}</h1>
            <p style={{ margin: 0, color: C_TEXT_META, fontSize: 11, lineHeight: "16px", fontWeight: 600 }}>공동구매 채팅방</p>
          </div>
          <button type="button" onClick={() => toast.message("메뉴는 곧 연결돼요.")} aria-label="더보기" style={{ width: 36, height: 36, flexShrink: 0, border: 0, background: "transparent", borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <MoreVertical size={17} strokeWidth={2} color={C_TEXT_META} />
          </button>
        </header>

        <div style={{ padding: `12px ${UI_PAGE_PAD_X}px 2px` }}>
          <div
            style={{
              minHeight: 46,
              border: "1px solid rgba(229, 232, 235, 0.92)",
              background: "linear-gradient(135deg, #fff 0%, #f8fbff 100%)",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              gap: 8,
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.035)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
              <MapPin size={13} color={C_PRIMARY} strokeWidth={2} aria-hidden />
              <span style={{ fontSize: 11, color: C_TEXT_SUB, fontWeight: 500 }}>
                수령 <span style={{ color: C_TEXT_META, fontWeight: 600 }}>명지대 정문앞</span>
              </span>
            </div>
            <div style={{ width: 1, height: 18, backgroundColor: HOME_BORDER, flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
              <CalendarClock size={13} color={C_PRIMARY} strokeWidth={2} aria-hidden />
              <span style={{ fontSize: 11, color: C_TEXT_SUB, fontWeight: 500 }}>
                마감 <span style={{ color: C_TEXT_META, fontWeight: 600 }}>4월 17일 (수)</span>
              </span>
            </div>
            <span style={{ marginLeft: "auto", padding: "0 8px", height: 20, borderRadius: UI_R_BADGE, backgroundColor: BADGE_INFO_BG, color: BADGE_INFO_TEXT, fontSize: 10, lineHeight: "20px", fontWeight: UI_BADGE_FW, flexShrink: 0 }}>진행중</span>
          </div>
        </div>

        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: 8, paddingBottom: 18 }}>
          {DETAIL_MESSAGES.map((msg) => (msg.type === "me" ? <MyBubble key={msg.id} msg={msg} /> : <OtherBubble key={msg.id} msg={msg} />))}

          <div style={{ margin: `12px ${UI_PAGE_PAD_X}px 0`, borderRadius: 18, backgroundColor: blue50, border: "1px solid rgba(49, 130, 246, 0.1)", padding: "13px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: "20px", color: grey900, fontWeight: 800, letterSpacing: "-0.02em" }}>공구 참여가 확정됐어요</p>
            <p style={{ margin: "5px 0 0", fontSize: 12, lineHeight: "18px", color: TEXT_META }}>수령 시간과 장소를 채팅으로 확인해 주세요.</p>
          </div>

          <div style={{ margin: `12px ${UI_PAGE_PAD_X}px 0`, border: "1px solid rgba(229, 232, 235, 0.92)", borderRadius: 20, background: "linear-gradient(135deg, #fff 0%, #f8fbff 100%)", padding: "14px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.035)" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: 17, background: `linear-gradient(145deg, ${THUMB_TONES[0]} 0%, ${blue50} 100%)`, display: "grid", placeItems: "center", border: "1px solid rgba(229, 232, 235, 0.92)", flexShrink: 0 }}>
                <Package size={26} color={C_PRIMARY} strokeWidth={1.65} aria-hidden />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 14.5, lineHeight: "20px", color: grey900, fontWeight: 850, letterSpacing: "-0.02em" }}>물티슈 공동구매</strong>
                  <span style={{ height: 20, padding: "0 8px", borderRadius: UI_R_BADGE, backgroundColor: BADGE_INFO_BG, color: BADGE_INFO_TEXT, fontSize: 10, lineHeight: "20px", fontWeight: UI_BADGE_FW }}>진행중</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, color: C_TEXT_META, fontSize: 12 }}>
                  <MapPin size={12} strokeWidth={2} aria-hidden /> 명지대 정문앞
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, color: C_TEXT_META, fontSize: 12 }}>
                  <Clock3 size={12} strokeWidth={2} aria-hidden /> 픽업 <span style={{ color: C_TEXT_SUB, fontWeight: 600 }}>오늘 오후 5시까지</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span style={{ color: C_TEXT_META, fontSize: 12, whiteSpace: "nowrap" }}>
                    <Users size={12} style={{ marginRight: 3, verticalAlign: "middle" }} aria-hidden /> 참여 <span style={{ color: C_TEXT_SUB, fontWeight: 600 }}>3/10명</span>
                  </span>
                  <div style={{ flex: 1, height: 5, borderRadius: 999, backgroundColor: HOME_CONTROL, overflow: "hidden" }}>
                    <div style={{ width: "30%", height: "100%", backgroundColor: C_PRIMARY }} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => toast.message("수령 정보 보기 기능은 준비 중입니다.")} style={{ flex: 1, height: 34, borderRadius: 12, border: "1px solid rgba(229, 232, 235, 0.92)", background: "#fff", color: C_TEXT_SUB, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>수령 정보</button>
              <button type="button" onClick={() => toast.message("참여 내역 기능은 준비 중입니다.")} style={{ flex: 1, height: 34, borderRadius: 12, border: `1px solid ${blue50}`, background: blue50, color: C_PRIMARY, fontSize: 11.5, fontWeight: 800, cursor: "pointer" }}>참여 내역</button>
            </div>
          </div>
        </main>

        <footer style={{ minHeight: 66, padding: `10px ${UI_PAGE_PAD_X}px calc(10px + env(safe-area-inset-bottom, 0px))`, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(229, 232, 235, 0.72)", display: "flex", alignItems: "center", gap: 8, boxShadow: UI_SHADOW_SHEET }}>
          <button type="button" onClick={() => toast.message("첨부는 곧 연결돼요.")} style={{ width: 40, height: 40, borderRadius: 14, border: "1px solid rgba(229, 232, 235, 0.92)", background: background, display: "grid", placeItems: "center", cursor: "pointer" }} aria-label="첨부">
            <Plus size={20} color={C_TEXT_SUB} strokeWidth={2} />
          </button>
          <label style={{ flex: 1, height: 42, borderRadius: 16, border: "1px solid rgba(229, 232, 235, 0.92)", backgroundColor: "#f7f9fc", padding: "0 14px", display: "flex", alignItems: "center" }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="메시지를 입력해 주세요" className="placeholder:text-[#b0b8c1]" style={{ flex: 1, border: 0, outline: "none", background: "transparent", color: grey900, fontSize: 14, fontWeight: 500 }} />
          </label>
          <button type="button" onClick={() => { if (!draft.trim()) return; toast.success("메시지를 보냈어요."); setDraft(""); }} style={{ width: 42, height: 42, borderRadius: 16, border: 0, background: C_PRIMARY, color: background, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 6px 16px rgba(49, 130, 246, 0.22)" }} aria-label="전송">
            <SendHorizontal size={15} strokeWidth={2.1} />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function ChatListPage() {
  const routeLocation = useLocation();
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [openedChat, setOpenedChat] = useState<ChatPreview | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(routeLocation.search);
    const roomId = params.get("roomId");
    const postId = params.get("postId");
    const title = params.get("title");
    const locationLabel = params.get("location");

    if (!roomId && !postId && !title) return;

    const matchedChat =
      CHATS.find((chat) => String(chat.id) === String(roomId || postId)) ||
      CHATS.find((chat) => title && chat.title === title);
    const fallbackId = Number(roomId || postId);

    setOpenedChat(
      matchedChat ?? {
        id: Number.isFinite(fallbackId) ? fallbackId : Date.now(),
        title: title || "공동구매 채팅",
        status: "ongoing",
        timeLabel: "방금",
        locationLabel: locationLabel || "공동구매",
        locationKind: "people",
        preview: "공구 관련 대화를 시작해보세요.",
        unreadCount: 0,
        thumbType: "box",
      }
    );
  }, [routeLocation.search]);

  const visibleChats = useMemo(() => {
    if (filter === "all") return CHATS;
    if (filter === "unread") return CHATS.filter((chat) => chat.unreadCount > 0);
    return CHATS.filter((chat) => chat.status === "ongoing");
  }, [filter]);

  return (
    <div data-page="채팅" style={{ minHeight: "100dvh", width: "100%", backgroundColor: HOME_CANVAS, display: "flex", flexDirection: "column" }}>
      <header
        style={{
          height: 56,
          flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderBottom: `1px solid rgba(229, 232, 235, 0.62)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${UI_PAGE_PAD_X}px`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <h1
          style={{
            margin: 0,
            minWidth: 0,
            color: grey900,
            fontSize: 20,
            lineHeight: "28px",
            fontWeight: 850,
            letterSpacing: "-0.03em",
          }}
        >
          채팅
        </h1>
        <button
          type="button"
          aria-label="검색"
          onClick={() => toast.message("채팅 검색은 곧 연결돼요.")}
          style={{
            width: 34,
            height: 34,
            border: 0,
            background: background,
            borderRadius: 999,
            color: TEXT_META,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Search size={18} strokeWidth={2.1} color={TEXT_META} />
        </button>
      </header>

      <section style={{ flexShrink: 0, backgroundColor: HOME_CANVAS, display: "flex", alignItems: "center", gap: 7, padding: `10px ${UI_PAGE_PAD_X}px 12px`, boxSizing: "border-box" }}>
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              style={{
                height: 32,
                padding: "0 13px",
                borderRadius: UI_R_BADGE,
                border: active ? `1px solid ${blue50}` : `1px solid ${HOME_BORDER}`,
                backgroundColor: active ? blue50 : background,
                color: active ? C_PRIMARY : C_TEXT_META,
                fontSize: 12.5,
                fontWeight: active ? 800 : 600,
                lineHeight: "32px",
                boxShadow: "none",
                cursor: "pointer",
                transition: "background-color 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </section>

      <main style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "2px 0 96px" }}>
        {visibleChats.length === 0 ? (
          <EmptyState
            icon={<MessageCircle size={64} strokeWidth={1.25} />}
            title="채팅방이 없어요"
            description="공동구매에 참여하면 작성자·참여자와 여기서 대화할 수 있어요."
          />
        ) : (
          visibleChats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => {
                damaraToast.show(damaraToastMessages.chatRoomEntered);
                setOpenedChat(chat);
              }}
              className="transition-[transform,background-color] duration-150 ease-out active:scale-[0.98]"
              style={{
                width: `calc(100% - ${UI_PAGE_PAD_X * 2}px)`,
                margin: `0 ${UI_PAGE_PAD_X}px 10px`,
                minHeight: 78,
                border: "1px solid rgba(229, 232, 235, 0.92)",
                borderRadius: 18,
                background: "linear-gradient(135deg, #fff 0%, #f8fbff 100%)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.035)",
              }}
            >
              <ChatThumb type={chat.thumbType} />
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <strong
                    style={{
                      flex: 1,
                      minWidth: 0,
                      color: grey900,
                      fontSize: 14.5,
                      lineHeight: "20px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.title}
                  </strong>
                  <ChatBadge status={chat.status} />
                  <span style={{ color: C_TEXT_TIME, fontSize: 11, fontWeight: 500, lineHeight: "16px", whiteSpace: "nowrap", flexShrink: 0 }}>{chat.timeLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: C_TEXT_META, display: "grid", placeItems: "center" }} aria-hidden>
                    {chat.locationKind === "seller" ? <Store size={12} strokeWidth={2} /> : <Users size={12} strokeWidth={2} />}
                  </span>
                  <span style={{ color: C_TEXT_META, fontSize: 12, lineHeight: "17px", fontWeight: 500 }}>{chat.locationLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ margin: 0, flex: 1, minWidth: 0, color: C_TEXT_SUB, fontSize: 12.5, lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.preview}</p>
                  {chat.unreadCount > 0 ? (
                    <span
                      style={{
                        minWidth: 24,
                        height: UI_BADGE_H,
                        padding: `0 ${UI_BADGE_PAD_X}px`,
                        borderRadius: UI_R_BADGE,
                        background: blue50,
                        color: blue600,
                        fontSize: UI_BADGE_FS,
                        fontWeight: 700,
                        lineHeight: `${UI_BADGE_H}px`,
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {chat.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))
        )}
      </main>

      {openedChat ? <ChatDetailOverlay chat={openedChat} onClose={() => setOpenedChat(null)} /> : null}
    </div>
  );
}
