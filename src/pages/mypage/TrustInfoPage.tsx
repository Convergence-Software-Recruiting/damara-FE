import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function TrustInfoPage() {
  const nav = useNavigate();

  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  // TODO: 실제 신뢰 정보 API 연동 예정
  const trustInfo = {
    score: 86,
    completedTradeCount: 12,
    responseRate: 92,
    noShowCount: 0,
    cancelCount: 1,
    verificationStatus: "학교 인증 완료",
    trustLevel: "신뢰 우수",
  };

  const stats = [
    {
      label: "거래 완료",
      value: trustInfo.completedTradeCount + "건",
      desc: "완료한 공동구매 건수",
      Icon: CheckCircle,
    },
    {
      label: "응답률",
      value: trustInfo.responseRate + "%",
      desc: "채팅 응답 비율",
      Icon: MessageSquare,
    },
    {
      label: "노쇼",
      value: trustInfo.noShowCount + "건",
      desc: "약속 미이행 기록",
      Icon: BadgeCheck,
    },
    {
      label: "취소",
      value: trustInfo.cancelCount + "건",
      desc: "거래 취소 내역",
      Icon: AlertTriangle,
    },
  ];

  return (
    <div data-page="신뢰 정보">
      <p>신뢰 정보</p>
    </div>
  );
}