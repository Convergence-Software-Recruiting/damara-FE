import React, { useMemo, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createPost } from "../../features/group-buy/api/groupBuyApi";
import { uploadImage } from "../../shared/api/uploadApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import {
  background,
  blue50,
  blue500,
  blue600,
  grey50,
  grey100,
  grey200,
  grey300,
  grey400,
  grey500,
  grey600,
  grey800,
  grey900,
  teal50,
} from "../../shared/constants/homeTheme";
import { getImageUrl } from "../../shared/utils/imageUrl";

type TradeType = "PRE_RECRUIT" | "POST_PURCHASE";

const CATEGORIES = ["생활용품", "먹거리", "뷰티·패션", "학용품"];
const TAGS = ["생활용품", "인기예상"];

const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background,
  color: grey900,
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  height: 56,
  display: "grid",
  gridTemplateColumns: "44px 1fr 44px",
  alignItems: "center",
  padding: "0 8px",
  flexShrink: 0,
};

const inputCard: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${grey200}`,
  borderRadius: 12,
  background: background,
  padding: "14px 16px",
  minHeight: 64,
  boxSizing: "border-box",
};

const ctaWrap: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: 0,
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: 430,
  padding: "22px 20px max(22px, env(safe-area-inset-bottom, 0px))",
  borderTop: `1px solid ${grey200}`,
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 -8px 24px rgba(2, 32, 71, 0.05)",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "100px 1fr",
  gap: 10,
};

function onlyDigits(value: string) {
  return value.replace(/[^\d]/g, "");
}

function money(value: string) {
  const digits = onlyDigits(value);
  return digits ? Number(digits).toLocaleString() : "";
}

export default function GroupBuyCreatePage() {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<{ preview: string; url: string }[]>([]);
  const [productName, setProductName] = useState("도톰 엠보싱 물티슈 100매 10팩");
  const [title, setTitle] = useState("물티슈 공동구매");
  const [tradeType, setTradeType] = useState<TradeType>("PRE_RECRUIT");
  const [category, setCategory] = useState("생활용품");
  const [price, setPrice] = useState("5900");
  const [people, setPeople] = useState("3");
  const [currentPeople, setCurrentPeople] = useState("1");
  const [maxQuantity, setMaxQuantity] = useState("10");
  const [paymentMethod, setPaymentMethod] = useState("목표 인원 달성 후 결제");
  const [location, setLocation] = useState("명지대 정문앞");
  const [pickupDate, setPickupDate] = useState("4월 17일 (수)");
  const [deadline, setDeadline] = useState("4월 15일 (월)");
  const [pickupTime, setPickupTime] = useState("오후 12시 ~ 오후 6시");
  const [description, setDescription] = useState(
    "도톰한 엠보싱 원단의 물티슈 공동구매입니다.\n학교 앞에서 수령 가능하며, 모집 완료 시 개별 채팅으로 안내드려요.\n관심 있으신 분들은 참여해주세요!"
  );
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => Array.from({ length: 5 }, (_, i) => i < step), [step]);

  const canGoNext = () => {
    if (step === 1) return productName.trim() && title.trim();
    if (step === 2) return tradeType && category;
    if (step === 3) return price && people;
    if (step === 4) return location.trim() && deadline.trim() && pickupDate.trim();
    return true;
  };

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - images.length);
    if (files.length === 0) return;

    for (const file of files) {
      const preview = URL.createObjectURL(file);
      const tempIndex = images.length;
      setImages((prev) => [...prev, { preview, url: "" }]);

      try {
        setLoading(true);
        const res = await uploadImage(file);
        const imageUrl = getImageUrl(res.url);
        setImages((prev) => prev.map((img, i) => (i === tempIndex ? { ...img, url: imageUrl } : img)));
      } catch (err) {
        console.error("이미지 업로드 오류:", err);
        toast.error("이미지 업로드에 실패했어요.");
        setImages((prev) => prev.filter((_, i) => i !== tempIndex));
      } finally {
        setLoading(false);
      }
    }

    e.target.value = "";
  };

  const handleNext = () => {
    if (!canGoNext()) {
      toast.error("필수 정보를 입력해 주세요.");
      return;
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      toast.error("로그인이 필요해요.");
      nav("/login");
      return;
    }

    try {
      setLoading(true);
      await createPost({
        title,
        content: description || title,
        price: Number(onlyDigits(price)),
        minParticipants: Number(onlyDigits(people)),
        deadline,
        pickupLocation: location,
        authorId: userId,
        images: images.map((img) => img.url).filter(Boolean),
        category,
      });

      toast.success("공구가 등록되었어요.");
      nav("/home");
    } catch (err) {
      console.error(err);
      toast.error("공구 등록에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      return;
    }
    nav(-1);
  };

  return (
    <div data-page="공구 등록" style={pageStyle}>
      <header style={headerStyle}>
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={goBack}
          style={{ width: 38, height: 38, border: 0, background: "transparent", display: "grid", placeItems: "center" }}
        >
          <ChevronLeft size={26} strokeWidth={2.2} color={grey900} aria-hidden />
        </button>
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 16, fontWeight: 850, lineHeight: "24px" }}>공구 등록</h1>
        <span />
      </header>

      <main style={{ padding: "14px 20px 128px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          <strong style={{ color: blue500, fontSize: 14, lineHeight: "20px" }}>{step}</strong>
          <span style={{ color: grey500, fontSize: 14, lineHeight: "20px" }}>/ 5</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, margin: "-24px 0 32px" }}>
          {progress.map((active, idx) => (
            <span
              key={idx}
              aria-hidden
              style={{
                height: 3,
                borderRadius: 999,
                background: active ? blue500 : grey200,
              }}
            />
          ))}
        </div>

        {step === 1 ? (
          <section>
            <StepTitle
              title="공구할 상품을 알려주세요"
              desc="대표 이미지를 올리고, 상품명과 공구 제목을 입력해 주세요."
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                marginTop: 28,
                width: "100%",
                minHeight: 140,
                border: `1.5px dashed ${grey400}`,
                borderRadius: 12,
                background: grey50,
                color: blue500,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "grid", justifyItems: "center", gap: 10 }}>
                <Camera size={34} strokeWidth={2.1} aria-hidden />
                <strong style={{ color: blue600, fontSize: 15, lineHeight: "22px" }}>상품 이미지 추가</strong>
                <span style={{ color: grey500, fontSize: 12, lineHeight: "18px" }}>최대 5장까지 업로드 가능</span>
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleSelectFile} />

            <div style={{ display: "flex", gap: 10, marginTop: 16, marginBottom: 34 }}>
              {images.slice(0, 4).map((img, index) => (
                <div key={img.preview} style={{ position: "relative", width: 76, height: 76, borderRadius: 12, overflow: "hidden", background: teal50 }}>
                  <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    aria-label="이미지 삭제"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    style={{
                      position: "absolute",
                      right: -4,
                      top: -4,
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      border: 0,
                      background: grey800,
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <X size={12} strokeWidth={2.4} aria-hidden />
                  </button>
                </div>
              ))}
              {images.length < 5 ? (
                <button
                  type="button"
                  aria-label="이미지 추가"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 12,
                    border: `1.5px dashed ${grey300}`,
                    background: "#fff",
                    display: "grid",
                    placeItems: "center",
                    color: grey600,
                  }}
                >
                  <Plus size={30} strokeWidth={1.7} aria-hidden />
                </button>
              ) : null}
            </div>

            <LabeledInput label="상품명" value={productName} onChange={setProductName} />
            <div style={{ height: 14 }} />
            <LabeledInput label="공구 제목" value={title} onChange={setTitle} />
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <StepTitle title="공구 방식을 선택해 주세요" desc="공구 유형과 카테고리를 선택해 주세요." />
            <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
              <TypeCard
                active={tradeType === "PRE_RECRUIT"}
                title="함께 사실 분 모집"
                badge="A형 · 선 모집형"
                desc={["구매 전 참여자를 모아", "목표 인원 달성 시 결제 및 주문 진행"]}
                chips={["재고 부담 없음", "비용 분배 명확"]}
                onClick={() => setTradeType("PRE_RECRUIT")}
              />
              <TypeCard
                active={tradeType === "POST_PURCHASE"}
                title="사왔는데 나누실 분 모집"
                badge="B형 · 후 나눔형"
                desc={["이미 구매한 대용량 상품을", "실시간으로 소분/나눔"]}
                chips={["즉시 수령 가능", "물건 확보 완료"]}
                onClick={() => setTradeType("POST_PURCHASE")}
              />
            </div>
            <div style={{ ...inputCard, marginTop: 18 }}>
              <p style={{ margin: 0, color: grey600, fontSize: 13, lineHeight: "19px" }}>카테고리 선택</p>
              <button
                type="button"
                style={{
                  marginTop: 10,
                  width: "100%",
                  height: 42,
                  borderRadius: 9,
                  border: `1px solid ${grey200}`,
                  background: "#fff",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: grey900,
                  fontSize: 14,
                }}
              >
                {category}
                <ChevronDown size={17} color={grey400} aria-hidden />
              </button>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {CATEGORIES.map((item) => (
                  <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
                    {item}
                  </Chip>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <StepTitle title="가격과 모집 조건을 입력해 주세요" desc="1인당 가격과 모집 인원 등 참여 조건을 정해 주세요." />
            <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
              <RowInput label="1인당 가격" value={`${money(price)}원`} onClick={() => setPrice(prompt("1인당 가격", price) ?? price)} />
              <RowInput label="모집 인원" value={`${onlyDigits(people) || 0}명`} onClick={() => setPeople(prompt("모집 인원", people) ?? people)} />
              <RowInput label="현재 참여자" value={`${onlyDigits(currentPeople) || 0}명`} onClick={() => setCurrentPeople(prompt("현재 참여자", currentPeople) ?? currentPeople)} />
              <RowInput label="최대 수량" value={`${onlyDigits(maxQuantity) || 0}세트`} onClick={() => setMaxQuantity(prompt("최대 수량", maxQuantity) ?? maxQuantity)} />
              <RowInput label="결제 방식" value={paymentMethod} onClick={() => setPaymentMethod(paymentMethod === "목표 인원 달성 후 결제" ? "즉시 결제" : "목표 인원 달성 후 결제")} chevron />
            </div>
            <InfoBox title="목표 인원이 모이면" desc="자동으로 주문 진행 안내가 시작돼요." />
          </section>
        ) : null}

        {step === 4 ? (
          <section>
            <StepTitle title="수령 장소와 일정을 알려주세요" desc="참여자가 헷갈리지 않도록 장소와 시간을 자세히 적어 주세요." />
            <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
              <LabeledInput label="수령 장소" value={location} onChange={setLocation} />
              <RowInput label="수령 날짜" value={pickupDate} onClick={() => setPickupDate(prompt("수령 날짜", pickupDate) ?? pickupDate)} chevron />
              <RowInput label="마감일" value={deadline} onClick={() => setDeadline(prompt("마감일", deadline) ?? deadline)} chevron />
              <LabeledInput label="예상 수령 시간" value={pickupTime} onChange={setPickupTime} />
            </div>
            <div style={{ marginTop: 16, borderRadius: 12, background: grey50, overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 10, padding: "16px 16px 10px" }}>
                <span style={{ width: 30, height: 30, borderRadius: 999, background: blue50, display: "grid", placeItems: "center", color: blue500 }}>
                  <MapPin size={17} fill="rgba(49,130,246,0.12)" aria-hidden />
                </span>
                <div>
                  <p style={{ margin: 0, color: grey900, fontSize: 13, fontWeight: 800 }}>학교 안에서 찾기 쉬운 장소를 적어주세요.</p>
                  <p style={{ margin: "4px 0 0", color: grey500, fontSize: 11 }}>예: 학생회관 앞, 정문 앞, 기숙사 로비</p>
                </div>
              </div>
              <div style={{ margin: "0 16px 16px", height: 145, borderRadius: 8, background: "#dfeee9", position: "relative", overflow: "hidden" }}>
                <MapPattern />
              </div>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section>
            <StepTitle title="공구 소개를 작성해 주세요" desc="상세 설명과 태그를 입력한 뒤, 등록 정보를 확인해 주세요." />
            <div style={{ marginTop: 26 }}>
              <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 850 }}>상세 설명</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                style={{
                  width: "100%",
                  minHeight: 150,
                  resize: "none",
                  border: `1px solid ${grey200}`,
                  borderRadius: 12,
                  padding: 16,
                  color: grey900,
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "21px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ margin: "8px 4px 0", textAlign: "right", color: grey500, fontSize: 12 }}>{description.length} / 500</p>
            </div>
            <div style={{ marginTop: 18 }}>
              <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 850 }}>태그</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TAGS.map((tag) => (
                  <span key={tag} style={{ borderRadius: 999, padding: "8px 11px", background: blue50, color: blue600, fontSize: 12, fontWeight: 700 }}>
                    {tag} ×
                  </span>
                ))}
                <button type="button" style={{ border: `1px dashed ${blue500}`, borderRadius: 999, padding: "7px 12px", background: "#fff", color: blue500, fontSize: 12, fontWeight: 700 }}>
                  + 태그 추가
                </button>
              </div>
            </div>
            <div style={{ marginTop: 26, ...inputCard, background: grey50 }}>
              <p style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 850 }}>등록 전 확인</p>
              <Review label="상품명" value={productName} />
              <Review label="공구 방식" value={tradeType === "PRE_RECRUIT" ? "선 모집형" : "후 나눔형"} />
              <Review label="가격" value={`${money(price)}원`} />
              <Review label="모집 인원" value={`${people}명`} />
              <Review label="수령 장소" value={location} />
            </div>
          </section>
        ) : null}
      </main>

      <div style={ctaWrap}>
        <button
          type="button"
          onClick={goBack}
          disabled={loading}
          style={{
            height: 52,
            border: 0,
            borderRadius: 11,
            background: grey100,
            color: grey800,
            fontSize: 16,
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          이전
        </button>
        <button
          type="button"
          onClick={step === 5 ? handleSubmit : handleNext}
          disabled={loading}
          style={{
            height: 52,
            border: 0,
            borderRadius: 11,
            background: blue500,
            color: "#fff",
            fontSize: 16,
            fontWeight: 850,
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.62 : 1,
          }}
        >
          {step === 5 ? "등록하기" : "다음"}
        </button>
      </div>
    </div>
  );
}

function StepTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <>
      <h2 style={{ margin: 0, color: grey900, fontSize: 22, fontWeight: 900, lineHeight: "31px", letterSpacing: 0 }}>{title}</h2>
      <p style={{ margin: "8px 0 0", color: grey500, fontSize: 13, fontWeight: 500, lineHeight: "19px" }}>{desc}</p>
    </>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={{ ...inputCard, display: "block" }}>
      <span style={{ display: "block", color: grey600, fontSize: 12, lineHeight: "18px", marginBottom: 8 }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", border: 0, outline: "none", color: grey900, fontSize: 16, fontWeight: 500, lineHeight: "24px", background: "transparent" }}
      />
    </label>
  );
}

function TypeCard({ active, title, badge, desc, chips, onClick }: { active: boolean; title: string; badge: string; desc: string[]; chips: string[]; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1.5px solid ${active ? blue500 : grey200}`,
        borderRadius: 12,
        background: active ? "#fbfdff" : "#fff",
        padding: 18,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <span style={{ width: 22, height: 22, borderRadius: 999, border: `1.5px solid ${active ? blue500 : grey400}`, background: active ? blue500 : "#fff", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
          {active ? "✓" : ""}
        </span>
        <div>
          <p style={{ margin: 0, color: grey900, fontSize: 16, fontWeight: 850, lineHeight: "24px" }}>{title}</p>
          <span style={{ display: "inline-block", marginTop: 7, borderRadius: 6, padding: "4px 7px", color: blue600, background: blue50, fontSize: 12, fontWeight: 700 }}>{badge}</span>
          {desc.map((line) => (
            <p key={line} style={{ margin: "8px 0 0", color: grey600, fontSize: 13, lineHeight: "19px" }}>{line}</p>
          ))}
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <span key={chip} style={{ borderRadius: 6, padding: "5px 7px", color: blue600, background: blue50, fontSize: 11, fontWeight: 700 }}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ minHeight: 36, borderRadius: 9, border: `1px solid ${active ? blue500 : grey200}`, background: active ? "#fff" : background, color: active ? blue600 : grey600, padding: "0 12px", fontSize: 13, fontWeight: 750 }}>
      {children}
    </button>
  );
}

