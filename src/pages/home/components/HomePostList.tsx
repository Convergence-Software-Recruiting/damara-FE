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

function mapStatus(raw: string | undefined): "open" | "closed" | "in_progress" | "completed" | "recruiting" {
  if (!raw) return "open";
  const recruiting = ["open", "recruiting", "RECRUITING", "AVAILABLE"];
  if (recruiting.includes(raw)) return "recruiting";
  if (raw === "closed" || raw === "RECRUIT_FULL" || raw === "SOLD_OUT") return "closed";
  if (raw === "completed" || raw === "COMPLETED") return "completed";
  if (raw === "in_progress" || raw === "PURCHASING" || raw === "DISTRIBUTING") return "in_progress";
  return "open";
}

export default function HomePostList({
  posts,
  sortBy,
  emptyText = "게시글이 없습니다.",
  onItemClick,
}: HomePostListProps) {
  const sorted = sortPosts(posts, sortBy);

  if (sorted.length === 0) {
    return (
      <div className="px-4 py-16 text-center text-[14px] text-[#9ca3af]" data-empty>
        {emptyText}
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {sorted.map((post) => (
        <li key={post.id}>
          <GroupBuyCard
            id={Number(post.id)}
            title={post.title}
            price={`${Math.floor(post.price ?? 0).toLocaleString()}원`}
            image={getFirstImage(post)}
            currentPeople={post.currentQuantity ?? 0}
            maxPeople={post.minParticipants ?? 2}
            location={post.pickupLocation || "명지대 캠퍼스"}
            status={mapStatus(post.status)}
            onClick={() => onItemClick(post.id)}
            groupBuyType={post.type ?? null}
            deadline={post.deadline ?? null}
            deadlineLabel={post.deadlineLabel ?? null}
            visualType={post.visualType ?? "default"}
            tags={post.tags}
            remainingQuantity={post.remainingQuantity ?? null}
            isReceiptVerified={post.isReceiptVerified ?? null}
          />
        </li>
      ))}
    </ul>
  );
}
