
import React, { useState, useEffect } from "react";
import EstimateActions from "../estimate/EstimateActions";
import ShareEstimate from "../estimate/ShareEstimate";
import { useAuth } from "@/hooks/useAuth";

export function ReviewActions({
  estimationResults,
  onDownloadPDF,
  onStartNew,
}: {
  estimationResults: any;
  onDownloadPDF: () => void;
  onStartNew: () => void;
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const { signOut } = useAuth();

  // Auto sign out when component mounts (when estimate is complete)
  useEffect(() => {
    const timer = setTimeout(() => {
      signOut();
    }, 30000); // 30 seconds delay to allow user to download/share

    return () => clearTimeout(timer);
  }, [signOut]);

  return (
    <>
      <EstimateActions
        onDownloadPDF={onDownloadPDF}
        onStartNew={onStartNew}
        onShare={() => setShowShareModal(true)}
      />
      {showShareModal && (
        <ShareEstimate
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          estimateContent={estimationResults.markdownContent}
        />
      )}
    </>
  );
}
