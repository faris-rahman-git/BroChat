export const toggleFullScreen = () => {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    elem.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
};
