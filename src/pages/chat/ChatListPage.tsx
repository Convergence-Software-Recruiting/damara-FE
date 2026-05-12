import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCheck,
  ChevronRight,
  Clock3,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  SendHorizontal,
  Search,
  Store,
  Users,
} from "lucide-react";
import { toast } from "sonner";

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

const C_HEADER_BG = "#fafafa";
const C_TITLE = "#3d5cff";
const C_PRIMARY = "#3d5cff";
const C_FILTER_BORDER = "#e9ecef";
const C_ROW_BORDER = "#f1f3f5";
const C_TEXT_MAIN = "#212529";
const C_TEXT_SUB = "#495057";
const C_TEXT_META = "#868e96";
const C_TEXT_TIME = "#adb5bd";

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
    <span style={{ height: 19, padding: "0 7px", borderRadius: 999, backgroundColor: isClosing ? "#fff5f5" : "#e6fcf5", color: isClosing ? "#e03131" : "#0ca678", fontSize: 10, fontWeight: 700, lineHeight: "19px", whiteSpace: "nowrap" }}>
      {isClosing ? "마감임박" : "진행중"}
    </span>
  );
}

function ChatThumb({ type }: { type: ChatPreview["thumbType"] }) {
  if (type === "avatar") {
    return <div style={{ width: 56, height: 56, borderRadius: 28, background: "linear-gradient(145deg, #6a8bff 0%, #9fc3ff 100%)", display: "grid", placeItems: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>효</div>;
  }
  const base: React.CSSProperties = { width: 56, height: 56, borderRadius: 14, backgroundColor: "#f1f3f5", display: "grid", placeItems: "center" };
  if (type === "box") return <div style={base}><span style={{ fontSize: 28 }}>📦</span></div>;
  if (type === "bar") return <div style={base}><span style={{ fontSize: 24 }}>🍫</span></div>;
  if (type === "snack") return <div style={base}><span style={{ fontSize: 24 }}>🥫</span></div>;
  if (type === "bottle") return <div style={base}><span style={{ fontSize: 24 }}>🧴</span></div>;
  return <div style={base}><span style={{ fontSize: 24 }}>📒</span></div>;
}

function OtherBubble({ msg }: { msg: DetailMessage }) {
  const avatar = msg.type === "participant" ? "🙂" : "🛍️";
  return (
    <div style={{ display: "flex", gap: 8, padding: "6px 16px" }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#e9ecef", display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{avatar}</div>
      <div style={{ maxWidth: 292 }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: "#495057", fontSize: 11, fontWeight: 700 }}>{msg.senderLabel}</span>
          <span style={{ color: "#868e96", fontSize: 11 }}>{msg.subLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <div style={{ backgroundColor: "#fff", border: "1px solid #f1f3f5", borderRadius: "0 14px 14px 14px", padding: "10px 14px", color: "#212529", fontSize: 13, lineHeight: "19.5px", whiteSpace: "pre-line" }}>{msg.text}</div>
          <span style={{ color: "#adb5bd", fontSize: 11, lineHeight: "16.5px", whiteSpace: "nowrap" }}>{msg.time}</span>
        </div>
      </div>
    </div>
  );
}

function MyBubble({ msg }: { msg: DetailMessage }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, maxWidth: 260 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span style={{ color: "#adb5bd", fontSize: 11, lineHeight: "16.5px" }}>{msg.time}</span>
          <span style={{ display: "inline-flex", alignItems: "center", color: "#5c7cfa" }}><CheckCheck size={11} strokeWidth={2.3} /></span>
        </div>
        <div style={{ backgroundColor: "#3d5cff", borderRadius: "14px 14px 14px 0", padding: "10px 14px", color: "#fff", fontSize: 13, lineHeight: "19.5px", whiteSpace: "pre-line" }}>{msg.text}</div>
      </div>
    </div>
  );
}

function ChatDetailOverlay({ chat, onClose }: { chat: ChatPreview; onClose: () => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, backgroundColor: "#fafafa", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100dvh", backgroundColor: "#fafafa", display: "flex", flexDirection: "column" }}>
        <header style={{ height: 60, borderBottom: "1px solid #f1f3f5", backgroundColor: "#fafafa", display: "flex", alignItems: "center", padding: "0 16px" }}>
          <button type="button" onClick={onClose} aria-label="뒤로가기" style={{ width: 28, height: 28, border: 0, background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", marginRight: 8 }}>
            <ArrowLeft size={20} strokeWidth={2.3} color="#212529" />
          </button>
          <h1 style={{ margin: 0, flex: 1, textAlign: "center", color: "#212529", fontSize: 16, lineHeight: "24px", fontWeight: 700 }}>{chat.title}</h1>
          <button type="button" onClick={() => toast.message("메뉴 기능은 준비 중입니다.")} aria-label="더보기" style={{ width: 28, height: 28, border: 0, background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", marginLeft: 8 }}>
            <MoreVertical size={18} color="#212529" />
          </button>
        </header>

        <div style={{ padding: "10px 16px 0" }}>
          <div style={{ height: 46, border: "1px solid #f1f3f5", backgroundColor: "#fff", borderRadius: 22, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
              <MapPin size={12} color="#495057" />
              <span style={{ fontSize: 11, color: "#495057" }}>수령 장소 <span style={{ color: "#868e96" }}>명지대 정문앞</span></span>
            </div>
            <div style={{ width: 1, height: 18, backgroundColor: "#f1f3f5" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
              <CalendarClock size={12} color="#495057" />
              <span style={{ fontSize: 11, color: "#495057" }}>마감일 <span style={{ color: "#868e96" }}>4월 17일 (수)</span></span>
            </div>
            <span style={{ marginLeft: "auto", padding: "0 10px", height: 22.5, borderRadius: 999, backgroundColor: "#e6fcf5", color: "#0ca678", fontSize: 11, lineHeight: "22.5px", fontWeight: 700 }}>진행중</span>
          </div>
        </div>

        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: 4, paddingBottom: 16 }}>
          {DETAIL_MESSAGES.map((msg) => (msg.type === "me" ? <MyBubble key={msg.id} msg={msg} /> : <OtherBubble key={msg.id} msg={msg} />))}

          <div style={{ margin: "8px 16px 0", borderRadius: 14, backgroundColor: "#f4f6ff", padding: "16px 20px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, lineHeight: "19.5px", color: "#212529", fontWeight: 700 }}>공구 참여가 확정되었어요</p>
            <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: "16.5px", color: "#868e96" }}>안전한 거래를 위해 채팅 내용을 확인해 주세요.</p>
          </div>

          <div style={{ margin: "8px 16px 0", border: "1px solid #f1f3f5", borderRadius: 16, backgroundColor: "#fff", padding: "17px 17px 12px" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 68, height: 68, borderRadius: 12, backgroundColor: "#f1f3f5", display: "grid", placeItems: "center", fontSize: 26 }}>📦</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <strong style={{ fontSize: 14, lineHeight: "21px", color: "#212529" }}>물티슈 공동구매</strong>
                  <span style={{ height: 19, padding: "0 7px", borderRadius: 999, backgroundColor: "#e6fcf5", color: "#0ca678", fontSize: 10, lineHeight: "19px", fontWeight: 700 }}>진행중</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, color: "#868e96", fontSize: 12 }}><MapPin size={10} /> 명지대 정문앞</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, color: "#868e96", fontSize: 12 }}><Clock3 size={10} /> 픽업 시간 <span style={{ color: "#495057" }}>오늘 오후 5시까지</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <span style={{ color: "#868e96", fontSize: 12 }}><Users size={10} style={{ marginRight: 2 }} /> 참여 인원 <span style={{ color: "#495057" }}>3/10명</span></span>
                  <div style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: "#e9ecef", overflow: "hidden" }}><div style={{ width: "30%", height: "100%", backgroundColor: "#3d5cff" }} /></div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" onClick={() => toast.message("수령 정보 보기 기능은 준비 중입니다.")} style={{ flex: 1, height: 34.5, borderRadius: 8, border: "1px solid #e9ecef", background: "#fff", color: "#495057", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>수령 정보 보기</button>
              <button type="button" onClick={() => toast.message("참여 내역 기능은 준비 중입니다.")} style={{ flex: 1, height: 34.5, borderRadius: 8, border: "1px solid #3d5cff", background: "#fff", color: "#3d5cff", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>참여 내역</button>
            </div>
          </div>
        </main>

        <footer style={{ height: 65, borderTop: "1px solid #f1f3f5", background: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <button type="button" onClick={() => toast.message("첨부 기능은 준비 중입니다.")} style={{ width: 36, height: 36, borderRadius: 18, border: 0, background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} aria-label="첨부">
            <Plus size={20} color="#495057" />
          </button>
          <label style={{ flex: 1, height: 44, borderRadius: 999, border: "1px solid #e9ecef", backgroundColor: "#f4f6ff", padding: "0 17px", display: "flex", alignItems: "center" }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="메시지를 입력하세요" style={{ flex: 1, border: 0, outline: "none", background: "transparent", color: "#212529", fontSize: 14 }} />
          </label>
          <button type="button" onClick={() => { if (!draft.trim()) return; toast.success("메시지를 전송했어요."); setDraft(""); }} style={{ width: 36, height: 36, borderRadius: 18, border: 0, backgroundColor: "#3d5cff", boxShadow: "0 2px 4px rgba(61,92,255,0.3)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }} aria-label="전송">
            <SendHorizontal size={14} />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function ChatListPage() {
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [openedChat, setOpenedChat] = useState<ChatPreview | null>(null);

  const visibleChats = useMemo(() => {
    if (filter === "all") return CHATS;
    if (filter === "unread") return CHATS.filter((chat) => chat.unreadCount > 0);
    return CHATS.filter((chat) => chat.status === "ongoing");
  }, [filter]);

  return (
    <div data-page="채팅" style={{ minHeight: "100dvh", width: "100%", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <header style={{ height: 60, flexShrink: 0, backgroundColor: C_HEADER_BG, borderBottom: `1px solid ${C_ROW_BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <h1 style={{ margin: 0, color: C_TITLE, fontSize: 24, lineHeight: "36px", fontWeight: 800, letterSpacing: "-0.03em" }}>채팅</h1>
        <button type="button" aria-label="검색" onClick={() => toast.message("채팅 검색 기능은 곧 연결됩니다.")} style={{ width: 26, height: 26, border: 0, background: "transparent", color: "#111", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <Search size={18} strokeWidth={2} />
        </button>
      </header>

      <section style={{ height: 55.5, flexShrink: 0, backgroundColor: C_HEADER_BG, borderBottom: `1px solid ${C_ROW_BORDER}`, display: "flex", alignItems: "center", gap: 8, padding: "10px 20px 12px", boxSizing: "border-box" }}>
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} style={{ height: active ? 31.5 : 33.5, padding: "0 14px", borderRadius: 999, border: active ? "1px solid transparent" : `1px solid ${C_FILTER_BORDER}`, backgroundColor: active ? C_PRIMARY : "#fff", color: active ? "#fff" : C_TEXT_META, fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: "19.5px", boxShadow: active ? "0 2px 4px rgba(61,92,255,0.28)" : "none", cursor: "pointer" }}>
              {item.label}
            </button>
          );
        })}
      </section>

      <main style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {visibleChats.map((chat) => (
          <button key={chat.id} type="button" onClick={() => setOpenedChat(chat)} style={{ width: "100%", height: chat.unreadCount > 0 ? 89.5 : 88, border: 0, borderBottom: `1px solid ${C_ROW_BORDER}`, background: "#fff", display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 15px", textAlign: "left", cursor: "pointer" }}>
            <ChatThumb type={chat.thumbType} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ color: C_TEXT_MAIN, fontSize: 14, lineHeight: "21px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 170 }}>{chat.title}</strong>
                <ChatBadge status={chat.status} />
                <span style={{ marginLeft: "auto", color: C_TEXT_TIME, fontSize: 11, lineHeight: "16.5px", whiteSpace: "nowrap" }}>{chat.timeLabel}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C_TEXT_META, display: "grid", placeItems: "center" }} aria-hidden>{chat.locationKind === "seller" ? <Store size={11} /> : <Users size={11} strokeWidth={2.4} />}</span>
                <span style={{ color: C_TEXT_META, fontSize: 11, lineHeight: "16.5px" }}>{chat.locationLabel}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <p style={{ margin: 0, flex: 1, minWidth: 0, color: C_TEXT_SUB, fontSize: 11, lineHeight: "16.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.preview}</p>
                {chat.unreadCount > 0 ? <span style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: C_PRIMARY, color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: "18px", textAlign: "center", flexShrink: 0 }}>{chat.unreadCount}</span> : null}
              </div>
            </div>
          </button>
        ))}
      </main>

      {openedChat ? <ChatDetailOverlay chat={openedChat} onClose={() => setOpenedChat(null)} /> : null}
    </div>
  );
}
