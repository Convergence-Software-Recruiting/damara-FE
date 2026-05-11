import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryPage() {
  const nav = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <div data-page="카테고리">
      <p>카테고리</p>
    </div>
  );
}