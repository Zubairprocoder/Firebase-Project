import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const convertImageToBlob = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
};

export const uploadPNGToStorage = async (getStorage, blob, uid) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profileImages/${uid}.png`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};
