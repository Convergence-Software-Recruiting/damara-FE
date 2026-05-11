import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../shared/components/ui/avatar";
import {
  getPostsByStudentId,
  getParticipatedPosts,
} from "../../features/group-buy/api/groupBuyApi";
import { updateUser, deleteUser } from "../../features/user/api/userApi";
import { uploadImage } from "../../shared/api/uploadApi";
import { getImageUrl } from "../../shared/utils/imageUrl";
import { toast } from "sonner";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function MyPage() {
  const nav = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [myPostsCount, setMyPostsCount] = useState(0);
  const [participatedCount, setParticipatedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [updating, setUpdating] = useState(false);

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.studentId) {
          const myPostsRes = await getPostsByStudentId(user.studentId);
          setMyPostsCount(myPostsRes.data?.length || 0);
        }
        if (userId) {
          const participatedRes = await getParticipatedPosts(userId);
          setParticipatedCount(participatedRes.data?.length || 0);
        }
      } catch (err) {
        console.error("프로필 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.studentId]);

  const handleLogout = () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    nav("/login");
  };

  const openEditModal = () => {
    setEditNickname(user?.nickname || "");
    setEditDepartment(user?.department || "");
    setShowEditModal(true);
  };

  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return toast.error("로그인이 필요합니다.");

    if (!editNickname.trim()) {
      return toast.error("닉네임을 입력해주세요.");
    }

    try {
      setUpdating(true);
      await updateUser(userId, {
        nickname: editNickname.trim(),
        department: editDepartment.trim(),
      });

      const updatedUser = {
        ...user,
        nickname: editNickname.trim(),
        department: editDepartment.trim(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);

      setShowEditModal(false);
      toast.success("프로필이 수정되었습니다.");
    } catch (err: any) {
      console.error("프로필 수정 실패:", err);
      toast.error(
        err.response?.data?.message || "프로필 수정에 실패했습니다."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      setUploadingImage(true);
      const res = await uploadImage(file);
      const imageUrl = getImageUrl(res.url);

      await updateUser(userId, { avatarUrl: imageUrl });

      const updatedUser = { ...user, avatarUrl: imageUrl };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      toast.success("프로필 이미지가 변경되었습니다.");
    } catch (err) {
      console.error("프로필 이미지 업로드 실패:", err);
      toast.error("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return toast.error("로그인이 필요합니다.");

    if (
      !confirm(
        "정말 탈퇴하시겠습니까?\n\n등록한 게시글과 참여 정보가 모두 삭제됩니다.\n이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }
    if (!confirm("마지막 확인입니다.\n정말로 회원 탈퇴를 진행하시겠습니까?")) {
      return;
    }

    try {
      await deleteUser(userId);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      toast.success("회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
      nav("/login");
    } catch (err: any) {
      console.error("회원 탈퇴 실패:", err);
      toast.error(
        err.response?.data?.message || "회원 탈퇴에 실패했습니다."
      );
    }
  };

  return (
    <div data-page="마이페이지">
      <p>마이페이지</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:"none"}} id="mypage-img-upload" />
    </div>
  );
}