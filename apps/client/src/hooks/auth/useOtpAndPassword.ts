import { useMutation } from "@tanstack/react-query";
import { otpAndPasswordApi } from "../../services/auth/authServices";

export const useOtpAndPassword = () => {
  return useMutation({
    mutationFn: otpAndPasswordApi,
  });
};
