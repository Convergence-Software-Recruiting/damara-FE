import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Eye, EyeOff, IdCard, Lock } from "lucide-react";
import { loginUser } from "../../features/auth/api/authApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import { getAuthErrorMessage } from "../../shared/utils/apiError";
import damaraLogo from "../../assets/logo_damara.png";
import {
  background,
  blue500,
  blue600,
  grey400,
  grey500,
  grey600,
  grey700,
  grey900,
  red200,
  DANGER,
  DANGER_BG,
} from "../../shared/constants/homeTheme";

const pageWrap: React.CSSProperties = {
  position: "relative",
  minHeight: "100dvh",
  height: "100dvh",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  boxSizing: "border-box",
  background: "#F5F9FF",
};

const phoneCard: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "none",
  height: "100dvh",
  minHeight: 0,
  overflow: "hidden",
  borderRadius: 0,
  background: "#F5F9FF",
  boxShadow: "none",
  border: 0,
};

const content: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  height: "100%",
  padding: "230px 56px 34px",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
};

const brandMark: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 14,
  marginBottom: 42,
};

const brandOrb: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 14,
  overflow: "hidden",
  background: "#fff",
  border: "1px solid rgba(49, 130, 246, 0.12)",
  boxShadow: "0 10px 24px rgba(49, 130, 246, 0.16)",
};

const lineField: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 13,
  height: 40,
  borderBottom: "1.5px solid rgba(49, 130, 246, 0.22)",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: 0,
  outline: "none",
  background: "transparent",
  color: grey900,
  fontFamily: "Pretendard, Inter, system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 600,
};

const submitButton: React.CSSProperties = {
  width: 174,
  height: 44,
  alignSelf: "center",
  border: 0,
  borderRadius: 14,
  color: background,
  background: "linear-gradient(135deg, #4593FC 0%, #3182F6 100%)",
  boxShadow: "0 12px 22px rgba(49, 130, 246, 0.28)",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  transition: "transform 0.14s ease, filter 0.14s ease, opacity 0.18s ease",
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
  const [rememberMe, setRememberMe] = useState(false);
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
          .damara-line-input::placeholder {
            color: ${grey500};
            opacity: 0.86;
          }
          .damara-line-field:focus-within {
            border-bottom-color: ${blue500};
          }
          .damara-login-submit:active:not(:disabled) {
            transform: translateY(1px);
            filter: brightness(0.98);
          }
          .damara-login-submit:disabled {
            opacity: 0.62;
            cursor: wait;
          }
          .damara-soft-link:hover {
            color: ${blue600} !important;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .damara-soft-link:focus-visible,
          .damara-remember:focus-visible {
            outline: 2px solid rgba(49, 130, 246, 0.36);
            outline-offset: 3px;
          }
          @media (max-height: 700px) {
            .damara-login-content {
              padding-top: 204px !important;
              padding-bottom: 24px !important;
            }
            .damara-brand-mark {
              margin-bottom: 28px !important;
            }
            .damara-login-form {
              gap: 21px !important;
            }
          }
          @media (max-width: 370px) {
            .damara-login-content {
              padding-left: 42px !important;
              padding-right: 42px !important;
            }
          }
        `}
      </style>

      <main style={phoneCard}>
        <svg
          aria-hidden
          viewBox="0 0 362 190"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            width: "100%",
            height: 190,
            display: "block",
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="damaraWaveA" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#5B9FFF" />
              <stop offset="100%" stopColor="#3182F6" />
            </linearGradient>
            <linearGradient id="damaraWaveB" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#C9E2FF" />
              <stop offset="100%" stopColor="#5B9FFF" />
            </linearGradient>
          </defs>
          <rect width="362" height="190" fill="url(#damaraWaveA)" />
          <path
            d="M0 55C35 82 61 77 96 49C135 18 166 35 197 79C236 135 273 154 313 130C337 116 350 102 362 90V190H0V55Z"
            fill="url(#damaraWaveB)"
            opacity="0.78"
          />
          <path
            d="M0 154C33 178 70 172 109 133C153 88 198 85 239 123C278 159 316 170 362 150V190H0V154Z"
            fill="#F5F9FF"
          />
          <path d="M74 -22L257 176" stroke="rgba(255,255,255,0.22)" />
          <path d="M210 -28L72 171" stroke="rgba(255,255,255,0.18)" />
        </svg>

        <div className="damara-login-content" style={content}>
          <div className="damara-brand-mark" style={brandMark}>
            <div aria-hidden style={brandOrb}>
              <img
                src={damaraLogo}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: "scale(1.55)",
                }}
              />
            </div>
            <div
              style={{
                color: blue500,
                fontFamily: "Montserrat, Pretendard, system-ui, sans-serif",
                fontSize: 23,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              DAMARA
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              style={{
                marginBottom: 18,
                borderRadius: 12,
                border: `1px solid ${red200}`,
                background: DANGER_BG,
                padding: "10px 12px",
                color: DANGER,
                fontSize: 12,
                lineHeight: 1.45,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          ) : null}

          <form
            className="damara-login-form"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 27,
            }}
            onSubmit={(e) => {
              e.preventDefault();
              void handleLogin();
            }}
            noValidate
          >
            <div className="damara-line-field" style={lineField}>
              <IdCard width={16} height={16} color="#6B9FEA" strokeWidth={1.9} aria-hidden />
              <input
                className="damara-line-input"
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
                placeholder="학번"
                style={inputStyle}
              />
            </div>

            <div className="damara-line-field" style={lineField}>
              <Lock width={15} height={15} color="#6B9FEA" strokeWidth={1.9} aria-hidden />
              <input
                className="damara-line-input"
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
                placeholder="비밀번호"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                style={{
                  width: 32,
                  height: 32,
                  border: 0,
                  borderRadius: 10,
                  background: "transparent",
                  color: "#8CB9F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <EyeOff width={17} height={17} strokeWidth={2} aria-hidden />
                ) : (
                  <Eye width={17} height={17} strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -2,
              }}
            >
              <button
                type="button"
                className="damara-remember"
                onClick={() => setRememberMe((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: 0,
                  background: "transparent",
                  color: grey600,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: "1.4px solid rgba(49, 130, 246, 0.34)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: background,
                    background: rememberMe ? "linear-gradient(135deg, #4593FC, #3182F6)" : "transparent",
                  }}
                >
                  {rememberMe ? <Check width={12} height={12} strokeWidth={3} /> : null}
                </span>
                로그인 유지
              </button>

              <button
                type="button"
                className="damara-soft-link"
                style={{
                  border: 0,
                  background: "transparent",
                  color: blue500,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() => {
                  /* 비밀번호 찾기 */
                }}
              >
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="damara-login-submit"
              style={submitButton}
            >
              {isLoading ? "로그인 중…" : "로그인"}
            </button>
          </form>

          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              color: grey700,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            또는
          </div>

          <button
            type="button"
            className="damara-soft-link"
            onClick={() => nav("/register")}
            style={{
              alignSelf: "center",
              marginTop: 13,
              border: 0,
              background: "transparent",
              color: blue500,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
            }}
          >
            회원가입
          </button>

          <p
            style={{
              margin: "auto 0 0",
              color: grey400,
              textAlign: "center",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            명지인 공동구매를 더 가볍게 시작해요.
          </p>
        </div>
      </main>
    </div>
  );
}
