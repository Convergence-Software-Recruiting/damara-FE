import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, IdCard, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { loginUser, registerUser } from "../../features/auth/api/authApi";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import { getAuthErrorMessage } from "../../shared/utils/apiError";
import damaraLogo from "../../assets/logo_damara.png";
import {
  background,
  blue500,
  blue600,
  DANGER,
  DANGER_BG,
  grey400,
  grey500,
  grey700,
  grey900,
  red200,
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

const screen: React.CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "none",
  height: "100dvh",
  minHeight: 0,
  overflow: "hidden",
  background: "#F5F9FF",
};

const content: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  height: "100%",
  padding: "198px 56px 28px",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
};

const brandMark: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 13,
  marginBottom: 28,
};

const brandOrb: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 13,
  overflow: "hidden",
  background: "#fff",
  border: "1px solid rgba(49, 130, 246, 0.12)",
  boxShadow: "0 10px 24px rgba(49, 130, 246, 0.16)",
};

const lineField: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  height: 38,
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

const iconProps = {
  color: "#6B9FEA",
  strokeWidth: 1.9,
  "aria-hidden": true,
} as const;

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

export default function SignupPage() {
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

  const [nickname, setNickname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!nickname || !studentId || !email || !password || !confirmPassword) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await registerUser({
        email,
        passwordHash: password,
        nickname,
        studentId,
      });

      try {
        const loginResponse = await loginUser(studentId, password);
        const userData = loginResponse.data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.USER_ID, userData.id);
        nav("/home");
      } catch {
        toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
        nav("/login");
      }
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError(getAuthErrorMessage(err, "register"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-page="회원가입" style={pageWrap}>
      <style>
        {`
          .damara-line-input::placeholder {
            color: ${grey500};
            opacity: 0.86;
          }
          .damara-line-field:focus-within {
            border-bottom-color: ${blue500};
          }
          .damara-signup-submit:active:not(:disabled) {
            transform: translateY(1px);
            filter: brightness(0.98);
          }
          .damara-signup-submit:disabled {
            opacity: 0.62;
            cursor: wait;
          }
          .damara-soft-link:hover {
            color: ${blue600} !important;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .damara-soft-link:focus-visible,
          .damara-password-eye:focus-visible {
            outline: 2px solid rgba(49, 130, 246, 0.36);
            outline-offset: 3px;
          }
          @media (max-height: 700px) {
            .damara-signup-content {
              padding-top: 176px !important;
              padding-bottom: 22px !important;
            }
            .damara-brand-mark {
              margin-bottom: 20px !important;
            }
            .damara-signup-form {
              gap: 18px !important;
            }
            .damara-signup-copy {
              display: none !important;
            }
          }
          @media (max-width: 370px) {
            .damara-signup-content {
              padding-left: 42px !important;
              padding-right: 42px !important;
            }
          }
        `}
      </style>

      <main style={screen}>
        <svg
          aria-hidden
          viewBox="0 0 362 178"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            width: "100%",
            height: 178,
            display: "block",
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="damaraSignupWaveA" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#5B9FFF" />
              <stop offset="100%" stopColor="#3182F6" />
            </linearGradient>
            <linearGradient id="damaraSignupWaveB" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#C9E2FF" />
              <stop offset="100%" stopColor="#5B9FFF" />
            </linearGradient>
          </defs>
          <rect width="362" height="178" fill="url(#damaraSignupWaveA)" />
          <path
            d="M0 48C37 78 66 73 103 44C141 14 172 35 203 78C239 128 275 143 315 119C337 106 350 92 362 80V178H0V48Z"
            fill="url(#damaraSignupWaveB)"
            opacity="0.78"
          />
          <path
            d="M0 142C34 166 71 160 111 122C153 82 198 80 238 115C278 151 317 158 362 140V178H0V142Z"
            fill="#F5F9FF"
          />
          <path d="M74 -24L257 164" stroke="rgba(255,255,255,0.22)" />
          <path d="M210 -30L72 160" stroke="rgba(255,255,255,0.18)" />
        </svg>

        <div className="damara-signup-content" style={content}>
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
            <div>
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
              <p
                style={{
                  margin: "7px 0 0",
                  color: grey500,
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                계정을 만들고 공동구매를 시작해요
              </p>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              style={{
                marginBottom: 14,
                borderRadius: 12,
                border: `1px solid ${red200}`,
                background: DANGER_BG,
                padding: "9px 12px",
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
            className="damara-signup-form"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
            onSubmit={(e) => {
              e.preventDefault();
              void handleRegister();
            }}
            noValidate
          >
            <div className="damara-line-field" style={lineField}>
              <User width={16} height={16} {...iconProps} />
              <input
                className="damara-line-input"
                id="signup-name"
                type="text"
                autoComplete="name"
                aria-label="이름"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError("");
                }}
                placeholder="이름"
                style={inputStyle}
              />
            </div>

            <div className="damara-line-field" style={lineField}>
              <IdCard width={16} height={16} {...iconProps} />
              <input
                className="damara-line-input"
                id="signup-student-id"
                type="text"
                autoComplete="username"
                aria-label="학번"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError("");
                }}
                placeholder="학번"
                style={inputStyle}
              />
            </div>

            <div className="damara-line-field" style={lineField}>
              <Mail width={16} height={16} {...iconProps} />
              <input
                className="damara-line-input"
                id="signup-email"
                type="email"
                autoComplete="email"
                aria-label="학교 이메일"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="학교 이메일"
                style={inputStyle}
              />
            </div>

            <div className="damara-line-field" style={lineField}>
              <Lock width={15} height={15} {...iconProps} />
              <input
                className="damara-line-input"
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-label="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="비밀번호"
                style={inputStyle}
              />
              <button
                type="button"
                className="damara-password-eye"
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

            <div className="damara-line-field" style={lineField}>
              <Lock width={15} height={15} {...iconProps} />
              <input
                className="damara-line-input"
                id="signup-password-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                aria-label="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="비밀번호 확인"
                style={inputStyle}
              />
              <button
                type="button"
                className="damara-password-eye"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
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
                {showConfirm ? (
                  <EyeOff width={17} height={17} strokeWidth={2} aria-hidden />
                ) : (
                  <Eye width={17} height={17} strokeWidth={2} aria-hidden />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="damara-signup-submit"
              style={{ ...submitButton, marginTop: 2 }}
            >
              {isLoading ? "처리 중…" : "회원가입"}
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
            onClick={() => nav("/login")}
            style={{
              alignSelf: "center",
              marginTop: 12,
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
            로그인하기
          </button>

          <p
            className="damara-signup-copy"
            style={{
              margin: "auto 0 0",
              color: grey400,
              textAlign: "center",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            명지대 학번과 이메일로 안전하게 인증해요.
          </p>
        </div>
      </main>
    </div>
  );
}
