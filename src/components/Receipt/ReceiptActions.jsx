import { useState } from "react";
import { toPng } from "html-to-image";
import styles from "./ReceiptActions.module.css";

export default function ReceiptActions({ targetRef, fileName }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function generateImage() {
    if (!targetRef.current) return null;
    return toPng(targetRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
  }

  async function handleDownload() {
    setBusy(true);
    setNotice("");
    try {
      const dataUrl = await generateImage();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate receipt image:", err);
      setNotice("Couldn't generate the receipt image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    setBusy(true);
    setNotice("");
    try {
      const dataUrl = await generateImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${fileName}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Neha Obsessions Receipt",
          text: "Here's my order receipt from Neha Obsessions.",
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${fileName}.png`;
        link.click();
        setNotice("Sharing isn't supported on this device — the receipt was downloaded instead.");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to share receipt:", err);
        setNotice("Couldn't share the receipt. Please try downloading instead.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <button className={styles.downloadBtn} onClick={handleDownload} disabled={busy}>
          {busy ? "Please wait…" : "Download Receipt"}
        </button>
        <button className={styles.shareBtn} onClick={handleShare} disabled={busy}>
          Share
        </button>
      </div>
      {notice && <p className={styles.notice}>{notice}</p>}
    </div>
  );
}