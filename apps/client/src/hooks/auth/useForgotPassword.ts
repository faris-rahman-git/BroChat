import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../../services/authServices";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
};
