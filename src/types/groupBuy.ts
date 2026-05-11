// src/types/groupBuy.ts

export type GroupBuyType = "PRE_RECRUIT" | "POST_PURCHASE";

// ── 신뢰 / 보안 관련 타입 ──────────────────────────────────────
export type TrustLevel = "HIGH" | "NORMAL" | "LOW";

export type VerificationStatus =
  | "UNVERIFIED"
  | "EMAIL_VERIFIED"
  | "STUDENT_ID_VERIFIED"
  | "FULLY_VERIFIED";

// ── 거래 방식 타입 ───────────────────────────────────────────────
export type TradeMethod =
  | "DAMARA_ZONE"
  | "DIRECT_HANDOFF"
  | "DELIVERY_HANDOFF"
  | "FREE_DISCUSSION";

// ── 예외 상태 타입 ───────────────────────────────────────────────
export type ExceptionStatus =
  | "NONE"
  | "PRICE_REAPPROVAL_REQUIRED"
  | "OUT_OF_STOCK"
  | "DAMAGED_ITEM"
  | "DISPUTE_IN_PROGRESS";

// ── 레이블 맵 ───────────────────────────────────────────────────
export const TRUST_LEVEL_LABEL: Record<TrustLevel, string> = {
  HIGH: "신뢰 높음",
  NORMAL: "보통",
  LOW: "주의",
};

export const VERIFICATION_STATUS_LABEL: Record<VerificationStatus, string> = {
  UNVERIFIED: "미인증",
  EMAIL_VERIFIED: "이메일 인증",
  STUDENT_ID_VERIFIED: "학번 인증",
  FULLY_VERIFIED: "학교 인증 완료",
};

export const TRADE_METHOD_LABEL: Record<TradeMethod, string> = {
  DAMARA_ZONE: "다마라 존 수령",
  DIRECT_HANDOFF: "직접 전달",
  DELIVERY_HANDOFF: "배달형 전달",
  FREE_DISCUSSION: "자유 협의",
};

export const TRADE_METHOD_DESC: Record<TradeMethod, string> = {
  DAMARA_ZONE: "학교 내 공식 접선지에서 만나 물품을 나눠요",
  DIRECT_HANDOFF: "작성자 또는 참여자가 직접 전달해요",
  DELIVERY_HANDOFF: "대표 참여자가 물품을 받아 다른 참여자에게 전달해요",
  FREE_DISCUSSION: "채팅을 통해 장소와 방식을 정해요",
};

export const EXCEPTION_STATUS_LABEL: Record<ExceptionStatus, string> = {
  NONE: "정상",
  PRICE_REAPPROVAL_REQUIRED: "가격 변경 · 재승인 필요",
  OUT_OF_STOCK: "품절",
  DAMAGED_ITEM: "파손/수량 변경",
  DISPUTE_IN_PROGRESS: "분쟁 처리 중",
};

export type GroupBuyStatus =
  | "RECRUITING"
  | "RECRUIT_FULL"
  | "AVAILABLE"
  | "RESERVED"
  | "SOLD_OUT"
  | "PURCHASING"
  | "DISTRIBUTING"
  | "PRICE_CHANGED"
  | "RECONFIRM_REQUIRED"
  | "COMPLETED"
  | "CANCELLED";

export const GROUP_BUY_TYPE_LABEL: Record<GroupBuyType, string> = {
  PRE_RECRUIT: "선 모집",
  POST_PURCHASE: "후 모집",
};

export const GROUP_BUY_TYPE_DESC: Record<GroupBuyType, string> = {
  PRE_RECRUIT: "함께 사실 분 모집",
  POST_PURCHASE: "사왔는데 나누실 분 모집",
};

export const GROUP_BUY_STATUS_LABEL: Record<GroupBuyStatus, string> = {
  RECRUITING: "모집중",
  RECRUIT_FULL: "모집완료",
  AVAILABLE: "나눔 가능",
  RESERVED: "예약됨",
  SOLD_OUT: "마감",
  PURCHASING: "구매중",
  DISTRIBUTING: "배분중",
  PRICE_CHANGED: "가격변동",
  RECONFIRM_REQUIRED: "재확인 필요",
  COMPLETED: "거래완료",
  CANCELLED: "취소됨",
};
