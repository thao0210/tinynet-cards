import { useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import { ChevronUp, ChevronDown } from "lucide-react";
import EditableText from "../textBox";

const CardModal = ({ item, onClose, onNext, onPrev }) => {
  const videoRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);

  // Nếu là item thì kiểm tra orientation
  useEffect(() => {
    if (item?.type === "item" && videoRef.current) {
      const handleLoaded = () => {
        const { videoWidth, videoHeight } = videoRef.current;
        setIsLandscape(videoWidth > videoHeight);
      };
      videoRef.current.addEventListener("loadedmetadata", handleLoaded);
      return () => {
        videoRef.current?.removeEventListener("loadedmetadata", handleLoaded);
      };
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Nếu là item thì hiển thị item, còn image thì hiển thị img */}
        {item.type === "video" ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            autoPlay
            loop
            playsInline
            className={`${styles.modalVideo} ${
              isLandscape ? styles.landscape : styles.portrait
            }`}
          />
        ) : (
          <img
            src={item.imageUrl || item.thumbUrl}
            alt="card background"
            className={`${styles.modalVideo} ${styles.imageMode}`}
          />
        )}

        {/* Editable text overlay */}
        <EditableText
          initialText="Your text here"
          x="50%"
          y="85%"
          fontSize={28}
          color="#fff"
          onChange={(t) => console.log("New text:", t)}
          name={item.name}
        />

        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Navigation buttons */}
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

export default CardModal;
