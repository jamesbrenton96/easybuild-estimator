
import React, { useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function BasicInfoStep() {
  const { formData, updateFormData, nextStep, prevStep } = useEstimator();
  const [openCategories, setOpenCategories] = useState<string[]>(["correspondence"]);
  
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };
  
  const handleNestedChange = (category: string, field: string, value: string) => {
    const currentSubcategories = formData.subcategories || {};
    const categoryData = currentSubcategories[category] || {};
    
    updateFormData({
      subcategories: {
        ...currentSubcategories,
        [category]: {
          ...categoryData,
          [field]: value
        }
      }
    });
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
        {/* Project Details Accordion */}
        <Accordion 
          type="multiple" 
          defaultValue={["correspondence"]} 
          className="bg-white/5 rounded-lg overflow-hidden border border-white/20"
        >
          {/* Correspondence Details */}
          <AccordionItem value="correspondence" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Correspondence Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90 space-y-4">
              {/* Correspondence Type */}
              <div>
                <Label htmlFor="correspondenceType" className="form-label">Correspondence Type</Label>
                <Select 
                  value={formData.subcategories?.correspondence?.type || ""}
                  onValueChange={(value) => handleNestedChange("correspondence", "type", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="accurate">Accurate Estimate</SelectItem>
                    <SelectItem value="preliminary">Preliminary Estimate</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Client Name */}
              <div>
                <Label htmlFor="clientName" className="form-label">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.subcategories?.correspondence?.clientName || ""}
                  onChange={(e) => handleNestedChange("correspondence", "clientName", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., Joe Bloggs"
                />
              </div>
              
              {/* Project Address */}
              <div>
                <Label htmlFor="projectAddress" className="form-label">Project Address</Label>
                <Input
                  id="projectAddress"
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., 123 Willow Grove, Mount Eden, Auckland 1024, New Zealand"
                />
              </div>
              
              {/* Current Date */}
              <div>
                <Label htmlFor="currentDate" className="form-label">Current Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="currentDate"
                      className={cn(
                        "w-full flex items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white",
                        !formData.subcategories?.correspondence?.date && "text-white/50"
                      )}
                    >
                      {formData.subcategories?.correspondence?.date || "Select date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.subcategories?.correspondence?.date
                          ? new Date(formData.subcategories.correspondence.date.split('/').reverse().join('-'))
                          : undefined
                      }
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Project Overview */}
          <AccordionItem value="overview" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Project Overview</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.overview?.content || ""}
                onChange={(e) => handleNestedChange("overview", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="What is the overall scope of the project? (e.g., Building a deck, renovating a bathroom, installing new plumbing)"
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Dimensions */}
          <AccordionItem value="dimensions" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Dimensions</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.dimensions?.content || ""}
                onChange={(e) => handleNestedChange("dimensions", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Include the exact measurements (e.g., length, width, height, area in square meters, volume in cubic meters)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Materials */}
          <AccordionItem value="materials" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Materials</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.materials?.content || ""}
                onChange={(e) => handleNestedChange("materials", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Specify the type of materials you're planning to use (e.g., timber type for decking, tile material for bathroom, concrete grade for flooring)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Finish and Details */}
          <AccordionItem value="finish" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Finish and Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.finish?.content || ""}
                onChange={(e) => handleNestedChange("finish", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Describe any specific finishes, textures, or styles (e.g., polished concrete, matte paint finish, modern tiling pattern, gloss varnish)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Location-Specific Details */}
          <AccordionItem value="location" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Location-Specific Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.locationDetails?.content || ""}
                onChange={(e) => handleNestedChange("locationDetails", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Are there any location-specific factors that could affect the project? (e.g., access to the site, difficult terrain, proximity to services)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Timeframe */}
          <AccordionItem value="timeframe" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Timeframe</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.timeframe?.content || ""}
                onChange={(e) => handleNestedChange("timeframe", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Include your estimated timeline for the project (e.g., do you need it completed in a specific number of days or weeks?)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Additional Work */}
          <AccordionItem value="additionalWork" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Additional Work</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.additionalWork?.content || ""}
                onChange={(e) => handleNestedChange("additionalWork", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Are there any additional tasks or components that should be included in the project? (e.g., electrical work, plumbing installation, landscaping after construction)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Hourly Rates */}
          <AccordionItem value="rates" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Hourly Rates</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.rates?.content || ""}
                onChange={(e) => handleNestedChange("rates", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="If you'd like to include information about your company's hourly rates, please specify them here (e.g., carpenter rates, labor costs, subcontractor fees)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Profit Margin */}
          <AccordionItem value="margin" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Profit Margin</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.margin?.content || ""}
                onChange={(e) => handleNestedChange("margin", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="If you'd like to include a margin for materials, please specify the percentage here (e.g., 18% to cover procurement, handling, and additional costs)."
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Specific Notes and Terms */}
          <AccordionItem value="notes" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Specific Notes and Terms</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Textarea
                value={formData.subcategories?.notes?.content || ""}
                onChange={(e) => handleNestedChange("notes", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="If you have any specific notes or terms related to the project, please include them here (e.g., payment terms, special requirements, warranty details, or additional conditions)."
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Full Description (Hidden, but kept for compatibility) */}
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
        
        {/* Auto-compile full description from subcategories */}
        <div className="pt-4 flex justify-between">
          <button
            onClick={prevStep}
            className="btn-back"
          >
            Back
          </button>
          <button
            onClick={() => {
              // Compile all subcategory content into the main description field
              let compiledDescription = "";
              
              if (formData.subcategories) {
                const subcats = formData.subcategories;
                
                if (subcats.correspondence) {
                  compiledDescription += `# Correspondence Details\n`;
                  if (subcats.correspondence.type) compiledDescription += `Type: ${subcats.correspondence.type}\n`;
                  if (subcats.correspondence.clientName) compiledDescription += `Client: ${subcats.correspondence.clientName}\n`;
                  if (subcats.correspondence.date) compiledDescription += `Date: ${subcats.correspondence.date}\n`;
                  compiledDescription += `\n`;
                }
                
                if (subcats.overview?.content) {
                  compiledDescription += `# Project Overview\n${subcats.overview.content}\n\n`;
                }
                
                if (subcats.dimensions?.content) {
                  compiledDescription += `# Dimensions\n${subcats.dimensions.content}\n\n`;
                }
                
                if (subcats.materials?.content) {
                  compiledDescription += `# Materials\n${subcats.materials.content}\n\n`;
                }
                
                if (subcats.finish?.content) {
                  compiledDescription += `# Finish and Details\n${subcats.finish.content}\n\n`;
                }
                
                if (subcats.locationDetails?.content) {
                  compiledDescription += `# Location-Specific Details\n${subcats.locationDetails.content}\n\n`;
                }
                
                if (subcats.timeframe?.content) {
                  compiledDescription += `# Timeframe\n${subcats.timeframe.content}\n\n`;
                }
                
                if (subcats.additionalWork?.content) {
                  compiledDescription += `# Additional Work\n${subcats.additionalWork.content}\n\n`;
                }
                
                if (subcats.rates?.content) {
                  compiledDescription += `# Hourly Rates\n${subcats.rates.content}\n\n`;
                }
                
                if (subcats.margin?.content) {
                  compiledDescription += `# Profit Margin\n${subcats.margin.content}\n\n`;
                }
                
                if (subcats.notes?.content) {
                  compiledDescription += `# Specific Notes and Terms\n${subcats.notes.content}\n\n`;
                }
              }
              
              // If the compiled description is empty but we have a location, use that as minimal description
              if (!compiledDescription && formData.location) {
                compiledDescription = `Project at ${formData.location}`;
              }
              
              // Update the main description field if we have content
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
