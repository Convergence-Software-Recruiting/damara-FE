import React, { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { addFavorite, checkFavorite, removeFavorite } from "../api/groupBuyApi";
import { readFavoriteFlag } from "../utils/favoriteResponse";
import { STORAGE_KEYS } from "../../../shared/constants/storageKeys";

interface FavoriteHeartButtonProps {
  postId: number | string;
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
}

export default function FavoriteHeartButton({
  postId,
  className,
  style,
  iconClassName = "size-4",
}: FavoriteHeartButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_ID) || "" : "";

  useEffect(() => {
    if (!userId || postId === "" || postId == null) {
      setIsFavorite(false);
      return;
    }
    let cancelled = false;
    checkFavorite(String(postId), userId)
      .then((res) => {
        if (!cancelled) setIsFavorite(readFavoriteFlag(res.data));
      })
      .catch(() => {
        if (!cancelled) setIsFavorite(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId, userId]);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!userId) {
        toast.error("로그인이 필요합니다.");
        return;
      }
      if (loading) return;
      const next = !isFavorite;
      setIsFavorite(next);
      setLoading(true);
      try {
        if (next) await addFavorite(String(postId), userId);
        else await removeFavorite(String(postId), userId);
      } catch {
        setIsFavorite(!next);
        toast.error("찜 처리에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [userId, loading, isFavorite, postId]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "관심 해제" : "관심 등록"}
      className={className}
      style={style}
    >
      <Heart
        className={iconClassName}
        strokeWidth={1.75}
        fill={isFavorite ? "#fa5252" : "none"}
        color={isFavorite ? "#fa5252" : "currentColor"}
      />
    </button>
  );
}
