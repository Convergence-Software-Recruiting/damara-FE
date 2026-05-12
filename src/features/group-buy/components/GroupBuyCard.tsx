import React, { useState } from "react";
import { getImageUrl } from "../../../shared/utils/imageUrl";
import FavoriteHeartButton from "./FavoriteHeartButton";
import { HOME_BORDER } from "../../../shared/constants/homeTheme";
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

const THUMB_BG = ["#ebfbee", "#fff4e6", "#ffe3e3", "#f4f6ff"];

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
      ? "#ebfbee"
      : visualType === "bar"
        ? "#fff4e6"
        : THUMB_BG[Math.abs(Number(id)) % THUMB_BG.length];

  const thumbBadge =
    deadlineSoon && currentPeople < maxPeople ? (
      <span
        style={{
          position: "absolute",
          left: 5,
          top: 5,
          height: 18,
          padding: "2px 7px",
          borderRadius: 999,
          backgroundColor: "#fa5252",
          color: "#ffffff",
          fontSize: 9,
          fontWeight: 700,
          lineHeight: "13.5px",
          zIndex: 1,
        }}
      >
        마감임박
      </span>
    ) : (
      <span
        style={{
          position: "absolute",
          left: 5,
          top: 5,
          height: 18,
          padding: "2px 7px",
          borderRadius: 999,
          backgroundColor: "#40c057",
          color: "#ffffff",
          fontSize: 9,
          fontWeight: 700,
          lineHeight: "13.5px",
          zIndex: 1,
        }}
      >
        모집중
      </span>
    );

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
      className="flex"
      style={{
        gap: 12,
        padding: "14px 16px",
        borderBottom: `1px solid ${HOME_BORDER}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        className="relative"
        style={{
          width: 82,
          height: 82,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: 14,
          backgroundColor: thumbTint,
        }}
      >
        {thumbBadge}
        {imgError || !processedImageUrl || processedImageUrl === "/placeholder.png" ? (
          <div
            className="flex items-center justify-center"
            style={{ width: "100%", height: "100%" }}
            aria-hidden
          >
            {visualType === "plus" ? (
              <span style={{ color: "#40c057", fontSize: 36, fontWeight: 500, lineHeight: 1 }}>＋</span>
            ) : visualType === "bar" ? (
              <span
                style={{
                  display: "block",
                  width: 56,
                  height: 36,
                  borderRadius: 4,
                  backgroundColor: "#8b4513",
                  transform: "rotate(-10deg)",
                }}
              />
            ) : (
              <span style={{ fontSize: 24, opacity: 0.5 }}>📦</span>
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
                color: "#111827",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "21px",
              }}
            >
              {title}
            </h3>
            <div className="flex flex-wrap" style={{ gap: 4, marginTop: 5 }}>
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
                      padding: "2px 8px",
                      borderRadius: 999,
                      backgroundColor: isPopular
                        ? "#e6fcf5"
                        : isUrgent
                          ? "#fff5f5"
                          : isTypeB
                            ? "#ff7e94"
                            : "#7e8fff",
                      color: isPopular ? "#0ca678" : isUrgent ? "#fa5252" : "#ffffff",
                      fontSize: 10,
                      fontWeight: 600,
                      lineHeight: "15px",
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
            style={{ flexShrink: 0, padding: 2, color: "#9ca3af" }}
            iconClassName="size-4"
          />
        </div>

        <p style={{ margin: "8px 0 0", color: "#9ca3af", fontSize: 11, lineHeight: "16.5px" }}>
          {deadlineLabel ? `${location} · 마감: ${deadlineLabel}` : formatDeadlineLine(location, deadline ?? null)}
        </p>
        <p style={{ margin: "2px 0 0", color: "#3d5cff", fontSize: 11, fontWeight: 600, lineHeight: "16.5px" }}>
          {currentPeople}/{maxPeople}명 참여 중
        </p>

        <div
          style={{
            width: "100%",
            height: 5,
            marginTop: 8,
            overflow: "hidden",
            borderRadius: 999,
            backgroundColor: "#f0f0f5",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              borderRadius: 999,
              background: urgentBar
                ? "linear-gradient(90deg, #fa5252, #ff8c8c)"
                : "linear-gradient(90deg, #3d5cff, #7b95ff)",
            }}
          />
        </div>

        <p style={{ margin: "8px 0 0", color: "#111827", fontSize: 17, fontWeight: 800, lineHeight: "25.5px" }}>
          {price}
          <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 500, lineHeight: "18px" }}>/ 1인</span>
        </p>
      </div>
    </article>
  );
}
