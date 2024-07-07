// backend/firebaseConfig.js
import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "./shsreg-bb2a1-firebase-adminsdk-wzyp7-632007a974.json",
      import.meta.url
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "shsreg-bb2a1.appspot.com",
});

export const storage = admin.storage();

export default admin;
