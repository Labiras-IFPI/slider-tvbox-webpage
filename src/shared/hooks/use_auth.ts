import { useContext } from "react";
import { AuthContext } from "../providers/auth_provider";

export const useAuth = () => {
  return useContext(AuthContext);
};
