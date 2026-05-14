import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Heart,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Store,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  addFavorite,
  cancelParticipation,
  checkFavorite,
  checkParticipation,
  getPostDetail,
  participatePost,
  removeFavorite,
} from "../../features/group-buy/api/groupBuyApi";
import { getChatRoomByPostId } from "../../features/chat/api/chatApi";
import { readFavoriteFlag } from "../../features/group-buy/utils/favoriteResponse";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import {
  background,
  blue50,
  blue500,
  blue600,
  green50,
  green600,
  grey50,
  grey100,
  grey200,
  grey300,
  grey400,
  grey500,
  grey600,
  grey700,
  grey800,
  grey900,
} from "../../shared/constants/homeTheme";
import { getImageUrl } from "../../shared/utils/imageUrl";

const fallbackPost = {
  title: "물티슈 공동구매",
  price: 5900,
  category: "생활용품",
  pickupLocation: "명지대 정문앞",
  deadline: "4월 17일(수)",
  pickupDate: "4월 19일(금) 오후",
  currentQuantity: 1,
  minParticipants: 3,
  content:
    "도톰한 엠보싱 원단으로 부드럽고 촉촉해요.\n100매 대용량으로 온 가족이 넉넉하게 사용 가능!\n캡지퍼 장착이라서 간편하게 수령하세요.",
};

const page: React.CSSProperties = {
  minHeight: "100dvh",
  background,
  color: grey900,
  paddingBottom: 76,
};

const card: React.CSSProperties = {
  margin: "8px 12px 0",
  border: `1px solid ${grey200}`,
  borderRadius: 12,
  background,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(2, 32, 71, 0.04)",
};

function formatPrice(value: unknown) {
  return `${Math.floor(Number(value ?? 0)).toLocaleString()}원`;
}

