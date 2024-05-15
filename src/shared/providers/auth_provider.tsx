import {
  AuthProvider as AuthProviderFirebase,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useCallback, useEffect, useState } from "react";
import { auth } from "../../config/firebase-config";
import { Toast, useBoolean, useToast } from "@chakra-ui/react";
import { IUserCredendials } from "../../models/genericModels/user_credential";
import { AuthService } from "../../services/auth_service";
import { IUser } from "../../models/genericModels/auth_user";
import { FirebaseError } from "firebase/app";

interface IAuthProvider {
  children: React.ReactNode;
}

interface AuthProviderValues {
  user: IUser | null;
  //Descobrir o tipo que o log in vai retornar
  logIn: (
    userCredendials: IUserCredendials
  ) => Promise<IUser>;

  logOut: () => Promise<void>;

  registerUser: (userCredendials: IUserCredendials) => Promise<UserCredential>;

  loginInWithPopUp: (provider: AuthProviderFirebase) => Promise<UserCredential>;

  loading: Boolean;

  setLoading: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
}

export const AuthContext = createContext<AuthProviderValues>(
  {} as AuthProviderValues
);

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useBoolean(true);
  //Criar um log In, que faz um login no firebase e retorna os valores desejados

  const toast = useToast();

  const logIn = async (
    credentials: IUserCredendials
  ): Promise<IUser> => {
    setLoading.on();

    const response = await AuthService.logIn(credentials);

    const user: IUser = {
      name: response.user.displayName,
      email: response.user.email,
    };

    setUser(user);
    _saveUserInStorage(user);

    return user;
  };

  const loginWithPopUp = (provider: AuthProviderFirebase) => {
    setLoading.on();
    return AuthService.logInWithPopup(provider);
  };

  const registerUser = (credentials: IUserCredendials) => {
    setLoading.on();
    return AuthService.registerUser(credentials);
  };

  const logOut = () => {
    setLoading.on();
    return AuthService.logOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      if (currentUser) {
        const storageUser = _readUserInStorage();

        if (storageUser) {
          const user = {
            ...storageUser,
            name: currentUser.displayName ?? storageUser?.name,
            email: currentUser.email ?? storageUser?.name,
          };

          setUser(user);
          _saveUserInStorage(user);
        }
      } else {
        setUser(null);
        _removeDataInStorage("@user");
      }

      setLoading.off();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const _saveUserInStorage = (user: IUser) => {
    const jsonToString = JSON.stringify(user);

    localStorage.setItem("@user", jsonToString);
  };

  const _removeDataInStorage = (name: string) => {
    localStorage.removeItem(name);
  };

  const _readUserInStorage = (): IUser | null => {
    const data = localStorage.getItem("@user");

    if (data) {
      const jsonFromUser = JSON.parse(data) as IUser;

      return jsonFromUser;
    }

    return null;
  };

  // useEffect(() => {
  //   set
  // }, [user])

  const authProviderValues: AuthProviderValues = {
    user,
    logIn,
    loginInWithPopUp: loginWithPopUp,
    logOut,
    registerUser,
    loading,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authProviderValues}>
      {children}
    </AuthContext.Provider>
  );
}
