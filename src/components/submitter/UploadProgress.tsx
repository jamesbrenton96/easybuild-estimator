
import React from "react";

export const UploadProgress: React.FC<{ progress: number }> = ({ progress }) =>
  progress > 0 && progress < 100 ? (
    <div className="my-2">
      <div className="w-full bg-white/10 rounded-full h-2.5">
        <div
          className="bg-construction-orange h-2.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-white/60 mt-1">{progress}%</div>
    </div>
  ) : null;