function formatDeadline(value: unknown) {
  if (!value) return fallbackPost.deadline;
  const text = String(value);
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

export default function GroupBuyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  const [post, setPost] = useState<any>(fallbackPost);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getPostDetail(id);
        setPost({ ...fallbackPost, ...res.data });
      } catch (err) {
        console.error(err);
        setPost(fallbackPost);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  useEffect(() => {
    if (!id || !currentUserId) return;
    checkParticipation(id, currentUserId)
      .then((res) => setIsParticipant(Boolean(res.data?.isParticipant)))
      .catch(() => undefined);
    checkFavorite(id, currentUserId)
      .then((res) => setIsFavorite(readFavoriteFlag(res.data)))
      .catch(() => undefined);
  }, [id, currentUserId]);

  const imageUrls = useMemo(
    () =>
      (post?.images ?? [])
        .map((img: any) => getImageUrl(img?.imageUrl || img?.url || img))
        .filter(Boolean),
    [post?.images]
  );

  const title = post?.title || fallbackPost.title;
  const price = post?.price ?? fallbackPost.price;
  const category = post?.category || fallbackPost.category;
  const location = post?.pickupLocation || fallbackPost.pickupLocation;
  const deadline = formatDeadline(post?.deadline || fallbackPost.deadline);
  const pickupDate = post?.pickupDate || fallbackPost.pickupDate;
  const current = Number(post?.currentQuantity ?? fallbackPost.currentQuantity);
  const min = Number(post?.minParticipants ?? fallbackPost.minParticipants);
  const progress = Math.min(100, Math.round((current / Math.max(min, 1)) * 100));
  const content = post?.content || fallbackPost.content;

  const handleFavorite = async () => {
    if (!id || !currentUserId) {
      toast.error("로그인이 필요해요.");
      return;
    }
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) await addFavorite(id, currentUserId);
      else await removeFavorite(id, currentUserId);
    } catch {
      setIsFavorite(!next);
      toast.error("관심 처리에 실패했어요.");
    }
  };

  const handleChat = async () => {
    if (!id || !currentUserId) {
      toast.error("로그인이 필요해요.");
      return;
    }
    try {
      const res = await getChatRoomByPostId(id);
      const roomId = res.data?.id || res.data?.chatRoomId;
      const params = new URLSearchParams({
        postId: id,
        title,
        location,
      });
      if (roomId) params.set("roomId", String(roomId));
      nav(`/chat?${params.toString()}`);
    } catch {
      const params = new URLSearchParams({
        postId: id,
        title,
        location,
      });
      nav(`/chat?${params.toString()}`);
    }
  };

  const handleParticipate = async () => {
    if (!id || !currentUserId) {
      toast.error("로그인이 필요해요.");
      return;
    }
    try {
      setBusy(true);
      if (isParticipant) {
        await cancelParticipation(id, currentUserId);
        setIsParticipant(false);
        setPost((prev: any) => ({ ...prev, currentQuantity: Math.max(Number(prev.currentQuantity ?? 1) - 1, 0) }));
        toast.success("참여를 취소했어요.");
      } else {
        await participatePost(id, currentUserId);
        setIsParticipant(true);
        setPost((prev: any) => ({ ...prev, currentQuantity: Number(prev.currentQuantity ?? 0) + 1 }));
        toast.success("공구에 참여했어요.");
      }
    } catch {
      toast.error("처리에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-page="공구 상세" style={page}>
      <header
        style={{
          height: 46,
          display: "grid",
          gridTemplateColumns: "36px 1fr 36px",
          alignItems: "center",
          padding: "0 12px",
          background,
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <button type="button" aria-label="뒤로가기" onClick={() => nav(-1)} style={iconButtonStyle}>
          <ChevronLeft size={24} strokeWidth={2.1} color="#111827" aria-hidden />
        </button>
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 15.5, lineHeight: "22px", fontWeight: 850 }}>공구 상세</h1>
        <button type="button" aria-label="관심 등록" onClick={handleFavorite} style={iconButtonStyle}>
          <Heart size={23} strokeWidth={2.2} color="#111827" fill={isFavorite ? "#111827" : "none"} aria-hidden />
        </button>
      </header>

      {loading ? null : (
        <>
          <section style={card}>
            <div
              style={{
                position: "relative",
                height: 150,
                background: "linear-gradient(145deg, #eef6ff 0%, #f7fbff 100%)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: 10,
                  borderRadius: 999,
                  padding: "5px 9px",
                  background: "linear-gradient(135deg, #35c46f 0%, #20a95a 100%)",
                  color: "#fff",
                  fontSize: 10.5,
                  fontWeight: 850,
                  zIndex: 2,
                }}
              >
                모집중
              </span>
              {imageUrls[0] ? (
                <img src={imageUrls[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ProductMock />
              )}
              <div style={{ position: "absolute", bottom: 14, display: "flex", gap: 10 }}>
                {[0, 1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    style={{
                  width: 6,
                  height: 6,
                      borderRadius: 999,
                      background: dot === 0 ? blue500 : grey300,
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ padding: "11px 12px 12px" }}>
              <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 900, lineHeight: "23px", letterSpacing: 0 }}>{title}</h2>
              <div style={{ marginTop: 4, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 6 }}>
                <p style={{ margin: 0, color: blue600, fontSize: 19, fontWeight: 900, lineHeight: "25px" }}>{formatPrice(price)}</p>
                <div style={{ display: "flex", gap: 7 }}>
                  <Pill icon={<Store size={13} />} label={category} />
                  <span style={{ borderRadius: 10, padding: "6px 8px", background: blue50, color: "#1e3a8a", fontSize: 10, fontWeight: 800 }}>
                    인기
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section style={{ ...card, padding: "11px 12px", display: "grid", gap: 10 }}>
            <InfoRow icon={<MapPin />} label="수령 장소" value={location} />
            <InfoRow icon={<CalendarDays />} label="마감일" value={deadline} />
            <div style={{ display: "grid", gridTemplateColumns: "94px 1fr", alignItems: "center", gap: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#435185", fontSize: 11, fontWeight: 700 }}>
                <Users size={16} />
                <span>모집 인원</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ color: grey900, fontSize: 11.5, fontWeight: 650, whiteSpace: "nowrap" }}>
                  {min}명 중 {current}명
                </span>
                <div style={{ height: 5, flex: 1, borderRadius: 999, background: grey200, overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: blue500 }} />
                </div>
                <strong style={{ color: blue600, fontSize: 11.5 }}>{progress}%</strong>
              </div>
            </div>
            <InfoRow icon={<Clock />} label="예상 수령일" value={pickupDate} />
          </section>

          <section style={{ ...card, padding: 11 }}>
            <div style={{ display: "grid", gridTemplateColumns: "42px 1fr 76px", gap: 8, alignItems: "center" }}>
              <Avatar />
              <div>
                <h3 style={{ margin: 0, fontSize: 14, lineHeight: "19px", fontWeight: 900 }}>판매자 정보</h3>
                <p style={{ margin: "4px 0 0", color: grey700, fontSize: 10 }}>응답&nbsp; <b style={{ color: grey900 }}>10분 이내</b></p>
                <p style={{ margin: "3px 0 0", color: grey700, fontSize: 10 }}>완료율&nbsp; <b style={{ color: grey900 }}>98%</b></p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                  {["꼼꼼해요", "친절해요", "약속시간 잘 지켜요"].map((tag) => (
                    <span key={tag} style={{ borderRadius: 999, padding: "3px 5px", background: blue50, color: blue600, fontSize: 8.5, fontWeight: 800 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ border: `1px solid ${grey200}`, borderRadius: 9, background: "linear-gradient(135deg, #f4f7ff, #ffffff)", padding: "7px 5px", textAlign: "center" }}>
                <GraduationCap size={15} color={blue600} fill="rgba(49,130,246,0.12)" />
                <p style={{ margin: "1px 0 0", color: blue600, fontSize: 9, fontWeight: 850 }}>매너 학생</p>
                <p style={{ margin: "3px 0 0", color: blue600, fontSize: 17, fontWeight: 900 }}>4.3 <span style={{ fontSize: 10 }}>/ 4.5</span></p>
                <p style={{ margin: "1px 0 0", color: blue600, fontSize: 9 }}>상위 23%</p>
              </div>
            </div>
          </section>

          <section style={{ ...card, padding: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 12.5, fontWeight: 900 }}>참여자 <span style={{ color: blue600 }}>2</span>명</h3>
              <button type="button" style={{ border: 0, borderRadius: 7, padding: "5px 7px", background: blue50, color: grey800, fontSize: 9.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 2 }}>
                참여 현황 보기 <ChevronRight size={16} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 9 }}>
              <ParticipantCard name="참여자 1" score="4.1" />
              <ParticipantCard name="참여자 2" score="4.3" />
            </div>
          </section>

          <section style={{ ...card, padding: 11, position: "relative", minHeight: 82 }}>
            <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 900 }}>상품 소개</h3>
            <p style={{ margin: "6px 76px 0 0", color: grey700, whiteSpace: "pre-wrap", fontSize: 10, lineHeight: "15px" }}>{content}</p>
            <div style={{ position: "absolute", right: 11, bottom: 10, width: 58, height: 39 }}>
              <MiniPack />
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, margin: "8px 12px 0" }}>
            <NoticeCard title="수령 안내" icon={<Store size={28} />} lines={["수령 장소: 명지대 정문앞", "수령 기간: 4월 19일(금) ~ 4월 20일(토)", "수령 시간: 오후 12시 ~ 오후 6시", "기간 내 미수령 시 자동 취소될 수 있어요."]} />
            <NoticeCard title="거래 유의사항" icon={<LockKeyhole size={27} />} lines={["안전한 거래를 위해 취소는 마감 전까지만 가능해요.", "공동구매 특성상, 마감 후 취소 시 참여가 제한될 수 있어요.", "문제 발생 시 채팅으로 문의주세요."]} />
          </div>
        </>
      )}

      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          padding: "8px 12px max(8px, env(safe-area-inset-bottom, 0px))",
          display: "grid",
          gridTemplateColumns: "96px 1fr",
          gap: 7,
          background: "rgba(255,255,255,0.96)",
          borderTop: `1px solid ${grey200}`,
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={handleChat}
          style={{ height: 42, borderRadius: 8, border: `1.5px solid ${blue500}`, background: "#fff", color: blue600, fontSize: 13, fontWeight: 850, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <MessageCircle size={22} />
          채팅
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={handleParticipate}
          style={{ height: 42, borderRadius: 8, border: 0, background: blue500, color: "#fff", fontSize: 13, fontWeight: 850, opacity: busy ? 0.64 : 1 }}
        >
          {isParticipant ? "참여취소" : "참여하기"}
        </button>
      </div>
    </div>
  );
}

const iconButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: 0,
  background: "transparent",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

function ProductMock() {
  return (
    <div style={{ position: "relative", width: "84%", height: "78%" }}>
      <Pack style={{ left: "5%", top: "18%", transform: "scale(.95)" }} />
      <Pack style={{ right: "4%", top: "24%", transform: "scale(.85)" }} />
      <Pack style={{ left: "25%", top: "45%", transform: "scale(1.18)" }} />
    </div>
  );
}

function Pack({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 190, height: 82, borderRadius: "20px 20px 26px 26px", background: "#fff", boxShadow: "0 12px 28px rgba(30,64,175,.12)", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: -8, top: -8, width: 78, height: 100, background: "#9bd38c", transform: "rotate(18deg)" }} />
      <div style={{ position: "absolute", right: -10, bottom: -16, width: 96, height: 52, borderRadius: "50%", background: "#9bd38c" }} />
      <div style={{ position: "absolute", left: 54, top: 18, right: 54, height: 34, borderRadius: 999, border: `1px solid ${grey200}`, background: "#fff", display: "grid", placeItems: "center", color: grey400, fontSize: 13, fontWeight: 800 }}>DAMARA</div>
    </div>
  );
}

