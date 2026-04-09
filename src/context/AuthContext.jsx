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
        // ✅ Set loading=false immediately with Firebase data so the app renders right away.
        // The backend webhook runs async and enriches the user data when the server wakes up.
        const firebaseUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(firebaseUserData);
        setLoading(false); // Unblock render immediately

        // Async enrich with DB data (don't await — runs in background)
        userAPI.authWebhook({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          firebaseUid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL,
        }).then((response) => {
          if (response?.success && response.user) {
            setUser(response.user);
          }
        }).catch(() => {
          // Backend may be cold-starting; Firebase data is already set, so user is unaffected
        });
      } else {
        setUser(null);
        setLoading(false);
      }
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
