// src/data/mockEnhancedPosts.ts
// 백엔드 API가 준비되기 전까지 UI 확인에 사용하는 mock 데이터
// TODO: 실제 API 연동 시 이 파일 대신 API 응답 데이터를 사용

import {
  TrustLevel,
  TradeMethod,
  ExceptionStatus,
  VerificationStatus,
} from "../../../types/groupBuy";

export interface EnhancedPostFields {
  // 신뢰 정보
  trustScore?: number;
  trustLevel?: TrustLevel;
  writerCompletedTradeCount?: number;
  writerNoShowCount?: number;
  writerCancelCount?: number;
  writerResponseRate?: number;
  verificationStatus?: VerificationStatus;

  // 거래 방식
  tradeMethod?: TradeMethod;
  damaraZoneName?: string;
  damaraZoneAddress?: string;
  damaraZoneDescription?: string;
  pickupTimeText?: string;
  deliveryIncentiveText?: string;

  // 사전 약속
  agreementCancelPolicy?: string;
  agreementNoShowPolicy?: string;
  agreementPriceChangePolicy?: string;
  agreementOutOfStockPolicy?: string;
  agreementDamagePolicy?: string;

  // 예외 상황
  exceptionStatus?: ExceptionStatus;
  originalPrice?: number;
  changedPrice?: number;
  damagedItemCount?: number;
  adjustedPrice?: number;
  isReapprovalRequired?: boolean;
}

// 게시글 ID → 확장 데이터 매핑
// 실제 API 응답에 없는 게시글은 아래 기본값을 사용
export const MOCK_ENHANCED_DATA: Record<number, EnhancedPostFields> = {
  1: {
    trustScore: 92,
    trustLevel: "HIGH",
    writerCompletedTradeCount: 12,
    writerNoShowCount: 0,
    writerCancelCount: 1,
    writerResponseRate: 96,
    verificationStatus: "FULLY_VERIFIED",
    tradeMethod: "DAMARA_ZONE",
    damaraZoneName: "명지대 기숙사 로비",
    damaraZoneDescription: "기숙사생 접근이 쉬운 공식 접선지",
    pickupTimeText: "5월 12일 18:00",
    agreementCancelPolicy: "구매 진행 전까지 취소 가능",
    agreementNoShowPolicy: "약속 시간 15분 이상 미응답 시 노쇼 처리",
    agreementPriceChangePolicy: "가격 변경 시 참여자 재승인 후 진행",
    agreementOutOfStockPolicy: "품절 시 자동 취소 처리",
    agreementDamagePolicy: "파손 수량만큼 비용 차감 후 재정산",
    exceptionStatus: "NONE",
  },
  2: {
    trustScore: 86,
    trustLevel: "NORMAL",
    writerCompletedTradeCount: 8,
    writerNoShowCount: 0,
    writerCancelCount: 2,
    writerResponseRate: 91,
    verificationStatus: "EMAIL_VERIFIED",
    tradeMethod: "DAMARA_ZONE",
    damaraZoneName: "인문캠퍼스 학생회관 앞",
    damaraZoneDescription: "유동 인구가 많고 찾기 쉬운 공식 접선지",
    pickupTimeText: "오늘 18:00~21:00",
    agreementCancelPolicy: "수령 2시간 전까지 취소 가능",
    agreementNoShowPolicy: "사전 연락 없이 불참 시 노쇼 기록",
    agreementPriceChangePolicy: "이미 구매 완료된 상품으로 가격 변경 없음",
    agreementOutOfStockPolicy: "해당 없음",
    agreementDamagePolicy: "파손 수량 발생 시 사진 공유 후 비용 조정",
    exceptionStatus: "DAMAGED_ITEM",
    damagedItemCount: 3,
    adjustedPrice: 2700,
  },
  3: {
    trustScore: 78,
    trustLevel: "NORMAL",
    writerCompletedTradeCount: 5,
    writerNoShowCount: 1,
    writerCancelCount: 1,
    writerResponseRate: 88,
    verificationStatus: "STUDENT_ID_VERIFIED",
    tradeMethod: "DELIVERY_HANDOFF",
    pickupTimeText: "내일 13:00",
    deliveryIncentiveText: "대표 수령자 분배 비용 1,000원 우대",
    agreementCancelPolicy: "구매 확정 전까지 취소 가능",
    agreementNoShowPolicy: "약속 시간 15분 이상 미응답 시 노쇼 처리",
    agreementPriceChangePolicy: "가격 변경 시 참여자 재승인 필요",
    agreementOutOfStockPolicy: "품절 시 자동 취소",
    agreementDamagePolicy: "파손 발생 시 참여자에게 고지 후 재정산",
    exceptionStatus: "PRICE_REAPPROVAL_REQUIRED",
    originalPrice: 5000,
    changedPrice: 5700,
    isReapprovalRequired: true,
  },
};

// 기본 확장 데이터 (API에서 해당 게시글 데이터가 없을 때 사용)
export const DEFAULT_ENHANCED_DATA: EnhancedPostFields = {
  trustScore: 80,
  trustLevel: "NORMAL",
  writerCompletedTradeCount: 3,
  writerNoShowCount: 0,
  writerCancelCount: 0,
  writerResponseRate: 90,
  verificationStatus: "EMAIL_VERIFIED",
  tradeMethod: "FREE_DISCUSSION",
  agreementCancelPolicy: "협의 후 결정",
  agreementNoShowPolicy: "약속 시간 15분 이상 미응답 시 노쇼 처리",
  agreementPriceChangePolicy: "가격 변경 시 참여자 재승인 후 진행",
  agreementOutOfStockPolicy: "품절 시 자동 취소",
  agreementDamagePolicy: "파손 발생 시 협의 후 처리",
  exceptionStatus: "NONE",
};

// 게시글 ID로 확장 데이터 조회 (없으면 기본값 반환)
export function getEnhancedData(postId?: number | string): EnhancedPostFields {
  if (!postId) return DEFAULT_ENHANCED_DATA;
  const numId = Number(postId);
  return MOCK_ENHANCED_DATA[numId] ?? DEFAULT_ENHANCED_DATA;
}
