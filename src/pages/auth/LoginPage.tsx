import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Eye, EyeOff, IdCard, Lock, User } from "lucide-react";
import { loginUser } from "../../features/auth/api/authApi";
import { getAuthErrorMessage } from "../../shared/utils/apiError";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

const FIGMA = {
  /** 브랜드·버튼·아이콘 통일 */
  primary: "#5a64e8",
  brand: "#5a64e8",
  signup: "#5a64e8",
  headline: "#2c3140",
  subline: "#5c6378",
  taglineMuted: "#8b93a8",
  forgot: "#5a64e8",
  muted: "#9097b8",
  iconSecondary: "rgba(90, 100, 232, 0.5)",
  border: "#e4e9f4",
  bgGradient:
    "linear-gradient(180deg, #dbe4fb 0%, #e4ebfb 22%, #eef2fc 48%, #f7f9fe 78%, #ffffff 100%)",
  btnGradient: "linear-gradient(90deg, #5a64e8 0%, #6f78eb 100%)",
} as const;

function HeroShoppingBags() {
  return (
    <svg
      width={96}
      height={70}
      viewBox="0 0 108 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: "block", margin: "0 auto 6px" }}
    >
      <rect x="4" y="20" width="62" height="50" rx="13" fill={FIGMA.primary} />
      <path
        d="M28 20V11C28 6.5 32 4 36 6.5C40 4 44 6.5 44 11V20"
        stroke="#4a54d4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="38"
        y="28"
        width="56"
        height="44"
        rx="12"
        fill="#fff"
        stroke="#e2e8f6"
        strokeWidth="1.5"
      />
      <path
        d="M58 28V19C58 14.5 62 12 66 14.5C70 12 74 14.5 74 19V28"
        stroke="#c5cee8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const pageWrap: React.CSSProperties = {
  position: "relative",
  isolation: "isolate",
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  height: "100dvh",
  maxHeight: "100dvh",
  width: "100%",
  overflow: "hidden",
  overscrollBehavior: "none",
  touchAction: "manipulation",
  background: FIGMA.bgGradient,
  backgroundColor: "#dbe4fb",
  paddingTop: "max(12px, env(safe-area-inset-top, 0px))",
  paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
  boxSizing: "border-box",
};

const inner: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  maxWidth: 390,
  margin: "0 auto",
  paddingLeft: 20,
  paddingRight: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  overflow: "hidden",
  boxSizing: "border-box",
};

const fieldShell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "100%",
  height: 56,
  padding: "1.5px 17.5px",
  background: "#fff",
  border: `1.5px solid ${FIGMA.border}`,
  borderRadius: 12,
  boxSizing: "border-box",
  transition: "border-color 0.18s ease, box-shadow 0.18s ease",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: 0,
  outline: "none",
  background: "transparent",
  color: "#333",
  fontFamily: "Pretendard, Inter, system-ui, sans-serif",
  fontSize: 16,
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 334,
  margin: "0 auto",
  alignSelf: "center",
  background: "#fff",
  borderRadius: 24,
  boxShadow: "0 10px 32px rgba(76, 96, 200, 0.1), 0 2px 10px rgba(76, 96, 200, 0.06)",
  padding: "22px 22px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  boxSizing: "border-box",
};

const signupCardOuter: React.CSSProperties = {
  width: "100%",
  maxWidth: 334,
  margin: "0 auto",
  alignSelf: "center",
  marginTop: 14,
  border: 0,
  borderRadius: 20,
  background: "#fff",
  boxShadow: "0 8px 24px rgba(76, 96, 200, 0.08), 0 1px 6px rgba(76, 96, 200, 0.05)",
  cursor: "pointer",
  textAlign: "left",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
  paddingBlock: 16,
  paddingInline: 16,
  boxSizing: "border-box",
  transition: "transform 0.15s ease, box-shadow 0.2s ease",
};

