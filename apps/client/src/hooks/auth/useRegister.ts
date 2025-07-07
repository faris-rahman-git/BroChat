import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../../services/authServices";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};
