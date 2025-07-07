import { useMutation } from "@tanstack/react-query";
import { otpAndPasswordApi } from "../../services/authServices";

export const useOtpAndPassword = () => {
  return useMutation({
    mutationFn: otpAndPasswordApi,
  });
};
