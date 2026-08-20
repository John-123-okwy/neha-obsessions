const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Uploads a raw file (from an <input type="file">) to Cloudinary, returns the hosted URL
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}

// Rewrites a Cloudinary URL to request a resized, optimized, smart-cropped version
export function getOptimizedUrl(url, { width, height, crop = "fill" } = {}) {
  if (!url || !url.includes("/upload/")) return url;
  const transform = `w_${width},h_${height},c_${crop},g_auto,q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${transform}/`);
}