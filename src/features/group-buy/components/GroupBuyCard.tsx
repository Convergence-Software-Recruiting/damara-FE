import React, { useState, useEffect } from "react";
import {
  checkFavorite,
  addFavorite,
  removeFavorite,
} from "../api/groupBuyApi";
import { getImageUrl } from "../../../shared/utils/imageUrl";
import { GroupBuyTypeBadge } from "./GroupBuyBadge";
import { GroupBuyType } from "../../../types/groupBuy";

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
  /** @deprecated 다크모드 제거됨. 외부 호환을 위해 prop만 받고 사용하지 않음 */
  isDarkMode?: boolean;
  groupBuyType?: GroupBuyType | string | null;
  deadline?: string | null;
  remainingQuantity?: number | null;
  isReceiptVerified?: boolean | null;
}

export default function GroupBuyCard({
  id,
  image,
  title,
  price,
  currentPeople,
  maxPeople,
  location,
  status,
  onClick,
  groupBuyType,
  deadline,
  remainingQuantity,
  isReceiptVerified,
}: GroupBuyCardProps) {
  const progressPercent = (currentPeople / maxPeople) * 100;
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const currentUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (currentUserId && id) {
      checkFavorite(String(id), currentUserId)
        .then((res) => {
          setIsFavorite(res.data.isFavorite || false);
        })
        .catch(() => {
          setIsFavorite(false);
        });
    }
  }, [id, currentUserId]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId || favoriteLoading) return;

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    setFavoriteLoading(true);

    try {
      if (newFavoriteState) {
        await addFavorite(String(id), currentUserId);
      } else {
        await removeFavorite(String(id), currentUserId);
      }
    } catch (err) {
      console.error("관심 등록/해제 실패:", err);
      setIsFavorite(!newFavoriteState);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getStatusLabel = () => {
    const statusMap: Record<string, string> = {
      open: "모집중",
      recruiting: "모집중",
      closed: "모집완료",
      in_progress: "진행중",
      completed: "거래완료",
    };
    return statusMap[status] || "모집중";
  };

  const isRecruitmentComplete = currentPeople >= maxPeople;
  const processedImageUrl = getImageUrl(image);

  return (
    <div
      onClick={onClick}
      className="flex gap-4"
      data-recruitment-complete={isRecruitmentComplete ? "true" : "false"}
      role={onClick ? "button" : undefined}
    >
      <div className="relative">
        {imgError || !processedImageUrl || processedImageUrl === "/placeholder.png" ? (
          <div className="flex items-center justify-center">
            
          </div>
        ) : (
          <img
            src={processedImageUrl}
            alt={title}
            onError={() => setImgError(true)}
          />
        )}
        <span data-status={status}>{getStatusLabel()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div>
          {groupBuyType && (
            <div className="flex items-center gap-2 flex-wrap">
              <GroupBuyTypeBadge type={groupBuyType} size="sm" />
              {groupBuyType === "POST_PURCHASE" &&
                isReceiptVerified !== null &&
                isReceiptVerified !== undefined && (
                  <span data-verified={isReceiptVerified}>
                    {isReceiptVerified ? (
                      <>
                        
                        영수증 인증
                      </>
                    ) : (
                      "미인증"
                    )}
                  </span>
                )}
            </div>
          )}

          <h3>{title}</h3>

          <div className="flex items-center gap-2">
            
            <span>{location}</span>
          </div>

          {deadline && (
            <div>
              마감:{" "}
              {new Date(deadline).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
              })}
            </div>
          )}

          {groupBuyType === "POST_PURCHASE" &&
            remainingQuantity !== null &&
            remainingQuantity !== undefined && (
              <div>남은 수량 {remainingQuantity}개</div>
            )}

          <div>
            <div className="flex items-center gap-2">
              
              <span>
                {currentPeople}/{maxPeople}명 참여
              </span>
              <button
                type="button"
                onClick={handleHeartClick}
                disabled={favoriteLoading}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? "관심 해제" : "관심 등록"}
                className="ml-auto"
              >
                
              </button>
            </div>

            <div role="progressbar" aria-valuenow={progressPercent}>
              <div data-progress={progressPercent} />
            </div>
          </div>
        </div>

        <p>{price}</p>
      </div>
    </div>
  );
}
