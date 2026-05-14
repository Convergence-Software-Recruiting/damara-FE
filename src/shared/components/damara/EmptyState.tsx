import React from "react";

import { BRAND_PRIMARY, grey500, grey900, HOME_BORDER } from "../../constants/homeTheme";
import {
  UI_BUTTON_H,
  UI_PAGE_PAD_X,
  UI_R_BUTTON,
  UI_T_BODY,
  UI_T_SECTION,
} from "../../constants/damaraUISystem";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: `48px ${UI_PAGE_PAD_X}px`,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ width: 96, height: 96, display: "grid", placeItems: "center", color: grey500 }}>{icon}</div>
      <h2
        style={{
          margin: 0,
          fontSize: UI_T_SECTION.size,
          fontWeight: UI_T_SECTION.weight,
          lineHeight: `${UI_T_SECTION.line}px`,
          color: grey900,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: 0,
          maxWidth: 280,
          fontSize: UI_T_BODY.size,
          fontWeight: UI_T_BODY.weight,
          lineHeight: `${UI_T_BODY.line}px`,
          color: grey500,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: 8,
            height: UI_BUTTON_H,
            minWidth: 200,
            padding: "0 24px",
            borderRadius: UI_R_BUTTON,
            border: `1px solid ${HOME_BORDER}`,
            backgroundColor: BRAND_PRIMARY,
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
