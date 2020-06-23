import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import React, { useState, useEffect } from "react";
import { createContext } from "react";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyCZ6NmpYmMrZhCQvAi4jfVrPxL31Nsz8kA",
  authDomain: "insta-clone-app-69251.firebaseapp.com",
  databaseURL: "https://insta-clone-app-69251.firebaseio.com",
  projectId: "insta-clone-app-69251",
  storageBucket: "insta-clone-app-69251.appspot.com",
  messagingSenderId: "817962308734",
  appId: "1:817962308734:web:a108c45fabc62e6190742f",
  measurementId: "G-T8MMTRVEW2",
});

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ status: "loading" });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");

          metadataRef.on("value", async (data) => {
            if (!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  async function signInWithGoogle() {
    await firebase.auth().signInWithPopup(provider);
  }

  async function signOut() {
    setAuthState({ status: "loading" });
    await firebase.auth().signOut();
    setAuthState({ status: "out" });
  }

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
          authState,
          signInWithGoogle,
          signOut,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
