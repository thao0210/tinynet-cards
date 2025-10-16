import { useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import { ChevronUp, ChevronDown } from "lucide-react";

const VideoModal = ({ video, onClose, onNext, onPrev }) => {
  const videoRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        const { videoWidth, videoHeight } = videoRef.current;
        setIsLandscape(videoWidth > videoHeight);
      });
    }
  }, [video]);

  if (!video) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={video.videoUrl}
          autoPlay
          loop
          playsInline
          className={`${styles.modalVideo} ${
            isLandscape ? styles.landscape : styles.portrait
          }`}
        />

        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={onPrev}>
            <ChevronUp />
          </button>
          <button className={styles.navBtn} onClick={onNext}>
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
