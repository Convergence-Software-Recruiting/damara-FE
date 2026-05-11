import type { ReactNode } from "react";

/**
 * React Query를 도입할 때를 대비한 placeholder.
 * 현재는 @tanstack/react-query 미설치 상태이므로 children만 그대로 전달한다.
 * 추후 도입 시 QueryClientProvider로 children을 감싼다.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
