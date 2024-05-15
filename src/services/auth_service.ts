import {
  AuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { IUserCredendials } from "../models/genericModels/user_credential";
import { auth } from "../config/firebase-config";

async function logIn({ email, password }: IUserCredendials) {
  return await signInWithEmailAndPassword(auth, email, password);
}

async function registerUser({ email, password }: IUserCredendials) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

async function logOut() {
  return await signOut(auth);
}

async function logInWithPopup(provider: AuthProvider) {
  return await signInWithPopup(auth, provider);
}

export const AuthService = {
  logIn,
  logInWithPopup,
  logOut,
  registerUser,
};
