import { useState } from "react";
import { uploadImage, getOptimizedUrl } from "../../services/cloudinary";
import styles from "./ImageUploader.module.css";

export default function ImageUploader({ imageUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e) {
    const file = e.target.files[0];
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
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.dropzone}>
        {uploading ? (
          <span className={styles.uploadingText}>Uploading…</span>
        ) : imageUrl ? (
          <img
            src={getOptimizedUrl(imageUrl, { width: 300, height: 225 })}
            alt="Product preview"
            className={styles.preview}
          />
        ) : (
          <span className={styles.placeholderText}>
            Tap to upload a photo
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}