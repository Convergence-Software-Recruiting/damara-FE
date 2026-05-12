import bannerImage from "../../../assets/banner_1 1.png";

export default function HomeBanner() {
  return (
    <section aria-label="캠퍼스 공동구매 안내">
      <img
        src={bannerImage}
        alt="필요할 때, 함께 사면 더 이득! 명지대 캠퍼스 공동구매"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: 153,
          borderRadius: 16,
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </section>
  );
}
