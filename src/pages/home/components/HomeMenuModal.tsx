
interface HomeMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onFaq: () => void;
  onLogout: () => void;
}

export default function HomeMenuModal({
  isOpen,
  onClose,
  onProfile,
  onSettings,
  onFaq,
  onLogout,
}: HomeMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="메뉴" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>메뉴</h3>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X aria-hidden />
          </button>
        </header>

        <ul>
          <li>
            <button type="button" onClick={onProfile}>
              
              <span>프로필</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={onSettings}>
              
              <span>설정</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={onFaq}>
              
              <span>자주 묻는 질문</span>
            </button>
          </li>
          <li>
            <button type="button">
              
              <div>
                <span>앱 정보</span>
                <p>버전 1.0.0</p>
              </div>
            </button>
          </li>
        </ul>

        <div>
          <button type="button" onClick={onLogout}>
            
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
}
