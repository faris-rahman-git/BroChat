import ReactPlayer from 'react-player';
import { useSearchParams } from 'react-router-dom';

const VideoPlayerPage = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url');

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
