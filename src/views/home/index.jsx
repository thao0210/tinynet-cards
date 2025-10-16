import React, { useEffect, useState } from "react";
import styles from "./videos.module.scss";
import CardModal from "../../components/cardModal";

const TinyNetCards = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const baseUrl = import.meta.env.VITE_R2_BASE_URL;
  const videosUrl = import.meta.env.VITE_R2_VIDEOS_URL;

  // --- tạo danh sách video ---
  const videoArray = Array.from({ length: 40 }, (_, i) => ({
    id: `v${i + 1}`,
    type: "video",
    thumbUrl: `${baseUrl}/videos/v${i + 1}.webp`,
    videoUrl: `${videosUrl}/v${i + 1}.mp4`,
    duration: null,
    name: `v${i + 1}`,
  }));

  // --- tạo danh sách ảnh ---
  const imageArray = Array.from({ length: 64 }, (_, i) => ({
    id: `img${i + 1}`,
    type: "image",
    thumbUrl: `${baseUrl}/card-bg/${i + 1}.webp`,
    imageUrl: `${baseUrl}/card-bg/${i + 1}.webp`,
    name: `${i + 1}`,
  }));

  // --- merge lại ---
  const [cards, setCards] = useState([...videoArray, ...imageArray]);

  // --- load metadata video ---
  useEffect(() => {
    const loadMetadata = async () => {
      const updated = [...cards];
      await Promise.all(
        updated.map((item, idx) => {
          if (item.type !== "video") return Promise.resolve();
          return new Promise((resolve) => {
            const video = document.createElement("video");
            video.src = item.videoUrl;
            video.addEventListener("loadedmetadata", () => {
              updated[idx].duration = video.duration.toFixed(1);
              resolve();
            });
            video.addEventListener("error", () => resolve());
          });
        })
      );
      setCards(updated);
    };

    loadMetadata();
  }, []);

  const handlePrev = () => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : cards.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((i) => (i < cards.length - 1 ? i + 1 : 0));
  };

  const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <img src="/logo.svg" alt="logo" />
        <span>
          <small>TinyNet</small> Cards
        </span>
      </h1>

      <div className={styles.grid}>
        {cards.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.card} ${
              selectedIndex === index ? styles.active : ""
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <div className={styles.thumbWrap}>
              <img
                src={item.thumbUrl}
                alt={item.id}
                className={styles.thumb}
              />

              {/* Duration nếu là video */}
              {item.type === "video" && (
                <span className={styles.duration}>
                  {item.duration ? `${item.duration}s` : "..."}
                </span>
              )}

              {/* Overlay + icon */}
              <div className={styles.overlay}>
                <span className={styles.playIcon}>
                  {item.type === "video" ? "▶" : "＋"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardModal
          item={selectedCard}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default TinyNetCards;
