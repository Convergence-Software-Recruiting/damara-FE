import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/router/routes";

interface BottomTabBarProps {
  className?: string;
}

const TABS = [
  { id: ROUTES.HOME, label: "홈" },
  { id: ROUTES.CATEGORY, label: "카테고리" },
  { id: ROUTES.CHAT, label: "채팅" },
  { id: ROUTES.MYPAGE, label: "마이페이지" },
];

export default function BottomTabBar({ className }: BottomTabBarProps) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto ${className ?? ""}`}
    >
      <div className="flex justify-around items-center h-16">
        {TABS.map((tab) => {
          const active = pathname === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => nav(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full"
              data-active={active ? "true" : "false"}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
