import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./Firebase";

/**
 * Uploads a File/Blob to Firebase Storage and returns download URL
 */
export async function uploadPNGToStorage(
  fileOrBlob,
  uid,
  fileName = "profile.png"
) {
  const path = `users/${uid}/${fileName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, fileOrBlob);
  const url = await getDownloadURL(storageRef);
  return url;
}

/**
 * Converts remote image URL to Blob
 */
export async function convertImageUrlToBlob(url) {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  return blob;
}
