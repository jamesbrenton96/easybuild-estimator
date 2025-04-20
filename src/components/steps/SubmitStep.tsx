
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReviewDetailsCard } from "../submitter/ReviewDetailsCard";
import { PreviewCard } from "../submitter/PreviewCard";
import { FilesCard } from "../submitter/FilesCard";
import { InfoBanner } from "../submitter/InfoBanner";
import { SubmitHeader } from "./SubmitHeader";
import { SubmitActions } from "./SubmitActions";

export default function SubmitStep() {
  const {
    formData,
    prevStep,
    nextStep,
    setIsLoading,
    setEstimationResults,
  } = useEstimator();
  const isMobile = useIsMobile();

  // File filtering
  const files = Array.isArray(formData.files)
    ? formData.files.filter((file) => file && file.name)
    : [];

  // Format preview sections
  const formattedSections = PreviewCard.formatSections(formData.description || "");

  return (
    <motion.div
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SubmitHeader />

      <div className="max-w-2xl mx-auto">
        <ReviewDetailsCard formData={formData} />

        <PreviewCard sections={formattedSections} />

        {files.length > 0 && <FilesCard files={files} />}

        <InfoBanner />

        <div className="text-center text-white/80 text-sm mb-8">
          By submitting, our AI will analyze your project details and generate an estimate.
        </div>

        <SubmitActions
          prevStep={prevStep}
          formData={formData}
          setIsLoading={setIsLoading}
          setEstimationResults={setEstimationResults}
          nextStep={nextStep}
          isMobile={isMobile}
        />
      </div>
    </motion.div>
  );
}