function MiniPack() {
  return (
    <div style={{ transform: "scale(.55)", transformOrigin: "top left" }}>
      <Pack style={{ left: 0, top: 0 }} />
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${grey200}`, borderRadius: 10, padding: "5px 7px", color: grey800, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>
      {icon}
      {label}
    </span>
  );
}

function InfoRow({ icon, label, value, compact }: { icon: React.ReactElement; label: string; value: string; compact?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "94px 1fr", alignItems: "center", gap: 7 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#435185", fontSize: 11, fontWeight: 700 }}>
        {icon}
        <span>{label}</span>
      </div>
      <p style={{ margin: compact ? "4px 0 0 26px" : 0, color: grey900, fontSize: 11.8, fontWeight: 650 }}>{value}</p>
    </div>
  );
}

function Avatar() {
  return (
    <div style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg,#e8f0ff,#f7fbff)", display: "grid", placeItems: "center" }}>
      <Users size={22} color={blue500} fill="rgba(49,130,246,0.16)" />
    </div>
  );
}

function ParticipantCard({ name, score }: { name: string; score: string }) {
  return (
    <div style={{ border: `1px solid ${grey200}`, borderRadius: 9, padding: "7px 8px", display: "grid", gridTemplateColumns: "28px 1fr 30px", gap: 6, alignItems: "center" }}>
      <AvatarSmall />
      <span style={{ color: grey900, fontSize: 10, fontWeight: 650 }}>{name}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 2, color: "#33436f", fontSize: 9.5, fontWeight: 750 }}>
        <GraduationCap size={10} fill="rgba(51,67,111,0.12)" />
        {score}
      </span>
    </div>
  );
}

function AvatarSmall() {
  return (
    <span style={{ width: 28, height: 28, borderRadius: 999, background: "linear-gradient(135deg,#e8f0ff,#f7fbff)", display: "grid", placeItems: "center" }}>
      <Users size={16} color={blue500} fill="rgba(49,130,246,0.16)" />
    </span>
  );
}

function NoticeCard({ title, lines, icon }: { title: string; lines: string[]; icon: React.ReactNode }) {
  return (
    <section style={{ border: `1px solid ${grey200}`, borderRadius: 10, padding: 10, minHeight: 82, position: "relative", background }}>
      <h3 style={{ margin: 0, color: grey900, fontSize: 12, fontWeight: 900 }}>{title}</h3>
      <div style={{ position: "absolute", right: 12, top: 12, color: "#435185", transform: "scale(.72)", transformOrigin: "top right" }}>{icon}</div>
      <ul style={{ margin: "7px 0 0", paddingLeft: 11, color: grey700, fontSize: 9, lineHeight: "13.5px" }}>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
