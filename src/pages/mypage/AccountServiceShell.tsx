import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  background,
  blue50,
  blue600,
  grey200,
  grey500,
  grey700,
  grey900,
  HOME_CANVAS,
} from "../../shared/constants/homeTheme";

type ShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AccountServiceShell({ title, subtitle, children }: ShellProps) {
  const nav = useNavigate();

  return (
    <div data-page={title} style={{ minHeight: "100dvh", backgroundColor: HOME_CANVAS }}>
      <header
        style={{
          height: 54,
          display: "grid",
          gridTemplateColumns: "38px 1fr 38px",
          alignItems: "center",
          padding: "0 14px",
          backgroundColor: "rgba(255,255,255,0.92)",
          borderBottom: `1px solid ${grey200}`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
          style={{
            width: 34,
            height: 34,
            border: 0,
            borderRadius: 999,
            background: "transparent",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={23} strokeWidth={2.2} color={grey900} />
        </button>
        <h1 style={{ margin: 0, textAlign: "center", color: grey900, fontSize: 17, lineHeight: "24px", fontWeight: 850 }}>
          {title}
        </h1>
      </header>

      <main style={{ padding: "18px 20px 34px" }}>
        {subtitle ? (
          <p style={{ margin: "0 2px 14px", color: grey500, fontSize: 13, lineHeight: "19px", fontWeight: 600 }}>
            {subtitle}
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}

export const serviceCard: React.CSSProperties = {
  border: `1px solid ${grey200}`,
  borderRadius: 12,
  background,
  boxShadow: "0 8px 24px rgba(2, 32, 71, 0.05), 0 1px 2px rgba(2, 32, 71, 0.04)",
  overflow: "hidden",
};

export const sectionTitle: React.CSSProperties = {
  margin: "22px 2px 9px",
  color: grey900,
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: 850,
};

export const bodyText: React.CSSProperties = {
  margin: 0,
  color: grey700,
  fontSize: 13,
  lineHeight: "20px",
  fontWeight: 500,
};

export const softInfoBox: React.CSSProperties = {
  borderRadius: 12,
  background: blue50,
  color: blue600,
  padding: "12px 14px",
  fontSize: 12.5,
  lineHeight: "19px",
  fontWeight: 700,
};
