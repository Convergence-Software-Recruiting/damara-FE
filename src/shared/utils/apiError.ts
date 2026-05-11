import axios from "axios";

type AuthMode = "login" | "register";

const REGISTER_DUPLICATE_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다.",
  STUDENT_ID_ALREADY_EXISTS: "이미 등록된 학번입니다.",
};

export function getAuthErrorMessage(error: unknown, mode: AuthMode): string {
  if (!axios.isAxiosError(error)) {
    return mode === "login"
      ? "로그인에 실패했습니다. 다시 시도해주세요."
      : "회원가입에 실패했습니다. 다시 시도해주세요.";
  }

  // 요청은 보냈지만 응답이 없는 경우 (CORS, 네트워크 단절, Mixed Content 등)
  if (!error.response) {
    return "서버에 연결할 수 없습니다. 네트워크 또는 서버 상태를 확인해주세요.";
  }

  const { status, data } = error.response;
  const errorCode =
    typeof data === "object" && data && "error" in data
      ? String((data as { error?: unknown }).error ?? "")
      : "";

  if (mode === "login") {
    if (status === 401) return "학번 또는 비밀번호가 올바르지 않습니다.";
    if (status === 400) return "입력 형식이 올바르지 않습니다.";
    if (status >= 500) return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    return "로그인에 실패했습니다. 다시 시도해주세요.";
  }

  if (status === 409) {
    return REGISTER_DUPLICATE_MESSAGES[errorCode] ?? "이미 존재하는 계정입니다.";
  }
  if (status === 400) return "입력 형식이 올바르지 않습니다.";
  if (status >= 500) return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  return "회원가입에 실패했습니다. 다시 시도해주세요.";
}
