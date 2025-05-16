
import React from "react";
import { AlertCircle } from "lucide-react";

interface SubmissionStatusProps {
  error: string | null;
  status: "idle" | "success" | "fail";
}

export const SubmissionStatus: React.FC<SubmissionStatusProps> = ({
  error,
  status,
}) => {
  if (!error && status !== "fail") return null;
  return (
    <div className="mt-3">
      {status === "fail" && (
        <div className="text-red-500 text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p>Submission failed: {error}</p>
            <p className="text-xs mt-1 text-white/60">Your form data has been saved. You can try again later.</p>
          </div>
        </div>
      )}
    </div>
  );
};
