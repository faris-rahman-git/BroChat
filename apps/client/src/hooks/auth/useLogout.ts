import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../../services/auth/authServices";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutApi,
  });
};
