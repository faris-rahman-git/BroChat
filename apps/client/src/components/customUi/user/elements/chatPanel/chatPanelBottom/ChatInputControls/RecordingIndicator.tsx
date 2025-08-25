import React from 'react';

interface RecordingIndicatorProps {
  recordingTime: number;
}

const RecordingIndicator = React.memo(
  ({ recordingTime }: RecordingIndicatorProps) => {
    return (
      <div className="absolute left-1/2 bottom-[calc(100%+4px)] transform -translate-x-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-2 shadow">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span>Recording... {recordingTime}s</span>
      </div>
    );
  }
);

export default RecordingIndicator;
