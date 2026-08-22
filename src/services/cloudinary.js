const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured — check your environment variables.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "Image upload failed";
    console.error("Cloudinary upload error:", message);
    throw new Error(message);
  }

  return data.secure_url;
}

export function getOptimizedUrl(url, { width, height, crop = "fill" } = {}) {
  if (!url || !url.includes("/upload/")) return url;
  const transform = `w_${width},h_${height},c_${crop},g_auto,q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${transform}/`);
}