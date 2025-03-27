
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { ProjectType } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projectTypes: ProjectType[] = [
  "All Trades Included",
  "House Extension",
  "House Renovation",
  "New Build",
  "Deck / Landscaping",
  "Electrical",
  "Plumbing",
  "Concreting",
  "Carpentry / Framing",
  "Roofing",
  "Painting & Decorating",
  "Tiling",
  "Plastering / Gib Stopping",
  "Bricklaying / Blockwork",
  "Earthworks / Excavation",
  "Drainage",
  "HVAC",
  "Insulation", 
  "Flooring",
  "Windows & Glazing",
  "Cabinetry / Joinery",
  "Welding / Metalwork",
  "Fencing / Gates",
  "Demolition",
  "Scaffolding",
  "Waterproofing",
  "Solar Installation",
  "Smart Home / Automation",
  "Site Prep & Cleanup",
];

export default function ProjectTypeStep() {
  const { formData, updateFormData, nextStep } = useEstimator();
  
  const handleSelectChange = (value: string) => {
    updateFormData({ projectType: value as ProjectType });
  };

  const handleNext = () => {
    if (formData.projectType) {
      nextStep();
    }
  };

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">What type of project are you planning?</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Select the type of project you're working on so we can tailor the estimate to your specific needs.
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <label htmlFor="project-type" className="form-label">
          Project Type
        </label>
        <Select onValueChange={handleSelectChange} value={formData.projectType || undefined}>
          <SelectTrigger id="project-type" className="w-full bg-white/10 border-white/20 text-white h-14 text-lg">
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {projectTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-base">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleNext}
            disabled={!formData.projectType}
            className="btn-next w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
