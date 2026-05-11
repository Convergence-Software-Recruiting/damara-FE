import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/ui/button";
import { registerUser, loginUser } from "../../features/auth/api/authApi";
import { toast } from "sonner";
import { getAuthErrorMessage } from "../../shared/utils/apiError";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function SignupPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !nickname || !studentId) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const registerResponse = await registerUser({
        email,
        passwordHash: password,
        nickname,
        studentId,
        department: department || undefined,
      });

      console.log("회원가입 성공:", registerResponse.data);

      try {
        const loginResponse = await loginUser(studentId, password);
        const userData = loginResponse.data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.USER_ID, userData.id);
        console.log("자동 로그인 성공:", userData);
        nav("/home");
      } catch (loginErr) {
        console.log("자동 로그인 실패, 로그인 페이지로 이동");
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
    <div data-page="회원가입">
      <p>회원가입</p>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
        <input type="text" value={nickname} onChange={e=>setNickname(e.target.value)} />
        <input type="text" value={studentId} onChange={e=>setStudentId(e.target.value)} />
        <input type="text" value={department} onChange={e=>setDepartment(e.target.value)} />
        <button type="submit" disabled={isLoading} />
      </form>
      <button type="button" onClick={()=>nav("/login")} />
    </div>
  );
}