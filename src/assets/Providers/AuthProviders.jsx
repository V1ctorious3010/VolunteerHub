import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  GithubAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";
import axios from "axios";
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Optional: expose role separately for convenient access
  const [role, setRole] = useState(null);

  //Observer:
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        // Fetch role/name/email from backend using JWT cookie
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
            withCredentials: true,
          });
          setRole(data?.role || null);
          // Merge role (and name/email from DB) into user state for easy access
          setUser((prev) => (prev ? { ...prev, appRole: data?.role, appName: data?.name, appEmail: data?.email } : prev));
        } catch (_) {
          // If unauthorized or request fails, keep Firebase user; role remains null
          setRole(null);
        }
      }
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  //Providers:
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  //Register:
  const registerAccount = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //Login:
  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //Update Account :

  const updateUserProfile = (name, email, image) => {
    updateProfile(auth.currentUser, {
      displayName: name,
      email: email,
      photoURL: image,
    }).then(() => {
      setUser({ ...user, displayName: name, email: email, photoURL: image });
    });
    return;
  };

  //Logout:
  const logOut = async () => {
    setUser(null);
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        null,
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Logout failed:', error);
    }
    signOut(auth).then(() => { });
  };

  //Google:
  const googleLogIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  //Github:
  const githubLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  //Facebook:
  const facebookLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider);
  };

  const allValues = {
    registerAccount,
    logIn,
    googleLogIn,
    user,
    loading,
    githubLogin,
    facebookLogin,
    logOut,
    updateUserProfile,
    role,
  };

  return (
    <AuthContext.Provider value={allValues}>{children}</AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
export default AuthProvider;
