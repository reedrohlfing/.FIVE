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

// Cloud Function to manage recently added buds
export const addBudNotification = onCall((data, context) => {
  try {
    const { userId, budId } = data.data;
    const budRef = db.doc(`users/${budId}`);

    // Get the current data from the budRef document
    return budRef.get().then((doc) => {
      if (doc.exists) {
        // Append the userId to the recentlyAdded field
        const recentlyAdded = doc.data().recentlyAdded || [];
        recentlyAdded.push(userId);

        // Update the budRef document with the new recentlyAdded field
        return budRef.update({ recentlyAdded });
      } else {
        throw new HttpsError(
          "not-found",
          "Bud document not found",
          "Bud document not found"
        );
      }
    });
  } catch (error) {
    console.log(error);
    throw new HttpsError(
      "internal",
      "Error sending addBud notification",
      error
    );
  }
});

// Cloud Function to remove the buds from each others lists
export const removeBudNotification = onCall((data, context) => {
  try {
    const { userId, budId } = data.data;
    const budRef = db.doc(`users/${budId}`);
    const userRef = db.doc(`users/${userId}`);

    const removeBud = async (ref, idToRemove, field) => {
      const doc = await ref.get();
      if (doc.exists) {
        const list = doc.data()[field] || [];
        const updatedList = list.filter((id) => id !== idToRemove);
        await ref.update({ [field]: updatedList });
      } else {
        throw new HttpsError(
          "not-found",
          "Document not found",
          "Document not found"
        );
      }
    };

    return Promise.all([
      removeBud(budRef, userId, "recentlyAdded"),
      removeBud(userRef, budId, "recentlyAdded"),
      removeBud(budRef, userId, "buds"),
      removeBud(userRef, budId, "buds"),
    ]).then(() => {
      return { success: true };
    });
  } catch (error) {
    console.log(error);
    throw new HttpsError("internal", "Error removing bud notification", error);
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