export default function LoginPage() {
  const nav = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!studentId || !password) {
      setError("학번과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(studentId, password);
      const userData = response.data;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.USER_ID, userData.id);
      nav("/home");
    } catch (err) {
      console.error("로그인 실패:", err);
      setError(getAuthErrorMessage(err, "login"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      void handleLogin();
    }
  };

  return (
    <div data-page="로그인" style={pageWrap}>
      <style>
        {`
          .damara-login-input::placeholder {
            color: rgba(51, 51, 51, 0.48);
            opacity: 1;
          }
          .damara-login-field:focus-within {
            border-color: rgba(90, 100, 232, 0.55);
            box-shadow: 0 0 0 3px rgba(90, 100, 232, 0.12);
          }
          .damara-login-btn:active:not(:disabled) {
            transform: translateY(1px);
            filter: brightness(0.97);
          }
          .damara-login-btn:disabled {
            transform: none;
          }
          .damara-forgot-link {
            border-radius: 10px;
            transition: color 0.15s ease, background-color 0.15s ease;
          }
          .damara-forgot-link:hover {
            color: #4a54d4 !important;
            background-color: rgba(90, 100, 232, 0.08);
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .damara-forgot-link:focus-visible {
            outline: 2px solid rgba(90, 100, 232, 0.45);
            outline-offset: 2px;
          }
          .damara-login-signup-card:hover {
            box-shadow: 0 10px 28px rgba(90, 100, 232, 0.12), 0 2px 8px rgba(90, 100, 232, 0.06);
          }
          .damara-login-signup-card:focus-visible {
            outline: 2px solid rgba(90, 100, 232, 0.45);
            outline-offset: 3px;
          }
          .damara-login-signup-card:active {
            transform: scale(0.99);
          }
          .damara-login-stack {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
            padding-top: clamp(36px, 12vh, 88px);
            padding-bottom: clamp(12px, 3vh, 28px);
          }
          @media (max-height: 720px) {
            .damara-login-stack {
              padding-top: clamp(24px, 8vh, 56px) !important;
            }
            .damara-login-card {
              padding: 18px 18px 16px !important;
              gap: 12px !important;
            }
            .damara-login-card-title {
              font-size: 15px !important;
            }
            .damara-login-card-sub {
              font-size: 11px !important;
            }
            .damara-login-field {
              height: 50px !important;
            }
            .damara-login-submit {
              height: 50px !important;
              font-size: 15px !important;
            }
            .damara-login-signup-card {
              padding-block: 12px !important;
              gap: 10px !important;
            }
            .damara-login-signup-card .signup-icon-wrap {
              width: 44px !important;
              height: 44px !important;
            }
          }
          @media (max-height: 680px) {
            .damara-login-stack {
              padding-top: clamp(16px, 6vh, 40px) !important;
              padding-bottom: 8px !important;
            }
            .damara-login-hero {
              transform: scale(0.88);
              margin-bottom: -4px !important;
            }
            .damara-login-brand {
              font-size: clamp(1.65rem, 6.2vw, 2.1rem) !important;
            }
            .damara-login-card {
              margin-top: 14px !important;
            }
            .damara-login-signup-card {
              margin-top: 10px !important;
            }
          }
        `}
      </style>

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(55% 38% at 88% 8%, rgba(255,255,255,0.55) 0%, transparent 50%),
            radial-gradient(45% 32% at 6% 18%, rgba(90, 100, 232, 0.12) 0%, transparent 48%),
            radial-gradient(50% 40% at 50% 92%, rgba(255,255,255,0.5) 0%, transparent 45%)
          `,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          left: "-12%",
          top: "42%",
          background: "rgba(90, 100, 232, 0.12)",
          filter: "blur(48px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          right: "-8%",
          top: "58%",
          background: "rgba(230, 236, 255, 0.7)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ ...inner, position: "relative", zIndex: 1 }}>
        <div className="damara-login-stack">
          <header
            className="damara-login-header"
            style={{
              textAlign: "center",
              flexShrink: 0,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <div className="damara-login-hero" style={{ display: "flex", justifyContent: "center" }}>
              <HeroShoppingBags />
            </div>
            <h1
              className="damara-login-brand"
              style={{
                margin: "4px 0 0",
                color: FIGMA.brand,
                fontFamily: "Inter, Pretendard, system-ui, sans-serif",
                fontSize: "clamp(1.875rem, 6.8vw, 2.375rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "0.06em",
              }}
            >
              DAMARA
            </h1>
            <p
              style={{
                margin: "12px 0 0",
                color: FIGMA.headline,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.45,
                letterSpacing: "-0.02em",
              }}
            >
              필요한 건 함께, 부담은 작게
            </p>
            <p
              className="damara-login-tagline"
              style={{
                margin: "6px 0 0",
                color: FIGMA.taglineMuted,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
              }}
            >
              명지인을 위한 공동구매 플랫폼
            </p>
          </header>

          <form
            className="damara-login-card"
            style={{ ...card, marginTop: 22, flexShrink: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              void handleLogin();
            }}
            noValidate
          >
            <div style={{ marginBottom: 2 }}>
              <h2
                className="damara-login-card-title"
                style={{
                  margin: 0,
                  color: FIGMA.headline,
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  letterSpacing: "-0.02em",
                }}
              >
                명지대 학번으로 로그인하세요
              </h2>
              <p
                className="damara-login-card-sub"
                style={{
                  margin: "8px 0 0",
                  color: FIGMA.subline,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1.45,
                }}
              >
                공동구매 참여와 채팅을 시작할 수 있어요.
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                data-state="error"
                style={{
                  order: -1,
                  margin: "-4px 0 0",
                  borderRadius: 12,
                  border: "1px solid rgba(212, 24, 61, 0.2)",
                  background: "rgba(212, 24, 61, 0.08)",
                  padding: "10px 12px",
                  textAlign: "center",
                  color: "#b91c1c",
                  fontSize: 12,
                  lineHeight: 1.45,
                }}
              >
                {error}
              </div>
            ) : null}

            <div className="damara-login-field" style={fieldShell}>
              <IdCard
                aria-hidden
                style={{ width: 20, height: 17, flexShrink: 0, color: FIGMA.brand }}
                strokeWidth={1.85}
              />
              <input
                className="damara-login-input"
                id="login-student-id"
                type="text"
                autoComplete="username"
                aria-label="학번"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="학번을 입력하세요"
                style={inputStyle}
              />
            </div>

            <div className="damara-login-field" style={{ ...fieldShell, paddingRight: 12 }}>
              <Lock
                aria-hidden
                style={{ width: 19, height: 22, flexShrink: 0, color: FIGMA.brand }}
                strokeWidth={1.75}
              />
              <input
                className="damara-login-input"
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-label="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 입력하세요"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  margin: "-8px -6px -8px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  padding: 0,
                  border: 0,
                  borderRadius: 12,
                  background: "transparent",
                  color: FIGMA.iconSecondary,
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <EyeOff width={20} height={20} strokeWidth={2} aria-hidden />
                ) : (
                  <Eye width={20} height={20} strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="damara-login-btn damara-login-submit"
              style={{
                width: "100%",
                height: 56,
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: 0,
                borderRadius: 14,
                background: FIGMA.btnGradient,
                boxShadow: "0 6px 18px rgba(90, 100, 232, 0.28)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: isLoading ? "wait" : "pointer",
                opacity: isLoading ? 0.65 : 1,
                transition: "opacity 0.2s ease, transform 0.12s ease, box-shadow 0.2s ease",
              }}
            >
              {isLoading ? "로그인 중…" : "로그인"}
            </button>

            <button
              type="button"
              className="damara-forgot-link"
              style={{
                alignSelf: "center",
                marginTop: 0,
                border: 0,
                background: "transparent",
                color: FIGMA.forgot,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.5,
                cursor: "pointer",
                padding: "8px 12px",
              }}
              onClick={() => {
                /* 비밀번호 찾기 */
              }}
            >
              비밀번호를 잊으셨나요?
            </button>
          </form>

          <button
            type="button"
            className="damara-login-signup-card"
            style={signupCardOuter}
            aria-label="회원가입: 학교 인증 후 공동구매 시작하기"
            onClick={() => nav("/register")}
          >
            <div
              className="signup-icon-wrap"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(90, 100, 232, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User width={22} height={22} strokeWidth={2} style={{ color: FIGMA.brand }} aria-hidden />
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <p
                style={{
                  margin: 0,
                  color: FIGMA.headline,
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  letterSpacing: "-0.02em",
                }}
              >
                아직 DAMARA 계정이 없나요?
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: FIGMA.subline,
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: 1.45,
                }}
              >
                3분 만에 학교 인증하고 공동구매를 시작해보세요!
              </p>
            </div>
            <ChevronRight
              width={20}
              height={20}
              strokeWidth={2}
              style={{ color: "#b4bac8", flexShrink: 0 }}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </div>
  );
}
