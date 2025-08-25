import { useEffect, useRef, useState } from 'react';

export const useCustomResizablePanelsHook = (
  defaultSize: number,
  minSize: number,
  maxSize: number,
  onResize?: (size: number) => void
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidthPx, setLeftWidthPx] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = () => setIsDragging(true);
  const stopDrag = () => setIsDragging(false);

  const onDrag = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerLeft = containerRef.current.getBoundingClientRect().left;
    let newPx = e.clientX - containerLeft;
    newPx = Math.max(minSize, Math.min(maxSize, newPx));
    setLeftWidthPx(newPx);
    onResize?.(newPx);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDrag);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging]);

  return {
    leftWidthPx,
    startDrag,
    containerRef
  };
};
