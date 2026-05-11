import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GroupBuyTypeBadge } from "../../features/group-buy/components/GroupBuyBadge";
import { Badge } from "../../shared/components/ui/badge";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shared/components/ui/dropdown-menu";
import {
  getPostDetail,
  deletePost,
  updatePost,
  checkParticipation,
  participatePost,
  cancelParticipation,
  addFavorite,
  checkFavorite,
  removeFavorite,
  updatePostStatus,
} from "../../features/group-buy/api/groupBuyApi";
import { getChatRoomByPostId } from "../../features/chat/api/chatApi";
import { getImageUrl } from "../../shared/utils/imageUrl";
import { toast } from "sonner";
import TrustInfoCard from "../../features/group-buy/components/TrustInfoCard";
import TradeMethodCard from "../../features/group-buy/components/TradeMethodCard";
import AgreementPolicyCard from "../../features/group-buy/components/AgreementPolicyCard";
import ExceptionNoticeCard from "../../features/group-buy/components/ExceptionNoticeCard";
import ParticipationConfirmModal from "../../features/group-buy/components/ParticipationConfirmModal";
import { getEnhancedData } from "../../features/group-buy/utils/enhancedPostMapper";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

const STATUS_LIST = [
  { value: "open", label: "모집중" },
  { value: "closed", label: "모집완료" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "거래완료" },
];

function getStatusLabel(value?: string) {
  return STATUS_LIST.find((s) => s.value === value)?.label || "모집중";
}

export default function GroupBuyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [isParticipant, setIsParticipant] = useState(false);
  const [participating, setParticipating] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [openingChat, setOpeningChat] = useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false);

  const currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getPostDetail(id);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!id || !currentUserId) return;
      try {
        const res = await checkParticipation(id, currentUserId);
        setIsParticipant(res.data.isParticipant);
      } catch (err) {
        console.error(err);
      }
    };
    checkStatus();
  }, [id, currentUserId]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!id || !currentUserId) return;
      try {
        const res = await checkFavorite(id, currentUserId);
        setIsFavorite(res.data.isFavorite);
      } catch (err) {
        console.error(err);
      }
    };
    checkFavoriteStatus();
  }, [id, currentUserId]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  const handleParticipate = async () => {
    if (!id || !currentUserId) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    try {
      setParticipating(true);
      await participatePost(id, currentUserId);
      setIsParticipant(true);
      setShowParticipationModal(false);
      setPost((prev: any) => ({
        ...prev,
        currentQuantity: (prev.currentQuantity ?? 0) + 1,
      }));
      toast.success("참여가 완료되었습니다.");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        toast.error("이미 참여했거나 작성자는 참여할 수 없습니다.");
      } else {
        toast.error("참여에 실패했습니다.");
      }
    } finally {
      setParticipating(false);
    }
  };

  const handleCancelParticipation = async () => {
    if (!id || !currentUserId) return;
    if (!confirm("참여를 취소하시겠습니까?")) return;
    try {
      setParticipating(true);
      await cancelParticipation(id, currentUserId);
      setIsParticipant(false);
      setPost((prev: any) => ({
        ...prev,
        currentQuantity: Math.max((prev.currentQuantity ?? 1) - 1, 0),
      }));
      toast.success("참여가 취소되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("참여 취소에 실패했습니다.");
    } finally {
      setParticipating(false);
    }
  };

  const handleReportPost = () => {
    toast.info("신고 기능은 준비 중입니다.");
  };

  const startEditing = () => {
    setEditTitle(post.title || "");
    setEditPrice(String(post.price) || "");
    if (post.deadline) {
      const date = new Date(post.deadline);
      setEditDeadline(date.toISOString().slice(0, 16));
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!id) return;
    if (!editTitle || !editPrice || !editDeadline) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      const originalImageUrls =
        post.images
          ?.map((img: any) => img.imageUrl || img.url)
          .filter(Boolean) || [];

      const isoDeadline = new Date(editDeadline).toISOString();

      const updateData: any = {
        title: editTitle.trim(),
        price: Number(editPrice),
        deadline: isoDeadline,
        images: originalImageUrls,
        content: post?.content || editTitle.trim() || "",
        pickupLocation: post?.pickupLocation || "",
      };
      if (post?.minParticipants !== undefined && post?.minParticipants !== null) {
        updateData.minParticipants = Number(post.minParticipants);
      }
      if (post?.category) {
        updateData.category = post.category;
      }

      await updatePost(id, updateData);

      setPost((prev: any) => ({
        ...prev,
        title: editTitle,
        price: Number(editPrice),
        deadline: editDeadline,
      }));

      setIsEditing(false);
      toast.success("수정되었습니다.");
    } catch (err: any) {
      console.error("수정 오류:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      toast.error(`수정에 실패했습니다: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      setDeleting(true);
      await deletePost(id);
      toast.success("게시글이 삭제되었습니다.");
      nav("/home");
    } catch (err) {
      console.error(err);
      toast.error("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleFavorite = async () => {
    if (!id || !currentUserId) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    try {
      setFavoriteLoading(true);
      if (newFavoriteState) {
        await addFavorite(id, currentUserId);
      } else {
        await removeFavorite(id, currentUserId);
      }
    } catch (err: any) {
      console.error("관심 등록/해제 실패:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !currentUserId) return;
    try {
      setStatusLoading(true);
      setShowStatusDropdown(false);
      await updatePostStatus(id, newStatus as any, currentUserId);
      setPost((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      console.error("상태 변경 실패:", err);
      if (err.response?.status === 403) {
        toast.error("작성자만 상태를 변경할 수 있습니다.");
      } else {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "상태 변경에 실패했습니다.";
        toast.error(errorMessage);
      }
    } finally {
      setStatusLoading(false);
    }
  };

  const handleOpenChat = async () => {
    if (!id || !currentUserId) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    try {
      setOpeningChat(true);
      const res = await getChatRoomByPostId(id);
      const chatRoomId = res.data.id || res.data.chatRoomId;
      if (chatRoomId) {
        nav(`/chat?roomId=${chatRoomId}`);
      } else {
        nav("/chat");
      }
    } catch (err: any) {
      console.error("채팅방 열기 실패:", err);
      if (err.response?.status === 404) {
        toast.error("게시글을 찾을 수 없습니다.");
      } else {
        toast.error("채팅방을 열 수 없습니다.");
      }
    } finally {
      setOpeningChat(false);
    }
  };

  if (loading) {
    return <div data-state="loading">불러오는 중...</div>;
  }

  if (error || !post) {
    return (
      <div data-state="error">
        <p>{error || "게시글을 찾을 수 없습니다."}</p>
        <Button type="button" onClick={() => nav("/home")}>
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  const isOwner = currentUserId && post?.authorId === currentUserId;
  const imageUrls =
    post?.images
      ?.map((img: any) => getImageUrl(img?.imageUrl))
      .filter(Boolean) || [];
  const currentImageUrl = imageUrls[currentImageIndex] || null;
  const isRecruitmentComplete =
    (post?.currentQuantity ?? 0) >= (post?.minParticipants ?? 2);
  const enhanced = getEnhancedData(post.id);

  return (
    <div data-page="공구 상세">
      <p>공구 상세</p>

      <button type="button" onClick={()=>nav(-1)} />
      {post && (
        <ParticipationConfirmModal
          isOpen={showParticipationModal}
          data={enhanced}
          postTitle={post.title}
          onClose={() => setShowParticipationModal(false)}
          onConfirm={handleParticipate}
          isLoading={participating}
        />
      )}
    </div>
  );
}