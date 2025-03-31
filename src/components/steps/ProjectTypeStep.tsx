
import React, { useState, useEffect } from "react";
import { useEstimator, getSubcategoriesForProjectType, ProjectType, Subcategory } from "@/context/EstimatorContext";
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
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string>>({});
  const [showSubcategories, setShowSubcategories] = useState(false);
  
  useEffect(() => {
    if (formData.projectType) {
      const newSubcategories = getSubcategoriesForProjectType(formData.projectType);
      setSubcategories(newSubcategories);
      
      // Initialize subcategory values if they don't exist
      const initialSubcategories = { ...formData.subcategories };
      newSubcategories.forEach(subcat => {
        if (!initialSubcategories[subcat.name] && subcat.options.length > 0) {
          initialSubcategories[subcat.name] = '';
        }
      });
      
      setSelectedSubcategories(initialSubcategories);
      setShowSubcategories(newSubcategories.length > 0);
    } else {
      setSubcategories([]);
      setSelectedSubcategories({});
      setShowSubcategories(false);
    }
  }, [formData.projectType]);

  const handleSelectChange = (value: string) => {
    updateFormData({ 
      projectType: value as ProjectType,
      subcategories: {} // Reset subcategories when project type changes
    });
  };

  const handleSubcategoryChange = (subcategoryName: string, value: string) => {
    const updatedSubcategories = { ...selectedSubcategories, [subcategoryName]: value };
    setSelectedSubcategories(updatedSubcategories);
    updateFormData({ subcategories: updatedSubcategories });
  };

  const handleNext = () => {
    if (formData.projectType) {
      updateFormData({ subcategories: selectedSubcategories });
      nextStep();
    }
  };

  const allSubcategoriesSelected = () => {
    if (!showSubcategories) return true;
    
    return subcategories.every(subcat => {
      return !!selectedSubcategories[subcat.name];
    });
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
        
        {showSubcategories && (
          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-medium text-white">Additional Details</h2>
            
            {subcategories.map((subcategory) => (
              <div key={subcategory.name} className="space-y-1.5">
                <label htmlFor={`subcategory-${subcategory.name}`} className="form-label">
                  {subcategory.name}
                </label>
                <Select 
                  onValueChange={(value) => handleSubcategoryChange(subcategory.name, value)} 
                  value={selectedSubcategories[subcategory.name] || undefined}
                >
                  <SelectTrigger 
                    id={`subcategory-${subcategory.name}`} 
                    className="w-full bg-white/10 border-white/20 text-white"
                  >
                    <SelectValue placeholder={`Select ${subcategory.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategory.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </motion.div>
        )}
        
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleNext}
            disabled={!formData.projectType || !allSubcategoriesSelected()}
            className="btn-next w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
