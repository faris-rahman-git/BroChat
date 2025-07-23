import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../../services/auth/authServices";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};
