import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Convert any image URL -> PNG Blob safely
export const convertImageToBlob = async (url) => {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);

  return await new Promise((resolve) =>
    canvas.toBlob((pngBlob) => resolve(pngBlob), "image/png")
  );
};

// Upload PNG to Storage
export const uploadPNGToStorage = async (pngBlob, uid) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profileImages/${uid}.png`);

  await uploadBytes(storageRef, pngBlob);
  return await getDownloadURL(storageRef);
};
