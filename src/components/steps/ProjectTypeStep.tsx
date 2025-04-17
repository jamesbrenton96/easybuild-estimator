
import React from "react";
import { useEstimator, ProjectType, CorrespondenceData, ContentData } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { CONSTRUCTION_TYPES, ConstructionType } from "@/lib/construction-types";
import { ChevronRight } from "lucide-react";

export default function ProjectTypeStep() {
  const { updateFormData, formData, nextStep } = useEstimator();
  
  // Get the project types or filter them
  const projectTypes = Object.values(CONSTRUCTION_TYPES);
  
  // Handler for setting project type
  const handleSelectProjectType = (selectedType: ProjectType) => {
    // Create appropriate subcategories structure based on the selected type
    const subcategories: {
      correspondence: CorrespondenceData;
      overview: ContentData;
      dimensions: ContentData;
      materials: ContentData;
      finish: ContentData;
      locationDetails: ContentData;
      timeframe: ContentData;
      additionalWork: ContentData;
      rates: ContentData;
      margin: ContentData;
      notes: ContentData;
      projectName: ContentData;
    } = {
      correspondence: {} as CorrespondenceData,
      overview: { content: "" } as ContentData,
      dimensions: { content: "" } as ContentData,
      materials: { content: "" } as ContentData,
      finish: { content: "" } as ContentData,
      locationDetails: { content: "" } as ContentData,
      timeframe: { content: "" } as ContentData,
      additionalWork: { content: "" } as ContentData,
      rates: { content: "" } as ContentData,
      margin: { content: "" } as ContentData,
      notes: { content: "" } as ContentData,
      projectName: { content: "" } as ContentData
    };
    
    updateFormData({
      projectType: selectedType,
      subcategories: subcategories
    });
    
    nextStep();
  };

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">What type of project are you estimating?</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Choose the category that best describes your construction project.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelectProjectType(type)}
            className="bg-white/10 hover:bg-construction-orange hover:text-white border border-white/20 rounded-lg p-4 text-left transition-all flex items-center group"
          >
            <span className="flex-1">
              <span className="block text-white font-medium text-lg mb-1">{type.name}</span>
              <span className="block text-white/70 text-sm">{type.description}</span>
            </span>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
