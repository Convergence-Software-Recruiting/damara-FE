import React, { useState } from "react";
import { getImageUrl } from "../../../shared/utils/imageUrl";
import FavoriteHeartButton from "./FavoriteHeartButton";
import {
  BADGE_INFO_BG,
  BADGE_INFO_TEXT,
  BADGE_PROMO_BG,
  BADGE_PROMO_TEXT,
  BADGE_SPECIAL_BG,
  BADGE_SPECIAL_TEXT,
  BADGE_URGENT_BG,
  BADGE_URGENT_TEXT,
  BRAND_PRIMARY,
  blue50,
  green50,
  green600,
  grey100,
  grey400,
  grey500,
  grey800,
  grey900,
  HOME_BORDER,
  orange500,
  yellow50,
} from "../../../shared/constants/homeTheme";
import {
  UI_BADGE_FS,
  UI_BADGE_FW,
  UI_BADGE_H,
  UI_BADGE_PAD_X,
  UI_R_BADGE,
  UI_R_CARD,
  UI_R_THUMB,
  UI_T_CARD_TITLE,
  UI_T_META,
  UI_T_PRICE,
  UI_IX_HOVER_GREY50,
  UI_IX_ROW,
} from "../../../shared/constants/damaraUISystem";
import type { GroupBuyType } from "../../../types/groupBuy";

export interface GroupBuyCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  currentPeople: number;
  maxPeople: number;
  location: string;
  status: "open" | "closed" | "in_progress" | "completed" | "recruiting";
  onClick?: () => void;
  groupBuyType?: GroupBuyType | string | null;
  deadline?: string | null;
  deadlineLabel?: string | null;
  visualType?: "plus" | "bar" | "default";
  tags?: string[];
  remainingQuantity?: number | null;
  isReceiptVerified?: boolean | null;
}

const THUMB_BG = [grey100, green50, yellow50, grey100];

