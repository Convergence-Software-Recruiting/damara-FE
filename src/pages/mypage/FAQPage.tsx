import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

import ListRow from "../../shared/components/damara/ListRow";
import { blue500, grey400, grey700, grey900, HOME_BORDER } from "../../shared/constants/homeTheme";
import { AccountServiceShell, bodyText, sectionTitle, serviceCard, softInfoBox } from "./AccountServiceShell";

const faqItems = [
  {
    question: "Damara는 어떤 서비스인가요?",
    answer: "명지대 학생들이 생활용품, 먹거리, 뷰티 상품 등을 함께 구매할 사람을 모으고 캠퍼스에서 안전하게 수령할 수 있도록 돕는 공동구매 서비스예요.",
  },
  {
    question: "공구 참여는 어떻게 하나요?",
    answer: "공구 상세 화면에서 모집 인원, 수령 장소, 마감일을 확인한 뒤 참여하기를 누르면 돼요. 이후 판매자와 채팅으로 수령 시간과 결제 정보를 확인할 수 있어요.",
  },
  {
    question: "참여 취소가 가능한가요?",
    answer: "마감 전에는 상세 화면에서 참여 취소가 가능해요. 다만 마감 후에는 구매가 진행될 수 있어 채팅으로 판매자에게 먼저 문의해 주세요.",
  },
  {
    question: "직접 공구를 등록할 수 있나요?",
    answer: "홈 하단 가운데 + 버튼을 눌러 상품 정보, 모집 조건, 수령 장소, 상세 설명을 차례대로 입력하면 공구를 등록할 수 있어요.",
  },
  {
    question: "문제가 생기면 어디로 문의하나요?",
    answer: "거래 중 문제는 먼저 채팅으로 조율해 주세요. 해결이 어렵다면 공지사항의 고객 지원 안내를 확인하거나 support@damara.kr로 문의할 수 있어요.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <AccountServiceShell title="FAQ" subtitle="자주 묻는 질문을 빠르게 확인해요.">
      <div style={softInfoBox}>
        거래 전 수령 장소와 마감일을 꼭 확인하면 대부분의 문제를 줄일 수 있어요.
      </div>

      <h2 style={sectionTitle}>자주 묻는 질문</h2>
      <div style={serviceCard}>
        {faqItems.map((item, index) => {
          const open = openIndex === index;
          return (
            <div key={item.question} style={{ borderTop: index === 0 ? 0 : `1px solid ${HOME_BORDER}` }}>
              <ListRow
                compact
                left={<HelpCircle size={18} color={open ? blue500 : grey400} />}
                title={item.question}
                right={open ? <ChevronUp size={17} color={grey400} /> : <ChevronDown size={17} color={grey400} />}
                showDivider={false}
                onClick={() => setOpenIndex(open ? -1 : index)}
              />
              {open ? (
                <p style={{ ...bodyText, padding: "0 16px 15px 44px", color: grey700 }}>
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <p style={{ margin: "14px 2px 0", color: grey900, fontSize: 12, lineHeight: "18px", fontWeight: 700 }}>
        더 필요한 내용은 계속 추가해둘게요.
      </p>
    </AccountServiceShell>
  );
}
