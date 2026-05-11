import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Label } from "../../shared/components/ui/label";
import { loginUser } from "../../features/auth/api/authApi";
import { getAuthErrorMessage } from "../../shared/utils/apiError";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function LoginPage() {
  const nav = useNavigate();

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
      console.log("로그인 성공:", userData);
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
      handleLogin();
    }
  };

  return (
    <div data-page="로그인" className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <header>
        <h1>로그인</h1>
      </header>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        {error ? (
          <div role="alert" data-state="error">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          <Label htmlFor="login-student-id">학번 (아이디)</Label>
          <Input
            id="login-student-id"
            type="text"
            autoComplete="username"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="학번을 입력"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="login-password">비밀번호</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호를 입력"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? "숨김" : "표시"}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중…" : "로그인"}
        </Button>
      </form>

      <p>
        <button type="button" onClick={() => nav("/register")}>
          회원가입
        </button>
      </p>
    </div>
  );
}
