
import React from "react";

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
    <div className="mt-3 text-center">
      {status === "fail" && (
        <div className="text-red-500 text-sm">
          <span>Submission failed: {error}</span>
        </div>
      )}
    </div>
  );
};
