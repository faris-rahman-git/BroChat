import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../../services/authServices";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutApi,
  });
};
