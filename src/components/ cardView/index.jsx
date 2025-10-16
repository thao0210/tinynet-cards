import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./cardView.module.scss";
import EditableText from "../textBox";
import { List } from "lucide-react";

const CardView = () => {
  const { cardId, code } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [config, setConfig] = useState(null);

  const baseUrl = import.meta.env.VITE_R2_BASE_URL;
  const videosUrl = import.meta.env.VITE_R2_VIDEOS_URL;

  const isVideoType = cardId.startsWith("v");
  const mediaUrl = isVideoType
    ? `${videosUrl}/${cardId}.mp4`
    : `${baseUrl}/card-bg/${cardId}.webp`;

  // decode code (nếu có)
  useEffect(() => {
    if (code) {
      try {
        const json = decodeURIComponent(escape(atob(code)));
        setConfig(JSON.parse(json));
      } catch (err) {
        console.error("Decode error", err);
      }
    }
  }, [code]);

  useEffect(() => {
    setIsVideo(isVideoType);
    if (isVideoType && videoRef.current) {
      const handleLoaded = () => {
        const { videoWidth, videoHeight } = videoRef.current;
        setIsLandscape(videoWidth > videoHeight);
      };
      videoRef.current.addEventListener("loadedmetadata", handleLoaded);
      return () =>
        videoRef.current?.removeEventListener("loadedmetadata", handleLoaded);
    }
  }, [cardId]);

  if (!cardId) return null;

  return (
    <div className={styles.page}>
        <button
            className={styles.closeBtn}
            onClick={() => navigate('/')}
            title="Back to list"
        >
            <List />
        </button>
      <div className={styles.cardContainer}>
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            autoPlay
            loop
            playsInline
            controls
            className={`${styles.media} ${
              isLandscape ? styles.landscape : styles.portrait
            }`}
          />
        ) : (
          <img src={mediaUrl} alt="Card" className={styles.media} />
        )}

        {config && (
          <EditableText
            initialText={config.text}
            x={config.x}
            y={config.y}
            fontSize={config.fontSize}
            color={config.color}
            fontFamily={config.fontFamily}
            fontWeight={config.fontWeight}
            fontStyle={config.fontStyle}
            textAlign={config.textAlign}
            name={cardId}
            readOnly={true}
          />
        )}
      </div>
    </div>
  );
};

export default CardView;
