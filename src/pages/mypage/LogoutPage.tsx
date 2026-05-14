import { LogOut, MessageCircle, PackageCheck } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../app/router/routes";
import { blue50, blue600, grey500, grey900 } from "../../shared/constants/homeTheme";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";
import { AccountServiceShell, bodyText, serviceCard } from "./AccountServiceShell";

export default function LogoutPage() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    nav(ROUTES.LOGIN, { replace: true });
  };

  return (
    <AccountServiceShell title="로그아웃" subtitle="이 기기에서 계정 연결을 해제해요.">
      <section style={{ ...serviceCard, padding: 18 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: blue50, color: blue600, display: "grid", placeItems: "center" }}>
          <LogOut size={24} />
        </div>
        <h2 style={{ margin: "16px 0 0", color: grey900, fontSize: 20, lineHeight: "28px", fontWeight: 900 }}>
          로그아웃할까요?
        </h2>
        <p style={{ ...bodyText, marginTop: 8 }}>
          다시 로그인하면 내 공구, 관심목록, 채팅 내역을 이어서 볼 수 있어요.
        </p>
      </section>

      <section style={{ ...serviceCard, marginTop: 12, padding: "14px 16px", display: "grid", gap: 12 }}>
        <Info icon={<PackageCheck size={17} />} text="진행 중인 공구는 그대로 유지돼요." />
        <Info icon={<MessageCircle size={17} />} text="채팅 내역은 계정에 저장돼요." />
      </section>

      <div style={{ display: "grid", gap: 8, marginTop: 18 }}>
        <button type="button" onClick={logout} style={primaryButton}>
          로그아웃
        </button>
        <button type="button" onClick={() => nav(-1)} style={ghostButton}>
          취소
        </button>
      </div>
    </AccountServiceShell>
  );
}

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, color: grey500, fontSize: 12.5, lineHeight: "18px", fontWeight: 650 }}>
      <span style={{ color: blue600 }}>{icon}</span>
      {text}
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  height: 48,
  border: 0,
  borderRadius: 10,
  background: "#3182f6",
  color: "#fff",
  fontSize: 15,
  fontWeight: 850,
  cursor: "pointer",
};

const ghostButton: React.CSSProperties = {
  height: 46,
  border: 0,
  borderRadius: 10,
  background: "transparent",
  color: grey500,
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
};
