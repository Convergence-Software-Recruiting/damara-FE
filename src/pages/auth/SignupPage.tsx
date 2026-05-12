import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, IdCard, Lock, Mail, User } from "lucide-react";
import { registerUser, loginUser } from "../../features/auth/api/authApi";
import { toast } from "sonner";
import { getAuthErrorMessage } from "../../shared/utils/apiError";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

/** Figma node 21:363 — 390×844 회원가입 */
const FIGMA = {
  brand: "#5a6fe8",
  tagline: "#8a93b8",
  muted: "#747b8f",
  link: "#5f72f0",
  bgGradient:
    "linear-gradient(180deg, #e2e7f5 0%, #dce6f9 30%, #e8effc 60%, #f4f7ff 80%, #ffffff 100%)",
  fieldBorder: "#e0e4ef",
  placeholder: "rgba(42,46,66,0.5)",
  btn: "#6071f2",
} as const;

const cardStyle: React.CSSProperties = {
  position: "absolute",
  left: 35,
  top: 289,
  width: 319,
  height: 398,
  background: "#fff",
  borderRadius: 24,
  boxShadow: "0 4px 15px rgba(90,111,232,0.1)",
  boxSizing: "border-box",
};

const fieldRow = (top: number): React.CSSProperties => ({
  position: "absolute",
  left: 20,
  top,
  width: 279,
  height: 48,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "1.5px 13.5px 1.5px 17.5px",
  background: "#fff",
  border: `1.5px solid ${FIGMA.fieldBorder}`,
  borderRadius: 14,
  boxSizing: "border-box",
});

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: 0,
  outline: "none",
  background: "transparent",
  color: "#2a2e42",
  fontFamily: "Pretendard, Inter, system-ui, sans-serif",
  fontSize: 15,
};

export default function SignupPage() {
  const nav = useNavigate();

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

  const iconColor = FIGMA.brand;

  return (
    <div
      data-page="회원가입"
      style={{
        position: "relative",
        isolation: "isolate",
        minHeight: "100dvh",
        width: "100%",
        overflowX: "hidden",
        background: FIGMA.bgGradient,
        backgroundColor: "#e2e7f5",
      }}
    >
      <style>
        {`
          .damara-signup-input::placeholder {
            color: ${FIGMA.placeholder};
            opacity: 1;
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 390,
          minHeight: "100dvh",
          height: 844,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            position: "absolute",
            left: 0,
            top: 157.5,
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: FIGMA.brand,
              fontFamily: "Inter, Pretendard, system-ui, sans-serif",
              fontSize: 46,
              fontWeight: 800,
              lineHeight: "46px",
              letterSpacing: 3,
            }}
          >
            DAMARA
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              color: FIGMA.tagline,
              fontSize: 15,
              lineHeight: "22.5px",
              letterSpacing: 0.5,
            }}
          >
            함께 사고, 부담은 가볍게
          </p>
        </header>

        <form
          style={cardStyle}
          onSubmit={(e) => {
            e.preventDefault();
            void handleRegister();
          }}
          noValidate
        >
          {error ? (
            <div
              role="alert"
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 4,
                zIndex: 2,
                borderRadius: 10,
                background: "rgba(212, 24, 61, 0.1)",
                padding: "6px 8px",
                textAlign: "center",
                color: "#d4183d",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          ) : null}

          <div style={fieldRow(24)}>
            <User aria-hidden style={{ width: 22, height: 22, flexShrink: 0, color: iconColor }} strokeWidth={1.75} />
            <input
              className="damara-signup-input"
              id="signup-name"
              type="text"
              autoComplete="name"
              aria-label="이름"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              placeholder="이름을 입력하세요"
              style={inputStyle}
            />
          </div>

          <div style={fieldRow(82)}>
            <IdCard aria-hidden style={{ width: 22, height: 18, flexShrink: 0, color: iconColor }} strokeWidth={1.75} />
            <input
              className="damara-signup-input"
              id="signup-student-id"
              type="text"
              autoComplete="username"
              aria-label="학번"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setError("");
              }}
              placeholder="학번을 입력하세요"
              style={inputStyle}
            />
          </div>

          <div style={fieldRow(140)}>
            <Mail aria-hidden style={{ width: 22, height: 18, flexShrink: 0, color: iconColor }} strokeWidth={1.75} />
            <input
              className="damara-signup-input"
              id="signup-email"
              type="email"
              autoComplete="email"
              aria-label="학교 이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="학교 이메일을 입력하세요"
              style={inputStyle}
            />
          </div>

          <div style={{ ...fieldRow(198), paddingRight: 10 }}>
            <Lock aria-hidden style={{ width: 20, height: 22, flexShrink: 0, color: iconColor }} strokeWidth={1.75} />
            <input
              className="damara-signup-input"
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-label="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="비밀번호를 입력하세요"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              style={{
                width: 30,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: 4,
                border: 0,
                background: "transparent",
                color: "#a8b1d3",
                cursor: "pointer",
              }}
            >
              {showPassword ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
            </button>
          </div>

          <div style={{ ...fieldRow(256), paddingRight: 10 }}>
            <Lock aria-hidden style={{ width: 20, height: 22, flexShrink: 0, color: iconColor }} strokeWidth={1.75} />
            <input
              className="damara-signup-input"
              id="signup-password-confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              aria-label="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="비밀번호를 다시 입력하세요"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
              style={{
                width: 30,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: 4,
                border: 0,
                background: "transparent",
                color: "#a8b1d3",
                cursor: "pointer",
              }}
            >
              {showConfirm ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              position: "absolute",
              left: 20,
              top: 328,
              width: 279,
              height: 50,
              border: 0,
              borderRadius: 14,
              background: FIGMA.btn,
              boxShadow: "0 6px 10px rgba(96,113,242,0.35)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: isLoading ? "default" : "pointer",
              opacity: isLoading ? 0.55 : 1,
            }}
          >
            {isLoading ? "처리 중…" : "회원가입"}
          </button>
        </form>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 703,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            textAlign: "center",
          }}
        >
          <span style={{ color: FIGMA.muted, fontSize: 14, lineHeight: "21px" }}>이미 계정이 있나요?</span>
          <button
            type="button"
            onClick={() => nav("/login")}
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              color: FIGMA.link,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: "21px",
              cursor: "pointer",
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
