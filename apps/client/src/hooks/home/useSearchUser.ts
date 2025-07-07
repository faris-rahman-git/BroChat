import { searchUserApi } from "@client/services/homeServices";
import { useMutation } from "@tanstack/react-query";

export const useSearchUser = () => {
  return useMutation({
    mutationFn: searchUserApi,
  });
};
