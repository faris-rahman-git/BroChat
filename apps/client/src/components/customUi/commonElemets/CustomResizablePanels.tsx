import React, { useRef, useState, useEffect } from 'react';

interface CustomResizablePanelsProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize?: (size: number) => void;
}

const CustomResizablePanels: React.FC<CustomResizablePanelsProps> = ({
  left,
  right,
  defaultSize = 350,
  minSize = 300,
  maxSize = 500,
  onResize,
}) => {
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

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex relative overflow-hidden select-none"
    >
      <div
        className="h-full overflow-visible"
        style={{ width: `${leftWidthPx}px`, minWidth: 0 }}
      >
        {left}
      </div>
      <div className="w-full relative">
        <div
          className="absolute top-0 left-0 h-full w-[5px] bg-transparent hover:bg-gray-300 hover:delay-400 hover:transition-all duration-300 cursor-ew-resize"
          onMouseDown={startDrag}
        />
        <div className="flex-1 h-full overflow-visible">{right}</div>
      </div>
    </div>
  );
};

export default CustomResizablePanels;
