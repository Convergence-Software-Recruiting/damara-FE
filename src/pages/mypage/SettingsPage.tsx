import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const nav = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [notifStatus, setNotifStatus] = useState(true);
  const [notifPrice, setNotifPrice] = useState(true);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifComplete, setNotifComplete] = useState(true);
  const [notifOutOfStock, setNotifOutOfStock] = useState(true);
  const [notifAgreement, setNotifAgreement] = useState(true);
  const [notifSanction, setNotifSanction] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    if (showPrivacyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPrivacyModal]);

  return (
    <div data-page="설정">
      <p>설정</p>
    </div>
  );
}