function RowInput({ label, value, onClick, chevron }: { label: string; value: string; onClick: () => void; chevron?: boolean }) {
  return (
    <button type="button" onClick={onClick} style={{ ...inputCard, display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", cursor: "pointer" }}>
      <span style={{ color: grey800, fontSize: 15, fontWeight: 500 }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8, color: grey900, fontSize: 16, fontWeight: 500 }}>
        {value}
        {chevron ? <ChevronDown size={17} color={grey400} aria-hidden /> : null}
      </span>
    </button>
  );
}

function InfoBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginTop: 18, borderRadius: 12, background: "#f4f6ff", padding: 18, display: "flex", gap: 14 }}>
      <span style={{ width: 48, height: 48, borderRadius: 999, background: blue50, color: blue500, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Users size={25} fill="rgba(49,130,246,0.14)" aria-hidden />
      </span>
      <div>
        <p style={{ margin: 0, color: blue600, fontSize: 14, fontWeight: 850 }}>{title}</p>
        <p style={{ margin: "6px 0 0", color: grey500, fontSize: 13, lineHeight: "19px" }}>{desc}</p>
      </div>
    </div>
  );
}

function MapPattern() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, transparent 0 45%, rgba(255,255,255,0.75) 45% 51%, transparent 51% 100%)" }} />
      <div style={{ position: "absolute", left: 94, top: 36, width: 84, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.75)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800 }}>명지대학교</div>
      <div style={{ position: "absolute", left: 126, top: 84, color: blue500 }}>
        <MapPin size={28} fill="rgba(49,130,246,0.18)" />
      </div>
      <div style={{ position: "absolute", left: 82, bottom: 20, borderRadius: 999, padding: "6px 12px", background: "#fff", color: grey800, fontSize: 10, fontWeight: 800 }}>정문</div>
    </>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 10, marginTop: 14 }}>
      <span style={{ color: grey600, fontSize: 13, lineHeight: "20px" }}>{label}</span>
      <span style={{ color: grey900, fontSize: 13, lineHeight: "20px", textAlign: "right" }}>{value}</span>
    </div>
  );
}
