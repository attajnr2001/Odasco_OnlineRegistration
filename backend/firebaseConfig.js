// backend/firebaseConfig.js
import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "./utils/shsreg-bb2a1-firebase-adminsdk-wzyp7-632007a974.json",
      import.meta.url
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const storage = admin.storage();

export default admin;
