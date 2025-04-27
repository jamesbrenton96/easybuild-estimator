
import React, { useEffect } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewTabs } from "./ReviewTabs";
import { ReviewActions } from "./ReviewActions";
import { LoadingState } from "@/components/common/LoadingState";
import { usePdfDownload } from "@/hooks/usePdfDownload";

export default function ReviewStep() {
  const { estimationResults, setStep, setEstimationResults, formData, saveFormData } = useEstimator();
  const { handleDownloadPDF } = usePdfDownload();

  useEffect(() => {
    if (!estimationResults) {
      setStep(1);
    } else {
      console.log("Estimation results received:", estimationResults);
    }
  }, [estimationResults, setStep]);

  if (!estimationResults) {
    return null;
  }

  const handleStartNew = () => {
    saveFormData(formData);
    setStep(1);
  };

  return (
    <motion.div
      className="step-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ReviewHeader />

      <ReviewTabs
        estimationResults={estimationResults}
        setEstimationResults={setEstimationResults}
      />

      <ReviewActions
        estimationResults={estimationResults}
        onDownloadPDF={handleDownloadPDF}
        onStartNew={handleStartNew}
      />
    </motion.div>
  );
}
