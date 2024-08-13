import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

// Initialize Firebase Admin
initializeApp();

// Get the Firestore instance
const db = getFirestore();

// Cloud Function to send burst notification
export const sendBurstNotification = onCall((data, context) => {
  try {
    const { senderId, receiverId } = data.data;

    // Get the receiver's bursts page node
    const burstsRef = db.doc(`users/${receiverId}/bursts/${senderId}`);

    // Add the new burst notification to the receiver's bursts page
    burstsRef
      .set(data.data)
      .then(() => {
        return { success: true };
      })
      .catch((error) => {
        throw new HttpsError(
          "internal",
          "Error adding burst doc to bud",
          error
        );
      });
  } catch (error) {
    console.log(error);
    throw new HttpsError("internal", "Error sending burst notification", error);
  }
});