function formatDeadlineLine(location: string, deadline: string | null): string {
  if (!deadline) return location;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return location;
  const wd = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${location} · 마감: ${d.getMonth() + 1}월 ${d.getDate()}일 (${wd})`;
}

function hoursUntil(deadline: string): number {
  return (new Date(deadline).getTime() - Date.now()) / 36e5;
}

export default function GroupBuyCard({
  id,
  image,
  title,
  price,
  currentPeople,
  maxPeople,
  location,
  status: _status,
  onClick,
  groupBuyType,
  deadline,
  deadlineLabel,
  visualType = "default",
  tags,
}: GroupBuyCardProps) {
  const progressRatio = maxPeople > 0 ? Math.min(currentPeople / maxPeople, 1) : 0;
  const progressPercent = progressRatio * 100;
  const [imgError, setImgError] = useState(false);

  const deadlineSoon =
    !!deadline && hoursUntil(deadline) > 0 && hoursUntil(deadline) < 72;
  const almostFull = progressRatio >= 0.75;
  const urgentBar = deadlineSoon || almostFull;

  const showPopular =
    maxPeople > 0 && currentPeople / maxPeople >= 0.35 && currentPeople >= 2;

  const processedImageUrl = getImageUrl(image);
  const thumbTint =
    visualType === "plus"
      ? green50
      : visualType === "bar"
        ? yellow50
        : THUMB_BG[Math.abs(Number(id)) % THUMB_BG.length];

  const pillBadge = (bg: string, color: string, label: string) => (
    <span
      style={{
        position: "absolute",
        left: 8,
        top: 8,
        height: UI_BADGE_H,
        padding: `0 ${UI_BADGE_PAD_X}px`,
        borderRadius: UI_R_BADGE,
        backgroundColor: bg,
        color,
        fontSize: UI_BADGE_FS,
        fontWeight: UI_BADGE_FW,
        lineHeight: `${UI_BADGE_H}px`,
        zIndex: 1,
      }}
    >
      {label}
    </span>
  );

  const thumbBadge =
    deadlineSoon && currentPeople < maxPeople
      ? pillBadge(BADGE_URGENT_BG, BADGE_URGENT_TEXT, "마감임박")
      : pillBadge(BADGE_INFO_BG, BADGE_INFO_TEXT, "모집중");

  const typeLabel =
    groupBuyType === "PRE_RECRUIT" ? "A형" : groupBuyType === "POST_PURCHASE" ? "B형" : null;
  const displayTags =
    tags ?? [
      ...(showPopular ? ["인기"] : []),
      ...(deadlineSoon && !almostFull ? ["마감임박"] : []),
      ...(typeLabel ? [typeLabel] : []),
    ];

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      className={
        onClick
          ? `flex bg-white ${UI_IX_ROW} ${UI_IX_HOVER_GREY50}`
          : "flex bg-white"
      }
      style={{
        gap: 11,
        padding: "12px 14px",
        borderRadius: 20,
        border: "1px solid rgba(229, 232, 235, 0.92)",
        cursor: onClick ? "pointer" : "default",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,251,255,1) 100%)",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.045)",
      }}
    >
      <div
        className="relative"
        style={{
          width: 68,
          height: 68,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: 16,
          background: `linear-gradient(145deg, ${thumbTint} 0%, ${blue50} 100%)`,
          boxShadow: "inset 0 0 0 1px rgba(49, 130, 246, 0.04)",
        }}
      >
        {React.cloneElement(thumbBadge, {
          style: {
            ...thumbBadge.props.style,
            left: 7,
            top: 7,
            height: 20,
            padding: "0 8px",
            fontSize: 10,
            lineHeight: "20px",
          },
        })}
        {imgError || !processedImageUrl || processedImageUrl === "/placeholder.png" ? (
          <div
            className="flex items-center justify-center"
            style={{ width: "100%", height: "100%" }}
            aria-hidden
          >
            {visualType === "plus" ? (
              <span style={{ color: green600, fontSize: 26, fontWeight: 500, lineHeight: 1 }}>＋</span>
            ) : visualType === "bar" ? (
              <span
                style={{
                  display: "block",
                  width: 42,
                  height: 26,
                  borderRadius: 4,
                  backgroundColor: grey800,
                  transform: "rotate(-10deg)",
                }}
              />
            ) : (
              <span style={{ fontSize: 24, opacity: 0.45, color: grey500 }} aria-hidden>
                ·
              </span>
            )}
          </div>
        ) : (
          <img
            src={processedImageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="flex items-start justify-between" style={{ gap: 8 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                margin: 0,
                color: grey900,
                fontSize: 14,
                fontWeight: 800,
                lineHeight: "20px",
                letterSpacing: "-0.015em",
              }}
            >
              {title}
            </h3>
            <div className="flex flex-wrap" style={{ gap: 5, marginTop: 6 }}>
              {displayTags.map((tag) => {
                const isPopular = tag === "인기";
                const isUrgent = tag === "마감임박";
                const isTypeB = tag === "B형";
                return (
                  <span
                    key={tag}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 19,
                      padding: "0 7px",
                      borderRadius: UI_R_BADGE,
                      backgroundColor: isPopular
                        ? BADGE_PROMO_BG
                        : isUrgent
                          ? BADGE_URGENT_BG
                          : isTypeB
                            ? BADGE_SPECIAL_BG
                            : BADGE_INFO_BG,
                      color: isPopular
                        ? BADGE_PROMO_TEXT
                        : isUrgent
                          ? BADGE_URGENT_TEXT
                          : isTypeB
                            ? BADGE_SPECIAL_TEXT
                            : BADGE_INFO_TEXT,
                      fontSize: 10,
                      fontWeight: UI_BADGE_FW,
                      lineHeight: "19px",
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          <FavoriteHeartButton
            postId={id}
            style={{ flexShrink: 0, padding: 2, color: grey400 }}
            iconClassName="size-4"
          />
        </div>

        <p
          style={{
            margin: "6px 0 0",
            color: grey500,
            fontSize: 11.5,
            fontWeight: 500,
            lineHeight: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          {deadlineLabel ? `${location} · 마감: ${deadlineLabel}` : formatDeadlineLine(location, deadline ?? null)}
        </p>
        <p style={{ margin: "2px 0 0", color: BRAND_PRIMARY, fontSize: 11.5, fontWeight: 700, lineHeight: "16px" }}>
          {currentPeople}/{maxPeople}명 참여 중
        </p>

        <div
          style={{
            width: "100%",
            height: 5,
            marginTop: 6,
            overflow: "hidden",
            borderRadius: 999,
            backgroundColor: "#eef3fb",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              borderRadius: 999,
              background: urgentBar
                ? `linear-gradient(90deg, ${orange500}, #ffb86b)`
                : `linear-gradient(90deg, ${BRAND_PRIMARY}, #5b9fff)`,
            }}
          />
        </div>

        <p
          style={{
            margin: "6px 0 0",
            color: BRAND_PRIMARY,
            fontSize: 16.5,
            fontWeight: 850,
            lineHeight: "21px",
            letterSpacing: "-0.03em",
          }}
        >
          {price}
          <span style={{ color: grey400, fontSize: 10.5, fontWeight: 500, lineHeight: "15px", marginLeft: 4 }}>/ 1인</span>
        </p>
      </div>
    </article>
  );
}
