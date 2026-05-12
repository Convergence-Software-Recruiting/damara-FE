import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../shared/api/uploadApi";
import { createPost } from "../../features/group-buy/api/groupBuyApi";
import { getImageUrl } from "../../shared/utils/imageUrl";
import { toast } from "sonner";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

export default function GroupBuyCreatePage() {
  const nav = useNavigate();

  const [images, setImages] = useState<{ preview: string; url: string }[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [people, setPeople] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSelectFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      toast.error("이미지는 최대 5개까지 업로드할 수 있습니다.");
      return;
    }

    const preview = URL.createObjectURL(file);
    const tempIndex = images.length;
    setImages((prev) => [...prev, { preview, url: "" }]);

    try {
      setLoading(true);
      const res = await uploadImage(file);
      const imageUrl = getImageUrl(res.url);
      setImages((prev) =>
        prev.map((img, i) =>
          i === tempIndex ? { ...img, url: imageUrl } : img
        )
      );
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      toast.error("이미지 업로드 실패");
      setImages((prev) => prev.filter((_, i) => i !== tempIndex));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (images.length === 0) {
      toast.error("이미지를 최소 1개 이상 업로드해주세요.");
      return;
    }
    if (!title || !price || !deadline || !location || !people) {
      toast.error("필수 값을 모두 입력해주세요.");
      return;
    }

    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      nav("/");
      return;
    }

    try {
      setLoading(true);
      const imageUrls = images.map((img) => img.url).filter((url) => url);

      await createPost({
        title,
        content: description || title,
        price: Number(price),
        minParticipants: Number(people),
        deadline,
        pickupLocation: location,
        authorId: userId,
        images: imageUrls,
        category: category || "etc",
      });

      toast.success("게시글이 등록되었습니다.");
      nav("/home");
    } catch (err) {
      console.error(err);
      toast.error("게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-page="공구 등록">
      <p>공구 등록</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" multiple onChange={handleSelectFile} />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" value={people} onChange={(e) => setPeople(e.target.value)} />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" disabled={loading} />
      </form>
    </div>
  );
}
