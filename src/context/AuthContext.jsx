import React, { createContext, useContext, useEffect } from "react";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useAtom } from "jotai";
import { authUserAtom, authLoadingAtom } from "../Utils";
import { userAPI } from "../config/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useAtom(authUserAtom);
  const [loading, setLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from our database
          const response = await userAPI.authWebhook({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            firebaseUid: firebaseUser.uid,
            photoURL: firebaseUser.photoURL,
          });


          if (response.success) {
            // Use the user data from our database (includes phoneNumber, address, etc.)
            setUser(response.user);
          } else {
            // Fallback to Firebase data if webhook fails
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
          }
        } catch (error) {
          console.error("❌ Error loading user data from database:", error);
          // Fallback to Firebase data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
