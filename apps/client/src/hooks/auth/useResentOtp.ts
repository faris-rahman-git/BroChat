import { useResendOtpApi } from "@client/services/auth/authServices";
import { useMutation } from "@tanstack/react-query";

export const useResendotp = () => {
  return useMutation({
    mutationFn: useResendOtpApi,
  });
};
