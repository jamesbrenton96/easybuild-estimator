
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function BasicInfoStep() {
  const { formData, updateFormData, nextStep, prevStep } = useEstimator();
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ description: e.target.value });
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ location: e.target.value });
  };
  
  const isNextDisabled = !formData.description || !formData.location;

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Tell us about your project</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Provide details about your construction project so we can generate an accurate estimate.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="description" className="form-label">
            Describe the scope of work
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="bg-white/10 border-white/20 text-white resize-none min-h-[150px]"
            placeholder="Describe what you need done. Be as specific as possible about dimensions, materials, finishes, etc."
          />
        </div>
        
        <div>
          <label htmlFor="location" className="form-label">
            Location of the job
          </label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleLocationChange}
            className="bg-white/10 border-white/20 text-white h-12"
            placeholder="Enter city, suburb or postcode"
          />
        </div>
        
        <div className="pt-4 flex justify-between">
          <button
            onClick={prevStep}
            className="btn-back"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={isNextDisabled}
            className="btn-next disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
