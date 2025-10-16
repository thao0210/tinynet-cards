import { useEffect, useRef, useState } from "react";
import styles from "./textBox.module.scss";
import {
  Type,
  Bold,
  Italic,
  Palette,
  X,
  Copy,
} from "lucide-react";

const EditableText = ({
  initialText = "Your text here",
  x = "50%",
  y = "80%",
  fontSize = 28,
  color = "#fff",
  fontFamily = "Poppins",
  onChange,
  name,
  readOnly = false,
}) => {
  const [text, setText] = useState(initialText);
  const [showToolbar, setShowToolbar] = useState(false);
  const [openPopup, setOpenPopup] = useState(null);
  const [style, setStyle] = useState({
    x,
    y,
    fontSize,
    color,
    fontFamily,
    fontWeight: "normal",
    fontStyle: "normal",
  });

  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Emit change
  useEffect(() => {
    onChange?.({ text, ...style });
  }, [text, style]);

  // Khởi tạo text content
  useEffect(() => {
    setText(initialText);
    if (textRef.current) textRef.current.textContent = initialText;
  }, [initialText]);

  // Hide toolbar khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowToolbar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (!wrapperRef.current?.contains(e.target)) {
        setOpenPopup(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyStyle = (prop, value) => {
    setStyle((prev) => ({ ...prev, [prop]: value }));
  };

  const toggleBold = () =>
    applyStyle("fontWeight", style.fontWeight === "bold" ? "normal" : "bold");
  const toggleItalic = () =>
    applyStyle("fontStyle", style.fontStyle === "italic" ? "normal" : "italic");

  // 🟢 Kéo thả — tương thích mobile
  const handlePointerDown = (e) => {
    if (readOnly) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX,
      y: e.clientY,
      startX: parseFloat(style.x),
      startY: parseFloat(style.y),
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (readOnly || !dragging.current) return;
    if (!dragging.current) return;
    const dx = e.clientX - offset.current.x;
    const dy = e.clientY - offset.current.y;

    // Tính theo phần trăm viewport
    const newX = offset.current.startX + (dx / window.innerWidth) * 100;
    const newY = offset.current.startY + (dy / window.innerHeight) * 100;

    setStyle((prev) => ({
      ...prev,
      x: `${Math.min(Math.max(newX, 0), 100)}%`,
      y: `${Math.min(Math.max(newY, 0), 100)}%`,
    }));
  };

  const handlePointerUp = (e) => {
    if (readOnly) return;
    dragging.current = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  // 🧩 Copy link card
  const handleCopy = () => {
    if (readOnly) return;
    // ép sync text mới nhất từ DOM
    const latestText = textRef.current?.textContent || text;
    const config = { text: latestText, ...style };

    // Encode Unicode-safe Base64
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    const url = `${window.location.origin}/${name}/${encoded}`;

    navigator.clipboard.writeText(url)
        .then(() => alert("Card link copied!"))
        .catch((err) => console.error("Copy failed", err));
    };

  return (
    <div
      ref={wrapperRef}
      className={styles.textWrapper}
      style={{
        top: style.y,
        left: style.x,
        transform: "translate(-50%, -50%)",
        cursor: readOnly ? "default" : "move",
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!readOnly) setShowToolbar(true);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {!readOnly && showToolbar && (
        <div className={styles.toolbar}>
            {/* Bold */}
            <button
            className={style.fontWeight === "bold" ? styles.active : ""}
            onClick={toggleBold}
            >
            <Bold size={16} />
            </button>

            {/* Italic */}
            <button
            className={style.fontStyle === "italic" ? styles.active : ""}
            onClick={toggleItalic}
            >
            <Italic size={16} />
            </button>

            {/* Font */}
            <div className={styles.popupWrapper}>
            <button onClick={() => setOpenPopup(openPopup === "font" ? null : "font")}>
                <Type size={16} />
            </button>
            {openPopup === "font" && (
                <div className={styles.popupBox}>
                <div className={styles.arrow}></div>
                <select
                    onChange={(e) => applyStyle("fontFamily", e.target.value)}
                    value={style.fontFamily}
                >
                    <option>Arial</option>
                    <option>Poppins</option>
                    <option>Georgia</option>
                    <option>Courier New</option>
                </select>
                </div>
            )}
            </div>

            {/* Font size */}
            <div className={styles.popupWrapper}>
            <button onClick={() => setOpenPopup(openPopup === "size" ? null : "size")}>
                <span style={{ fontSize: "12px" }}>A</span>
            </button>
            {openPopup === "size" && (
                <div className={styles.popupBox}>
                <div className={styles.arrow}></div>
                <input
                    type="number"
                    min="10"
                    max="100"
                    value={style.fontSize}
                    onChange={(e) => applyStyle("fontSize", Number(e.target.value))}
                />
                </div>
            )}
            </div>

            {/* Color */}
            <div className={styles.popupWrapper}>
            <button onClick={() => setOpenPopup(openPopup === "color" ? null : "color")}>
                <Palette size={16} />
            </button>
            {openPopup === "color" && (
                <div className={styles.popupBox}>
                <div className={styles.arrow}></div>
                <input
                    type="color"
                    value={style.color}
                    onChange={(e) => applyStyle("color", e.target.value)}
                />
                </div>
            )}
            </div>

            {/* Copy */}
            <button onClick={handleCopy}>
            <Copy size={16} />
            </button>

            {/* Close */}
            <button onClick={() => setShowToolbar(false)}>
            <X size={16} />
            </button>
        </div>
        )}


      <div
        ref={textRef}
        className={styles.editableDiv}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
            fontFamily: style.fontFamily,
            fontSize: `${style.fontSize}px`,
            color: style.color,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            cursor: readOnly ? "default" : "move",
        }}
        onInput={(e) => setText(e.currentTarget.textContent)}
        onBlur={() => {
            setText(textRef.current?.textContent || "");
        }}
        />
    </div>
  );
};

export default EditableText;
