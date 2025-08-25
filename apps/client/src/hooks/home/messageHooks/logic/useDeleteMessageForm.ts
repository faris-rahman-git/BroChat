import { useEffect } from 'react';
import { useDeleteMessage } from '../api/useDeleteMessage';

export const useDeleteMessageForm = (successHandler: () => void) => {
  const { mutate, isSuccess } = useDeleteMessage();

  useEffect(() => {
    if (isSuccess) {
      successHandler();
    }
  }, [isSuccess]);

  return {
    mutate,
  };
};
