import { Bell, ChevronRight, Megaphone, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import ListRow from "../../shared/components/damara/ListRow";
import { blue500, green600, grey400, grey500, orange500 } from "../../shared/constants/homeTheme";
import { AccountServiceShell, bodyText, sectionTitle, serviceCard, softInfoBox } from "./AccountServiceShell";

const notices = [
  {
    title: "Damara 베타 서비스 오픈",
    date: "2026.05.14",
    icon: <Sparkles size={18} color={blue500} />,
    desc: "명지대 캠퍼스 공동구매를 더 쉽게 등록하고 참여할 수 있어요.",
  },
  {
    title: "안전거래 가이드 업데이트",
    date: "2026.05.10",
    icon: <ShieldCheck size={18} color={green600} />,
    desc: "수령 장소, 채팅 확인, 마감 후 취소 기준을 정리했어요.",
  },
  {
    title: "생활용품 배너 이벤트 안내",
    date: "2026.05.02",
    icon: <Megaphone size={18} color={orange500} />,
    desc: "인기 생활용품 공구를 모아볼 수 있는 홈 배너가 추가됐어요.",
  },
];

export default function NoticePage() {
  return (
    <AccountServiceShell title="공지사항" subtitle="서비스 소식과 운영 안내를 확인해요.">
      <div style={softInfoBox}>
        중요한 거래 정책이나 캠퍼스 수령 안내가 생기면 이곳에서 먼저 알려드릴게요.
      </div>

      <h2 style={sectionTitle}>최근 소식</h2>
      <div style={serviceCard}>
        {notices.map((notice, index) => (
          <ListRow
            key={notice.title}
            compact
            left={<span style={{ width: 32, height: 32, borderRadius: 10, background: "#f2f7ff", display: "grid", placeItems: "center" }}>{notice.icon}</span>}
            title={notice.title}
            description={notice.desc}
            right={<ChevronRight size={15} color={grey400} />}
            showDivider={index !== notices.length - 1}
            onClick={() => toast.message("공지 상세는 준비 중이에요.")}
          />
        ))}
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, color: grey500 }}>
        <Bell size={15} />
        <p style={{ ...bodyText, color: grey500, fontSize: 12 }}>
          최근 공지 기준으로 업데이트돼요.
        </p>
      </div>
    </AccountServiceShell>
  );
}
