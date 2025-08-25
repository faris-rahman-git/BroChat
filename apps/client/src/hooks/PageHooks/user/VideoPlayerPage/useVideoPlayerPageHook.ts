import { useSearchParams } from "react-router-dom";

export const useVideoPlayerPageHook = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url');

  return {
    videoUrl
  }
};
