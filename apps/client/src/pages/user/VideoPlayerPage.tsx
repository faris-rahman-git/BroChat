import { useVideoPlayerPageHook } from '@client/hooks/PageHooks/user/VideoPlayerPage/useVideoPlayerPageHook';
import ReactPlayer from 'react-player';

const VideoPlayerPage = () => {
  const { videoUrl } = useVideoPlayerPageHook();

  if (!videoUrl) return <p>Invalid video URL</p>;

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <div className="w-full max-w-[900px] aspect-video">
        <ReactPlayer
          src={videoUrl}
          width="100%"
          height="100%"
          controls
          playing
        />
      </div>
    </div>
  );
};

export default VideoPlayerPage;
