import { useResendOtpApi } from "@client/services/authServices";
import { useMutation } from "@tanstack/react-query";

export const useResendotp = () => {
  return useMutation({
    mutationFn: useResendOtpApi,
  });
};
