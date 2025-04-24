import React, { useState } from "react";
import { useEstimator, CorrespondenceData, ContentData } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CorrespondenceAccordion from "./basic-info/CorrespondenceAccordion";
import ProjectNameAccordion from "./basic-info/ProjectNameAccordion";
import OverviewAccordion from "./basic-info/OverviewAccordion";
import DimensionsAccordion from "./basic-info/DimensionsAccordion";
import MaterialsAccordion from "./basic-info/MaterialsAccordion";
import FinishAccordion from "./basic-info/FinishAccordion";
import LocationDetailsAccordion from "./basic-info/LocationDetailsAccordion";
import TimeframeAccordion from "./basic-info/TimeframeAccordion";
import AdditionalWorkAccordion from "./basic-info/AdditionalWorkAccordion";
import RatesAccordion from "./basic-info/RatesAccordion";
import MarginAccordion from "./basic-info/MarginAccordion";
import NotesAccordion from "./basic-info/NotesAccordion";

export default function BasicInfoStep() {
  const { formData, updateFormData, nextStep, prevStep } = useEstimator();
  const [openCategories, setOpenCategories] = useState<string[]>(["correspondence"]);
  
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };
  
  const handleNestedChange = (category: string, field: string, value: string) => {
    const currentSubcategories = formData.subcategories || {
      correspondence: {},
      projectName: { content: "" },
      overview: { content: "" },
      dimensions: { content: "" },
      materials: { content: "" },
      finish: { content: "" },
      locationDetails: { content: "" },
      timeframe: { content: "" },
      additionalWork: { content: "" },
      rates: { content: "" },
      margin: { content: "" },
      notes: { content: "" }
    };
    
    if (category === "correspondence") {
      const correspondenceData = currentSubcategories.correspondence || {} as CorrespondenceData;
      updateFormData({
        subcategories: {
          ...currentSubcategories,
          correspondence: {
            ...correspondenceData,
            [field]: value
          }
        }
      });
    } else {
      const categoryData = (currentSubcategories[category] || {}) as ContentData;
      updateFormData({
        subcategories: {
          ...currentSubcategories,
          [category]: {
            ...categoryData,
            content: value
          } as ContentData
        }
      });
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleNestedChange("correspondence", "date", format(date, "dd/MM/yyyy"));
    }
  };
  
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const isNextDisabled = !formData.description || !formData.location;

  const getContentValue = (category: string): string => {
    const subcategories = formData.subcategories || {
      correspondence: {},
      projectName: { content: "" },
      overview: { content: "" },
      dimensions: { content: "" },
      materials: { content: "" },
      finish: { content: "" },
      locationDetails: { content: "" },
      timeframe: { content: "" },
      additionalWork: { content: "" },
      rates: { content: "" },
      margin: { content: "" },
      notes: { content: "" }
    };
    
    if (!subcategories[category]) return "";
    
    const data = subcategories[category];
    if (category === "correspondence") return "";
    
    return (data as ContentData).content || "";
  };

  const getCorrespondenceValue = (field: string): string => {
    const subcategories = formData.subcategories || {
      correspondence: {},
      projectName: { content: "" },
      overview: { content: "" },
      dimensions: { content: "" },
      materials: { content: "" },
      finish: { content: "" },
      locationDetails: { content: "" },
      timeframe: { content: "" },
      additionalWork: { content: "" },
      rates: { content: "" },
      margin: { content: "" },
      notes: { content: "" }
    };
    
    if (!subcategories.correspondence) return "";
    
    const correspondence = subcategories.correspondence as CorrespondenceData;
    return correspondence[field as keyof CorrespondenceData] as string || "";
  };

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
        <Accordion 
          type="multiple" 
          defaultValue={["correspondence"]} 
          className="bg-white/5 rounded-lg overflow-hidden border border-white/20"
        >
          <AccordionItem value="correspondence" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Correspondence Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90 space-y-4">
              <CorrespondenceAccordion
                value={{
                  type: getCorrespondenceValue("type"),
                  clientName: getCorrespondenceValue("clientName"),
                  date: getCorrespondenceValue("date"),
                }}
                location={formData.location || ""}
                onTypeChange={val => handleNestedChange("correspondence", "type", val)}
                onClientNameChange={val => handleNestedChange("correspondence", "clientName", val)}
                onProjectAddressChange={val => handleChange("location", val)}
                onDateChange={val => handleNestedChange("correspondence", "date", val)}
              />
              <div className="mt-4">
                <ProjectNameAccordion
                  value={getContentValue("projectName")}
                  onChange={val => handleNestedChange("projectName", "content", val)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="overview" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Project Overview</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <OverviewAccordion
                value={getContentValue("overview")}
                onChange={val => handleNestedChange("overview", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="dimensions" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Dimensions</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <DimensionsAccordion
                value={getContentValue("dimensions")}
                onChange={val => handleNestedChange("dimensions", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="materials" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Materials</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <MaterialsAccordion
                value={getContentValue("materials")}
                onChange={val => handleNestedChange("materials", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="finish" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Finish and Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <FinishAccordion
                value={getContentValue("finish")}
                onChange={val => handleNestedChange("finish", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="locationDetails" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Location-Specific Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <LocationDetailsAccordion
                value={getContentValue("locationDetails")}
                onChange={val => handleNestedChange("locationDetails", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="timeframe" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Timeframe</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <TimeframeAccordion
                value={getContentValue("timeframe")}
                onChange={val => handleNestedChange("timeframe", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="additionalWork" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Additional Work</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <AdditionalWorkAccordion
                value={getContentValue("additionalWork")}
                onChange={val => handleNestedChange("additionalWork", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="rates" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Hourly Rates</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <RatesAccordion
                value={getContentValue("rates")}
                onChange={val => handleNestedChange("rates", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="margin" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Profit Margin</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <MarginAccordion
                value={getContentValue("margin")}
                onChange={val => handleNestedChange("margin", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notes" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Specific Notes and Terms</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <NotesAccordion
                value={getContentValue("notes")}
                onChange={val => handleNestedChange("notes", "content", val)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="hidden">
          <Label htmlFor="description" className="form-label">
            Full Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-white/10 border-white/20 text-white resize-none min-h-[50px]"
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
            onClick={() => {
              let compiledDescription = "";
              
              if (formData.subcategories) {
                const subcats = formData.subcategories;
                
                if (subcats.projectName) {
                  const projectName = subcats.projectName as ContentData;
                  if (projectName.content) compiledDescription += `# ${projectName.content}\n\n`;
                }
                
                if (subcats.correspondence) {
                  const correspondence = subcats.correspondence as CorrespondenceData;
                  compiledDescription += `# Correspondence Details\n`;
                  if (correspondence.type) compiledDescription += `Type: ${correspondence.type}\n`;
                  if (correspondence.clientName) compiledDescription += `Client: ${correspondence.clientName}\n`;
                  if (correspondence.date) compiledDescription += `Date: ${correspondence.date}\n`;
                  compiledDescription += `\n`;
                }
                
                if (subcats.overview) {
                  const overview = subcats.overview as ContentData;
                  if (overview.content) compiledDescription += `# Project Overview\n${overview.content}\n\n`;
                }
                
                if (subcats.dimensions) {
                  const dimensions = subcats.dimensions as ContentData;
                  if (dimensions.content) compiledDescription += `# Dimensions\n${dimensions.content}\n\n`;
                }
                
                if (subcats.materials) {
                  const materials = subcats.materials as ContentData;
                  if (materials.content) compiledDescription += `# Materials\n${materials.content}\n\n`;
                }
                
                if (subcats.finish) {
                  const finish = subcats.finish as ContentData;
                  if (finish.content) compiledDescription += `# Finish and Details\n${finish.content}\n\n`;
                }
                
                if (subcats.locationDetails) {
                  const locationDetails = subcats.locationDetails as ContentData;
                  if (locationDetails.content) compiledDescription += `# Location-Specific Details\n${locationDetails.content}\n\n`;
                }
                
                if (subcats.timeframe) {
                  const timeframe = subcats.timeframe as ContentData;
                  if (timeframe.content) compiledDescription += `# Timeframe\n${timeframe.content}\n\n`;
                }
                
                if (subcats.additionalWork) {
                  const additionalWork = subcats.additionalWork as ContentData;
                  if (additionalWork.content) compiledDescription += `# Additional Work\n${additionalWork.content}\n\n`;
                }
                
                if (subcats.rates) {
                  const rates = subcats.rates as ContentData;
                  if (rates.content) compiledDescription += `# Hourly Rates\n${rates.content}\n\n`;
                }
                
                if (subcats.margin) {
                  const margin = subcats.margin as ContentData;
                  if (margin.content) compiledDescription += `# Profit Margin\n${margin.content}\n\n`;
                }
                
                if (subcats.notes) {
                  const notes = subcats.notes as ContentData;
                  if (notes.content) compiledDescription += `# Specific Notes and Terms\n${notes.content}\n\n`;
                }
              }
              
              if (!compiledDescription && formData.location) {
                compiledDescription = `Project at ${formData.location}`;
              }
              
              if (compiledDescription) {
                updateFormData({ description: compiledDescription });
              }
              
              nextStep();
            }}
            disabled={!formData.location}
            className="btn-next disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
