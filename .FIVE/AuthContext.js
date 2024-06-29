import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "./FirebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isProfileSetUp, setIsProfileSetUp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if (!user) {
        setIsProfileSetUp(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen for changes to the user's document in Firestore
  useEffect(() => {
    if (user) {
      const docRef = doc(FIREBASE_DB, "users", user.uid);
      const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsProfileSetUp(userData.initialized);
        } else {
          setIsProfileSetUp(false);
        }
        setLoading(false);
      });

      return () => unsubscribeDoc();
    }
  }, [user]);

  const value = {
    user,
    isProfileSetUp,
    setIsProfileSetUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
