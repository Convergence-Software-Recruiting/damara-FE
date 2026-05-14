/**
 * 다마라 전용 UI 시스템 — Toss TDS Mobile 색·원칙을 참고한 토큰 (원본 UI Kit 비복제).
 * 레이아웃 수치·타이포·간격·인터랙션의 단일 기준.
 *
 * 전역 진입점: `damaraDesignSystem.ts` (색+시맨틱+여기 토큰 한 번에 import 가능)
 * CSS 변수: `shared/styles/damara-theme.css`의 `var(--damara-*)`와 값 맞춤
 */

/** ── Spacing ───────────────────────────────────────── */
export const UI_PAGE_PAD_X = 20;
export const UI_SECTION_GAP = 28;
export const UI_CARD_PAD = 18;
export const UI_LIST_ROW_PAD_X = 20;
export const UI_LIST_ROW_PAD_Y = 16;
export const UI_LIST_ROW_MIN_H = 56;
export const UI_BUTTON_H = 56;
export const UI_HEADER_H = 56;
export const UI_BOTTOM_CTA_PAD = "16px 20px";
export const UI_CARD_LIST_GAP = 12;

/** ── Radius ───────────────────────────────────────── */
export const UI_R_BADGE = 9999;
export const UI_R_FIELD = 14;
export const UI_R_BUTTON = 16;
export const UI_R_CARD = 20;
export const UI_R_SECTION = 24;
export const UI_R_SHEET_TOP = 24;
export const UI_R_MODAL = 20;
export const UI_R_THUMB = 16;

/** ── Typography (px) ─────────────────────────────── */
export const UI_T_PAGE_TITLE = { size: 26, weight: 700 as const, line: 34 };
export const UI_T_SECTION = { size: 21, weight: 700 as const, line: 30 };
export const UI_T_CARD_TITLE = { size: 17, weight: 700 as const, line: 25 };
export const UI_T_BODY = { size: 15, weight: 500 as const, line: 23 };
export const UI_T_META = { size: 13, weight: 500 as const, line: 19 };
export const UI_T_CAPTION = { size: 13, weight: 400 as const, line: 19 };
export const UI_T_PRICE = { size: 22, weight: 700 as const, line: 30 };
export const UI_T_HEADER_TITLE = { size: 18, weight: 700 as const, line: 26 };

/** ── Interaction (Toss grey-opacity 계열) ─────────── */
export const UI_HOVER_BG = "rgba(2, 32, 71, 0.05)";
export const UI_PRESSED_BG = "rgba(0, 27, 55, 0.10)";
export const UI_DISABLED_BG = "#f2f4f6";
export const UI_DISABLED_TEXT = "#b0b8c1";
export const UI_TRANSITION = "150ms ease-out";

/** ── Shadow: 플로팅·시트·모달만 ───────────────────── */
export const UI_SHADOW_FLOAT = "0 8px 24px rgba(0, 27, 55, 0.08)";
export const UI_SHADOW_SHEET = "0 -4px 24px rgba(0, 27, 55, 0.06)";

/** ── Badge (soft pill) ───────────────────────────── */
export const UI_BADGE_H = 28;
export const UI_BADGE_PAD_X = 11;
export const UI_BADGE_FS = 12;
export const UI_BADGE_FW = 600 as const;

/** ── Interaction (Tailwind class 조각) ─────────────── */
export const UI_IX_TRANSITION = "transition-all duration-150 ease-out";
/** 카드·리스트 row */
export const UI_IX_ROW = `${UI_IX_TRANSITION} active:scale-[0.98]`;
/** 버튼·칩·탭 */
export const UI_IX_BUTTON = `${UI_IX_TRANSITION} active:scale-[0.97]`;
/** 데스크톱(가는 포인터 + 호버 가능)에서만 연한 grey50 배경 */
export const UI_IX_HOVER_GREY50 = "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#f9fafb]";
