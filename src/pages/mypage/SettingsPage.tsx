import { useState } from "react";
import type React from "react";
import { Bell, ChevronRight, FileText, Moon, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";

import ListRow from "../../shared/components/damara/ListRow";
import { blue500, grey400, grey500, grey900, HOME_BORDER } from "../../shared/constants/homeTheme";
import { AccountServiceShell, bodyText, sectionTitle, serviceCard } from "./AccountServiceShell";

export default function SettingsPage() {
  const [pushOn, setPushOn] = useState(true);
  const [quietOn, setQuietOn] = useState(false);

  return (
    <AccountServiceShell title="설정" subtitle="알림과 앱 환경을 관리해요.">
      <h2 style={{ ...sectionTitle, marginTop: 0 }}>알림</h2>
      <div style={serviceCard}>
        <SettingToggle
          icon={<Bell size={18} color={blue500} />}
          title="공구 알림"
          desc="참여한 공구의 마감, 수령, 채팅 알림"
          checked={pushOn}
          onChange={() => setPushOn((value) => !value)}
        />
        <SettingToggle
          icon={<Moon size={18} color={blue500} />}
          title="방해 금지"
          desc="밤 11시부터 아침 8시까지 조용히 받기"
          checked={quietOn}
          onChange={() => setQuietOn((value) => !value)}
          last
        />
      </div>

      <h2 style={sectionTitle}>서비스 정보</h2>
      <div style={serviceCard}>
        <ListRow
          compact
          left={<Shield size={18} color="#333d4b" />}
          title="개인정보 처리방침"
          right={<ChevronRight size={15} color={grey400} />}
          onClick={() => toast.message("개인정보 처리방침 전문은 준비 중이에요.")}
        />
        <ListRow
          compact
          left={<FileText size={18} color="#333d4b" />}
          title="서비스 이용약관"
          right={<ChevronRight size={15} color={grey400} />}
          onClick={() => toast.message("이용약관 전문은 준비 중이에요.")}
        />
        <ListRow
          compact
          left={<Smartphone size={18} color="#333d4b" />}
          title="앱 버전"
          description="Damara 1.0.0"
          right={<span style={{ color: grey500, fontSize: 12, fontWeight: 700 }}>최신</span>}
          showDivider={false}
        />
      </div>

      <p style={{ ...bodyText, margin: "14px 2px 0", color: grey500 }}>
        지금 설정은 이 기기에만 적용돼요.
      </p>
    </AccountServiceShell>
  );
}

function SettingToggle({
  icon,
  title,
  desc,
  checked,
  onChange,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: "100%",
        minHeight: 58,
        padding: "12px 16px",
        border: 0,
        borderBottom: last ? 0 : `1px solid ${HOME_BORDER}`,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ width: 32, height: 32, borderRadius: 10, background: "#f2f7ff", display: "grid", placeItems: "center", flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", color: grey900, fontSize: 13, lineHeight: "18px", fontWeight: 750 }}>{title}</span>
        <span style={{ display: "block", marginTop: 2, color: grey500, fontSize: 11, lineHeight: "16px", fontWeight: 500 }}>{desc}</span>
      </span>
      <span
        aria-hidden
        style={{
          width: 42,
          height: 24,
          borderRadius: 999,
          background: checked ? blue500 : "#d1d6db",
          padding: 2,
          boxSizing: "border-box",
          transition: "150ms ease-out",
        }}
      >
        <span
          style={{
            display: "block",
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "#fff",
            transform: checked ? "translateX(18px)" : "translateX(0)",
            transition: "150ms ease-out",
            boxShadow: "0 1px 3px rgba(0,0,0,0.16)",
          }}
        />
      </span>
    </button>
  );
}
