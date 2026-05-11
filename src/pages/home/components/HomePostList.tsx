import React from "react";
import GroupBuyCard from "../../../features/group-buy/components/GroupBuyCard";
import type { SortKey } from "./HomeSortTabs";

interface HomePostListProps {
  posts: any[];
  sortBy?: SortKey;
  emptyText?: string;
  onItemClick: (id: number | string) => void;
}

function getFirstImage(post: any): string {
  const firstImage = post.images?.[0];
  return (
    (typeof firstImage === "string" ? firstImage : undefined) ||
    firstImage?.imageUrl ||
    firstImage?.url ||
    post.image ||
    "/placeholder.png"
  );
}

function sortPosts(posts: any[], sortBy?: SortKey): any[] {
  if (!sortBy) return posts;
  const arr = [...posts];
  arr.sort((a, b) => {
    if (sortBy === "deadline") {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    }
    if (sortBy === "popular") {
      return (b.currentQuantity ?? 0) - (a.currentQuantity ?? 0);
    }
    return (b.id ?? 0) - (a.id ?? 0);
  });
  return arr;
}

export default function HomePostList({
  posts,
  sortBy,
  emptyText = "게시글이 없습니다.",
  onItemClick,
}: HomePostListProps) {
  const sorted = sortPosts(posts, sortBy);

  if (sorted.length === 0) {
    return <div data-empty>{emptyText}</div>;
  }

  return (
    <ul>
      {sorted.map((post) => (
        <li key={post.id}>
          <GroupBuyCard
            id={post.id}
            title={post.title}
            price={`${Math.floor(post.price ?? 0).toLocaleString()}원`}
            image={getFirstImage(post)}
            currentPeople={post.currentQuantity ?? 0}
            maxPeople={post.minParticipants ?? 2}
            location={post.pickupLocation || "명지대 캠퍼스"}
            status={post.status || "open"}
            onClick={() => onItemClick(post.id)}
            groupBuyType={post.type ?? null}
            deadline={post.deadline ?? null}
            remainingQuantity={post.remainingQuantity ?? null}
            isReceiptVerified={post.isReceiptVerified ?? null}
          />
        </li>
      ))}
    </ul>
  );
}
