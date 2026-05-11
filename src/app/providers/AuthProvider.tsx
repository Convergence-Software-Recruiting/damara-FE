import type { ReactNode } from "react";

/**
 * 토큰/유저 정보를 컨텍스트로 노출하는 Provider.
 * 1차 리팩토링에서는 기존 localStorage 흐름을 유지하기 위해
 * 별도의 상태 관리를 하지 않고 children만 그대로 전달한다.
 * 추후 토큰 갱신, 자동 로그아웃 등을 이 Provider에 위임할 수 있다.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
