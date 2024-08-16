import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { runWith } from "firebase-functions";

// Initialize Firebase Admin
initializeApp();

runWith({
  timeoutSeconds: 540,
  memory: "2GB",
});

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

// /**
//  * Initiate a recursive delete of documents at a given path.
//  *
//  * The calling user must be authenticated and have the custom "admin" attribute
//  * set to true on the auth token.
//  *
//  * This delete is NOT an atomic operation and it's possible
//  * that it may fail after only deleting some documents.
//  *
//  * @param {string} data.path the document or collection path to delete.
//  */
export const recursiveDelete = onCall(async (data, context) => {
  // Only allow admin users to execute this function.
  if (!(context.auth && context.auth.token && context.auth.token.admin)) {
    throw new HttpsError(
      "permission-denied",
      "Must be an administrative user to initiate delete."
    );
  }

  const path = data.path;
  console.log(`User ${context.auth.uid} has requested to delete path ${path}`);

  // Run a recursive delete on the given document or collection path.
  // The 'token' must be set in the functions config, and can be generated
  // at the command line by running 'firebase login:ci'.
  await db.delete(path, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    force: true,
    token: functions.config().fb.token,
  });

  return {
    path: path,
  };
});
