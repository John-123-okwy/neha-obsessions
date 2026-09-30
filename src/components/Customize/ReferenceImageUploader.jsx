import { useState } from "react";
import { uploadImage } from "../../services/cloudinary";
import styles from "./ReferenceImageUploader.module.css";

export default function ReferenceImageUploader({ imageUrl, onUploaded, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      console.error("Reference image upload failed:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {imageUrl ? (
        <div className={styles.previewWrap}>
          <img src={imageUrl} alt="Reference" className={styles.preview} />
          <button type="button" className={styles.removeBtn} onClick={onRemove}>
            Remove
          </button>
        </div>
      ) : (
        <label className={styles.dropzone}>
          {uploading ? "Uploading…" : "Tap to upload a reference photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        </label>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}