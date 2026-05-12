import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import TradeTypeSheet, { type TradeType } from "./components/TradeTypeSheet";
import HomeBanner from "./components/HomeBanner";
import HomeCategoryChips from "./components/HomeCategoryChips";
import HomePopularList from "./components/HomePopularList";
import HomeSortTabs, { type SortKey } from "./components/HomeSortTabs";
import HomePostList from "./components/HomePostList";

import { ROUTES } from "../../app/router/routes";
import { HOME_CANVAS } from "../../shared/constants/homeTheme";

const DESIGN_POSTS = [
  {
    id: 4,
    title: "물티슈 공동구매",
    price: 5900,
    currentQuantity: 1,
    minParticipants: 3,
    pickupLocation: "명지대 정문앞",
    deadlineLabel: "4월 17일 (수)",
    type: "PRE_RECRUIT",
    status: "recruiting",
    visualType: "plus",
    tags: ["인기", "A형"],
  },
  {
    id: 3,
    title: "닥터유 단백질바 박스공구",
    price: 12000,
    currentQuantity: 2,
    minParticipants: 5,
    pickupLocation: "학생회관 2층",
    deadlineLabel: "4월 18일 (목)",
    type: "POST_PURCHASE",
    status: "recruiting",
    visualType: "bar",
    tags: ["B형"],
  },
];

const DESIGN_POPULAR_POSTS = [
  {
    id: 11,
    title: "ETERNAL MARKETING",
    price: 32,
    currentQuantity: 0,
    minParticipants: 2,
    icon: "▣",
  },
  {
    id: 12,
    title: "노트 구매하실분~",
    price: 2000,
    currentQuantity: 1,
    minParticipants: 4,
    icon: "▤",
  },
  {
    id: 13,
    title: "샴푸공동구매",
    price: 10000,
    currentQuantity: 1,
    minParticipants: 2,
    icon: "▮",
  },
];

export default function HomePage() {
  const nav = useNavigate();
  const [showTradeTypeSheet, setShowTradeTypeSheet] = useState(false);
  const [activeCategory, setActiveCategory] = useState("food");
  const [sortBy, setSortBy] = useState<SortKey>("latest");

  useEffect(() => {
    const handleOpenSheet = () => setShowTradeTypeSheet(true);
    window.addEventListener("openTradeTypeSheet", handleOpenSheet);
    return () => window.removeEventListener("openTradeTypeSheet", handleOpenSheet);
  }, []);

  const handleSelectTradeType = (type: TradeType) => {
    setShowTradeTypeSheet(false);
    nav(`/create?type=${type}`);
  };

  return (
    <div
      data-page="홈"
      style={{
        width: "100%",
        minHeight: "100dvh",
        overflowX: "hidden",
        backgroundColor: HOME_CANVAS,
      }}
    >
      <main style={{ width: "100%", overflowX: "hidden", backgroundColor: HOME_CANVAS }}>
        <div style={{ padding: "12px 16px 0" }}>
          <HomeBanner />
        </div>

        <div style={{ paddingTop: 4 }}>
          <HomeCategoryChips activeCategory={activeCategory} onChange={setActiveCategory} />
        </div>

        <HomePopularList
          posts={DESIGN_POPULAR_POSTS}
          onItemClick={(id) => nav(ROUTES.GROUP_BUY_DETAIL.replace(":id", String(id)))}
        />

        <div style={{ marginTop: 12, backgroundColor: HOME_CANVAS }}>
          <HomeSortTabs
            sortBy={sortBy}
            totalCount={4}
            onChange={setSortBy}
            onFilterClick={() => toast.message("필터는 곧 연결됩니다.")}
          />
        </div>

        <HomePostList
          posts={DESIGN_POSTS}
          sortBy={sortBy}
          onItemClick={(id) => nav(ROUTES.GROUP_BUY_DETAIL.replace(":id", String(id)))}
        />
      </main>

      <TradeTypeSheet
        isOpen={showTradeTypeSheet}
        onClose={() => setShowTradeTypeSheet(false)}
        onSelect={handleSelectTradeType}
      />
    </div>
  );
}
