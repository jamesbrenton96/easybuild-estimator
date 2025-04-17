
import React, { useState } from "react";
import { useEstimator, CorrespondenceData, ContentData } from "@/context/EstimatorContext";
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

  // Helper function to safely access ContentData.content 
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
    if (category === "correspondence") return ""; // correspondence doesn't have content
    
    return (data as ContentData).content || "";
  };

  // Helper function to safely access CorrespondenceData fields
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
                  value={getCorrespondenceValue("type")}
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
                  value={getCorrespondenceValue("clientName")}
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
                        !getCorrespondenceValue("date") && "text-white/50"
                      )}
                    >
                      {getCorrespondenceValue("date") || "Select date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        getCorrespondenceValue("date")
                          ? new Date(getCorrespondenceValue("date").split('/').reverse().join('-'))
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
          
          {/* Project Name */}
          <AccordionItem value="projectName" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Project Name</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="projectName" className="form-label mb-2 block">Enter a name for your project</Label>
              <Input
                id="projectName"
                value={getContentValue("projectName")}
                onChange={(e) => handleNestedChange("projectName", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="e.g., Smith Residence Kitchen Renovation"
              />
              <p className="text-xs text-white/60 mt-2">This will serve as the main title when exported to PDF</p>
            </AccordionContent>
          </AccordionItem>
          
          {/* Project Overview */}
          <AccordionItem value="overview" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Project Overview</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="overview" className="form-label mb-2 block">What is the overall scope of the project?</Label>
              <Textarea
                id="overview"
                value={getContentValue("overview")}
                onChange={(e) => handleNestedChange("overview", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="What is the overall scope of the project? (e.g., Building a deck, renovating a bathroom, installing new plumbing)"
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Build a 3x2 meter deck that ties seamlessly into an existing deck. The deck will feature a low-pitched roof and will be constructed using H3.2 treated pine for the framework and Vitex timber decking for the surface.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Dimensions */}
          <AccordionItem value="dimensions" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Dimensions</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="dimensions" className="form-label mb-2 block">Include the exact measurements</Label>
              <Textarea
                id="dimensions"
                value={getContentValue("dimensions")}
                onChange={(e) => handleNestedChange("dimensions", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Include the exact measurements (e.g., length, width, height, area in square meters, volume in cubic meters)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Deck Size: 3 meters (length) x 2 meters (width)<br/>
                  Existing Deck Height: 300mm off the ground<br/>
                  Decking Boards: 140x20mm Vitex<br/>
                  Roof Pitch: Low-pitched roof<br/>
                  - Take into account any extra materials that might be needed.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Materials */}
          <AccordionItem value="materials" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Materials</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="materials" className="form-label mb-2 block">Specify the type of materials you're planning to use</Label>
              <Textarea
                id="materials"
                value={getContentValue("materials")}
                onChange={(e) => handleNestedChange("materials", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Specify the type of materials you're planning to use (e.g., timber type for decking, tile material for bathroom, concrete grade for flooring)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Framework: H3.2 treated pine timber<br/>
                  Decking Boards: 140x20mm Vitex timber<br/>
                  Roofing: Polycarbonate roofing sheets for the deck roof<br/>
                  Finish: Wood stain (suitable for Vitex wood)<br/>
                  Roof Frame: H3.2 treated pine<br/>
                  Roofing Sheets: Corrugated iron
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Finish and Details */}
          <AccordionItem value="finish" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Finish and Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="finish" className="form-label mb-2 block">Describe any specific finishes, textures, or styles</Label>
              <Textarea
                id="finish"
                value={getContentValue("finish")}
                onChange={(e) => handleNestedChange("finish", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Describe any specific finishes, textures, or styles (e.g., polished concrete, matte paint finish, modern tiling pattern, gloss varnish)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Decking Design: Picture frame design around the perimeter for a neat appearance<br/>
                  Finish: Deck will be stained with a wood stain that complements the natural color of the Vitex timber<br/>
                  Roof: Low-pitched roof with polycarbonate roofing sheets for light and visibility<br/>
                  Aesthetic Appeal: The deck's natural look will complement the existing deck
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Location-Specific Details */}
          <AccordionItem value="locationDetails" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Location-Specific Details</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="locationDetails" className="form-label mb-2 block">Are there any location-specific factors that could affect the project?</Label>
              <Textarea
                id="locationDetails"
                value={getContentValue("locationDetails")}
                onChange={(e) => handleNestedChange("locationDetails", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Are there any location-specific factors that could affect the project? (e.g., access to the site, difficult terrain, proximity to services)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Site Location: At the back of the house<br/>
                  Access: Clear and easy access for materials and construction
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Timeframe */}
          <AccordionItem value="timeframe" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Timeframe</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="timeframe" className="form-label mb-2 block">Include your estimated timeline for the project</Label>
              <Textarea
                id="timeframe"
                value={getContentValue("timeframe")}
                onChange={(e) => handleNestedChange("timeframe", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Include your estimated timeline for the project (e.g., do you need it completed in a specific number of days or weeks?)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> The duration is unclear, but it will include installation, finishing touches, and staining. Estimated timeline is needed to determine exact completion time.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Additional Work */}
          <AccordionItem value="additionalWork" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Additional Work</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="additionalWork" className="form-label mb-2 block">Are there any additional tasks or components?</Label>
              <Textarea
                id="additionalWork"
                value={getContentValue("additionalWork")}
                onChange={(e) => handleNestedChange("additionalWork", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="Are there any additional tasks or components that should be included in the project? (e.g., electrical work, plumbing installation, landscaping after construction)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Take into account a small 2.5m long rotten weatherboard on the house underneath a window that needs to be replaced.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Hourly Rates */}
          <AccordionItem value="rates" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Hourly Rates</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="rates" className="form-label mb-2 block">Company's hourly rates</Label>
              <Textarea
                id="rates"
                value={getContentValue("rates")}
                onChange={(e) => handleNestedChange("rates", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="If you'd like to include information about your company's hourly rates, please specify them here (e.g., carpenter rates, labor costs, subcontractor fees)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Project Management Rate: $85 per hour + GST<br/>
                  Builder Rate: $75 per hour + GST<br/>
                  Apprentice Rate: $50 per hour + GST
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Profit Margin */}
          <AccordionItem value="margin" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Profit Margin</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="margin" className="form-label mb-2 block">Profit margin for materials</Label>
              <Textarea
                id="margin"
                value={getContentValue("margin")}
                onChange={(e) => handleNestedChange("margin", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="If you'd like to include a margin for materials, please specify the percentage here (e.g., 18% to cover procurement, handling, and additional costs)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Materials Margin: 18% on all materials for procurement and handling costs
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* Specific Notes and Terms */}
          <AccordionItem value="notes" className="border-white/20">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline">
              <span className="font-semibold">Specific Notes and Terms</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-white/90">
              <Label htmlFor="notes" className="form-label mb-2 block">Specific notes or terms related to the project</Label>
              <Textarea
                id="notes"
                value={getContentValue("notes")}
                onChange={(e) => handleNestedChange("notes", "content", e.target.value)}
                className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
                placeholder="If you have any specific notes or terms related to the project, please include them here (e.g., payment terms, special requirements, warranty details, or additional conditions)."
              />
              <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
                <p className="text-xs text-white/70 italic">
                  <strong>Example:</strong> Please note that all project costs are based on the scope of work as outlined above. Any changes to the project scope, such as additional tasks or materials, will require a revision of the estimate. A 40% deposit is required before work commences, with the balance due upon project completion. Any delays caused by weather or external factors will be communicated promptly, and a revised timeline may be provided if necessary.
                </p>
              </div>
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
