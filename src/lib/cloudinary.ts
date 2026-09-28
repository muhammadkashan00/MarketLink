import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(base64: string, folder = "marketlink"): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "image",
      transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto:good" }],
    });
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw new Error("Image upload failed");
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
  }
}

export default cloudinary;
