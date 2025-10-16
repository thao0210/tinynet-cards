import React, { useEffect, useState } from "react";
import styles from "./videos.module.scss";
import VideoModal from "../../components/videoModal";

const TinyNetVideos = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const baseUrl = import.meta.env.VITE_R2_BASE_URL;
  const videosUrl = import.meta.env.VITE_R2_VIDEOS_URL;

  const videoImagesArray = Array.from(
    { length: 40 },
    (_, i) => `${baseUrl}/videos/v${i + 1}.webp`
  );

  const videoArray = Array.from({ length: 40 }, (_, i) => ({
    videoUrl: `${videosUrl}/v${i + 1}.mp4`,
    thumbUrl: videoImagesArray[i],
    duration: null,
  }));

  const [videos, setVideos] = useState(videoArray);

  useEffect(() => {
    const loadMetadata = async () => {
      const updated = [...videos];
      await Promise.all(
        updated.map((v, idx) => {
          return new Promise((resolve) => {
            const video = document.createElement("video");
            video.src = v.videoUrl;
            video.addEventListener("loadedmetadata", () => {
              updated[idx].duration = video.duration.toFixed(1);
              resolve();
            });
            video.addEventListener("error", () => resolve());
          });
        })
      );
      setVideos(updated);
    };

    loadMetadata();
  }, []);

  const handlePrev = () => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : videos.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((i) => (i < videos.length - 1 ? i + 1 : 0));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <img src="/logo.svg" alt="logo" />
        <span>
          <small>TinyNet</small>
          Cards
        </span>
      </h1>

      <div className={styles.grid}>
        {videos.map((v, index) => (
          <div
            key={index}
            className={`${styles.card} ${
              selectedIndex === index ? styles.active : ""
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <div className={styles.thumbWrap}>
              <img
                src={v.thumbUrl}
                alt={`thumb${index}`}
                className={styles.thumb}
              />
              <span className={styles.duration}>
                {v.duration ? `${v.duration}s` : "..."}
              </span>
              <div className={styles.overlay}>
                <span className={styles.playIcon}>▶</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <VideoModal
          video={videos[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default TinyNetVideos;
