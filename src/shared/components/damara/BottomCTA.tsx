import React from "react";

import { BRAND_PRIMARY, grey200, grey400, HOME_BORDER } from "../../constants/homeTheme";
import {
  UI_BOTTOM_CTA_PAD,
  UI_BUTTON_H,
  UI_R_BUTTON,
  UI_SHADOW_FLOAT,
  UI_IX_BUTTON,
  UI_IX_HOVER_GREY50,
} from "../../constants/damaraUISystem";

interface BottomCTAProps {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function BottomCTA({
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
}: BottomCTAProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 90,
        maxWidth: 430,
        margin: "0 auto",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderTop: `1px solid ${HOME_BORDER}`,
        padding: UI_BOTTOM_CTA_PAD,
        paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))",
        boxShadow: UI_SHADOW_FLOAT,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <button
        type="button"
        disabled={primaryDisabled}
        onClick={onPrimary}
        className={`${UI_IX_BUTTON} disabled:cursor-not-allowed [@media(hover:hover)_and_(pointer:fine)]:hover:brightness-[0.98] disabled:[@media(hover:hover)_and_(pointer:fine)]:hover:brightness-100`}
        style={{
          width: "100%",
          height: UI_BUTTON_H,
          borderRadius: UI_R_BUTTON,
          border: "none",
          backgroundColor: primaryDisabled ? grey200 : BRAND_PRIMARY,
          color: primaryDisabled ? grey400 : "#ffffff",
          fontSize: 16,
          fontWeight: 600,
          opacity: primaryDisabled ? 0.85 : 1,
        }}
      >
        {primaryLabel}
      </button>
      {secondaryLabel && onSecondary ? (
        <button
          type="button"
          onClick={onSecondary}
          className={`${UI_IX_BUTTON} ${UI_IX_HOVER_GREY50} bg-white`}
          style={{
            width: "100%",
            height: UI_BUTTON_H,
            borderRadius: UI_R_BUTTON,
            border: `1px solid ${HOME_BORDER}`,
            color: "#191f28",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {secondaryLabel}
        </button>
      ) : null}
    </div>
  );
}
