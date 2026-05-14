import { useEffect } from "react";
import { OVERLAY_DIM, HOME_BORDER, grey600, grey900 } from "../../../shared/constants/homeTheme";
import {
  UI_BUTTON_H,
  UI_R_BUTTON,
  UI_R_SHEET_TOP,
  UI_SHADOW_SHEET,
  UI_T_BODY,
  UI_T_SECTION,
} from "../../../shared/constants/damaraUISystem";

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
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: OVERLAY_DIM,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="거래 방식 선택"
        style={{
          width: "100%",
          maxWidth: 430,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: UI_R_SHEET_TOP,
          borderTopRightRadius: UI_R_SHEET_TOP,
          padding: 20,
          paddingBottom: "max(20px, env(safe-area-inset-bottom, 0px))",
          boxShadow: UI_SHADOW_SHEET,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: 0,
            fontSize: UI_T_SECTION.size,
            fontWeight: UI_T_SECTION.weight,
            color: grey900,
            letterSpacing: "-0.03em",
          }}
        >
          무엇을 함께 구매할까요?
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: UI_T_BODY.size, lineHeight: `${UI_T_BODY.line}px`, color: grey600 }}>
          같이 살 상품 정보를 알려주고 참여자를 모아보세요.
        </p>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={() => onSelect("PRE_RECRUIT")}
            className="w-full text-left transition active:scale-[0.98]"
            style={{
              borderRadius: UI_R_BUTTON,
              border: `1px solid ${HOME_BORDER}`,
              padding: "16px 18px",
              backgroundColor: "#fafbfc",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2272eb" }}>구매 전 모집</span>
            <p style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 700, color: grey900 }}>함께 살 분 모집</p>
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 400, color: grey600, lineHeight: "20px" }}>
              사람을 먼저 모은 뒤 같이 구매해요.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelect("POST_PURCHASE")}
            className="w-full text-left transition active:scale-[0.98]"
            style={{
              borderRadius: UI_R_BUTTON,
              border: `1px solid ${HOME_BORDER}`,
              padding: "16px 18px",
              backgroundColor: "#fafbfc",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2272eb" }}>구매 후 분배</span>
            <p style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 700, color: grey900 }}>사 온 물건 나눌 분 모집</p>
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 400, color: grey600, lineHeight: "20px" }}>
              이미 구매한 물건을 함께 나눠요.
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            height: UI_BUTTON_H,
            borderRadius: UI_R_BUTTON,
            border: `1px solid ${HOME_BORDER}`,
            backgroundColor: "#ffffff",
            color: grey900,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
