
import React, { useState } from "react";
import EstimateActions from "../estimate/EstimateActions";
import ShareEstimate from "../estimate/ShareEstimate";

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
