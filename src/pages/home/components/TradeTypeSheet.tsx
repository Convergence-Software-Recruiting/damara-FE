
export type TradeType = "PRE_RECRUIT" | "POST_PURCHASE";

interface TradeTypeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: TradeType) => void;
}

export default function TradeTypeSheet({
  isOpen,
  onClose,
  onSelect,
}: TradeTypeSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="거래 방식 선택"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div aria-hidden />

        <div>
          <button
            type="button"
            onClick={() => onSelect("PRE_RECRUIT")}
            className="w-full text-left"
          >
            <div>
              
            </div>
            <div>
              <span data-tag>구매 전 모집</span>
              <p>함께 사실 분 모집</p>
              <p>사람을 먼저 모은 뒤 같이 구매해요</p>
            </div>
            
          </button>

          <button
            type="button"
            onClick={() => onSelect("POST_PURCHASE")}
            className="w-full text-left"
          >
            <div>
              
            </div>
            <div>
              <span data-tag>구매 후 분배</span>
              <p>사온 물건 나눌 분 모집</p>
              <p>이미 구매한 물건을 함께 나눠요</p>
            </div>
            
          </button>
        </div>

        <div>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
