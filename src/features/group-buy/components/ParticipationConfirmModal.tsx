import React from "react";
import { EnhancedPostFields } from "../utils/enhancedPostMapper";
import { TradeMethodBadge } from "./TrustBadges";

interface ParticipationConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  data: EnhancedPostFields;
  postTitle?: string;
  isLoading?: boolean;
}

export default function ParticipationConfirmModal({
  isOpen,
  onConfirm,
  onClose,
  data,
  postTitle,
  isLoading = false,
}: ParticipationConfirmModalProps) {
  if (!isOpen) return null;

  const agreements = [
    {
      label: "거래 방식",
      value: data.tradeMethod ? (
        <TradeMethodBadge method={data.tradeMethod} size="xs" />
      ) : null,
    },
    { label: "거래 장소", value: data.damaraZoneName || "채팅으로 협의" },
    { label: "수령 시간", value: data.pickupTimeText || "미정" },
    { label: "취소 가능", value: data.agreementCancelPolicy },
    { label: "가격 변경", value: data.agreementPriceChangePolicy },
    { label: "품절 시", value: data.agreementOutOfStockPolicy },
    { label: "노쇼 기준", value: data.agreementNoShowPolicy },
    { label: "파손 정산", value: data.agreementDamagePolicy },
  ].filter((a) => a.value);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div>
        <div>
          <div>
            <p>참여 전 확인</p>
            {postTitle && <p>{postTitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="닫기" />
        </div>

        <div>
          아래 거래 약속을 확인하고 동의한 경우에만 참여해주세요.
        </div>

        <div>
          {agreements.map((a) => (
            <div key={a.label}>
              <span>{a.label}</span>
              {typeof a.value === "string" ? (
                <span>{a.value}</span>
              ) : (
                <span>{a.value}</span>
              )}
            </div>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            
            {isLoading ? "처리 중..." : "위 내용을 확인했고 참여합니다"}
          </button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
