import React from "react";

import { grey400, grey500, grey900, HOME_BORDER } from "../../constants/homeTheme";
import {
  UI_LIST_ROW_MIN_H,
  UI_LIST_ROW_PAD_X,
  UI_LIST_ROW_PAD_Y,
  UI_IX_ROW,
  UI_IX_HOVER_GREY50,
} from "../../constants/damaraUISystem";

export interface ListRowProps {
  left?: React.ReactNode;
  title: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  showDivider?: boolean;
  danger?: boolean;
  /** 더 작은 제목·설명 타이포 (예: 마이페이지) */
  compact?: boolean;
}

export default function ListRow({
  left,
  title,
  description,
  right,
  onClick,
  showDivider = true,
  danger,
  compact,
}: ListRowProps) {
  const Comp: React.ElementType = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={
        onClick
          ? `w-full text-left ${UI_IX_ROW} ${UI_IX_HOVER_GREY50}`
          : "w-full"
      }
      style={{
        minHeight: compact ? 46 : UI_LIST_ROW_MIN_H,
        padding: compact
          ? `${Math.max(10, UI_LIST_ROW_PAD_Y - 4)}px ${Math.max(14, UI_LIST_ROW_PAD_X - 4)}px`
          : `${UI_LIST_ROW_PAD_Y}px ${UI_LIST_ROW_PAD_X}px`,
        display: "flex",
        alignItems: "center",
        gap: compact ? 10 : 12,
        border: "none",
        borderBottom: showDivider ? `1px solid ${HOME_BORDER}` : undefined,
        background: "transparent",
        cursor: onClick ? "pointer" : "default",
        boxSizing: "border-box",
      }}
    >
      {left ? <span className="flex shrink-0 items-center justify-center">{left}</span> : null}
      <span className={`flex min-w-0 flex-1 flex-col ${compact ? "gap-0" : "gap-0.5"}`}>
        <span
          style={{
            fontSize: compact ? 13 : 16,
            fontWeight: 600,
            lineHeight: compact ? "18px" : "24px",
            color: danger ? "#f04452" : grey900,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </span>
        {description ? (
          <span
            className={compact ? "text-[11px] font-normal leading-[15px]" : "text-[14px] font-normal leading-5"}
            style={{ color: grey500 }}
          >
            {description}
          </span>
        ) : null}
      </span>
      {right ? (
        <span className="flex shrink-0 items-center justify-center" style={{ color: grey400 }}>
          {right}
        </span>
      ) : null}
    </Comp>
  );
}
