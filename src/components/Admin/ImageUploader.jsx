import { useState } from "react";
import { uploadImage, getOptimizedUrl } from "../../services/cloudinary";
import styles from "./ImageUploader.module.css";

export default function ImageUploader({ imageUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [localPreview, setLocalPreview] = useState(null);

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    e.target.value = ""; // allows selecting the same file again later if needed

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setError("");
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const previewSrc = imageUrl ? getOptimizedUrl(imageUrl, { width: 300, height: 225 }) : localPreview;

  return (
    <div className={styles.wrapper}>
      <label className={styles.dropzone}>
        {uploading ? (
          <span className={styles.uploadingText}>Uploading…</span>
        ) : previewSrc ? (
          <img src={previewSrc} alt="Product preview" className={styles.preview} />
        ) : (
          <span className={styles.placeholderText}>Tap to upload a photo</span>
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