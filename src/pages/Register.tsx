// src/pages/Register.tsx
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { registerUser, loginUser } from "../apis/users";
import { toast } from "sonner";
import { getAuthErrorMessage } from "../utils/apiError";

export default function Register() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // 필수 입력 검증
    if (!email || !password || !nickname || !studentId) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. 회원가입
      const registerResponse = await registerUser({
        email,
        passwordHash: password,
        nickname,
        studentId,
        department: department || undefined,
      });

      console.log("✅ 회원가입 성공:", registerResponse.data);

      // 2. 자동 로그인
      try {
        const loginResponse = await loginUser(studentId, password);
        
        // 유저 정보 저장
        const userData = loginResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", userData.id);

        console.log("✅ 자동 로그인 성공:", userData);
        
        // 홈으로 이동
        nav("/home");
      } catch (loginErr) {
        // 자동 로그인 실패 시 로그인 페이지로 이동
        console.log("자동 로그인 실패, 로그인 페이지로 이동");
        toast.success("회원가입이 완료되었습니다! 로그인해주세요.");
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
    <div 
      className="w-full min-h-screen flex flex-col px-6 py-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f5f7fa 40%, #e4ecf5 100%)"
      }}
    >
      {/* 배경 블러 장식 */}
      <div 
        className="absolute top-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(53,80,116,0.08) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,163,195,0.1) 0%, transparent 70%)"
        }}
      />

      {/* 헤더 - 뒤로가기 */}
      <div className="flex items-center mb-6 relative z-10">
        <button
          onClick={() => nav(-1)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 중앙 프레임 */}
      <div className="w-full max-w-[430px] mx-auto flex flex-col relative z-10">

        {/* 🔵 DAMARA 텍스트 로고 + 슬로건 - 중앙 배치 */}
        <div className="mb-8 text-center">
          <h1
            className="font-extrabold tracking-tight text-[#355074]"
            style={{ fontFamily: "Montserrat", fontSize: "2.5rem" }}
          >
            DAMARA
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            함께 사는 즐거움
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* 입력 폼 */}
        <div className="flex flex-col gap-4">
          
          {/* 이메일 (필수) */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              이메일 <span className="text-red-500">*</span>
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="example@mju.ac.kr"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* 비밀번호 (필수) */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              비밀번호 <span className="text-red-500">*</span>
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="비밀번호를 입력하세요"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* 이름 (필수) */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setError(""); }}
              placeholder="이름을 입력하세요"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* 학번 (필수) */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              학번 <span className="text-red-500">*</span>
            </p>
            <input
              type="text"
              value={studentId}
              onChange={(e) => { setStudentId(e.target.value); setError(""); }}
              placeholder="20241234"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* 학과 (선택) */}
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">학과</p>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="컴퓨터공학과 (선택)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-[#355074] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* 가입 버튼 */}
          <Button
            onClick={handleRegister}
            disabled={isLoading}
            className="
              w-full py-3 rounded-xl text-white font-medium mt-4
              bg-gradient-to-r from-[#1A2F4A] to-[#355074]
              hover:from-[#243a5a] hover:to-[#3d5d87]
              shadow-md shadow-black/10 active:scale-[0.98] transition-all duration-200
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                가입 중...
              </span>
            ) : (
              "가입하기"
            )}
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">이미 계정이 있나요?</span>
            <button
              onClick={() => nav('/login')}
              className="text-[#355074] font-semibold text-sm ml-2 hover:underline transition-colors"
            >
              로그인
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
