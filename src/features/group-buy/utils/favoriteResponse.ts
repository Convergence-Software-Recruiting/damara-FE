/** GET /posts/:id/favorite/:userId 등 찜 여부 응답을 안전하게 boolean으로 변환 */
export function readFavoriteFlag(payload: unknown): boolean {
  if (payload == null) return false;
  if (typeof payload === "boolean") return payload;
  if (typeof payload !== "object") return false;
  const o = payload as Record<string, unknown>;
  const keys = ["isFavorite", "favorite", "is_favorite", "isFavoriteStatus"];
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "boolean") return v;
    if (v === 1 || v === "1" || v === "true") return true;
    if (v === 0 || v === "0" || v === "false") return false;
  }
  if (o.data != null && typeof o.data === "object") {
    return readFavoriteFlag(o.data);
  }
  return false;
}
