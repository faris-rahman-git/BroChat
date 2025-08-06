import { useMutation } from '@tanstack/react-query';
import { uploadFileApi } from '@client/services/home/commonServices';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  showLoader,
  hideLoader,
} from '@client/redux/features/commonSlices/LoaderSlice';
import { ContentType } from '@bro/shared'; // Assuming correct path

export const useFileUploadService = () => {
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFileApi,
    onMutate: () => {
      dispatch(showLoader()); // Show loader before upload starts
    },
    onSuccess: (data: { mediaUrl: string; customMessageType: ContentType }) => {
      dispatch(hideLoader()); // Hide loader on success
      return data; // Pass data through
    },
    onError: (err) => {
      dispatch(hideLoader()); // Hide loader on error
      console.error('File upload error:', err.message);
      // You might want to dispatch an error notification here
    },
  });

  return { uploadFile: mutate, isUploading: isPending };
};
