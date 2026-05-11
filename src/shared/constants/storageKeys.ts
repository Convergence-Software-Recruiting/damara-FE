export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
  USER: "user",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
