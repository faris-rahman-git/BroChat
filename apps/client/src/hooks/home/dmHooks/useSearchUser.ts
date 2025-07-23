import { searchUserApi } from "@client/services/home/dmServices";
import { useMutation } from "@tanstack/react-query";

export const useSearchUser = () => {
  return useMutation({
    mutationFn: searchUserApi,
  });
};
