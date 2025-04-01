
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
          <div className="mb-2 text-white/70 text-sm italic">
            Provide as much detail as possible for accurate estimates. Please include information on:
          </div>
          <div className="bg-white/5 rounded-md p-3 mb-3 text-white/80 text-xs space-y-2">
            <div>
              <p className="font-medium text-construction-orange">Project Overview</p>
              <p>What is the overall scope of the project? (e.g., Building a deck, renovating a bathroom, installing new plumbing)</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Dimensions</p>
              <p>Include the exact measurements (e.g., length, width, height, area in square meters, volume in cubic meters).</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Materials</p>
              <p>Specify the type of materials you're planning to use (e.g., timber type for decking, tile material for bathroom, concrete grade for flooring).</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Finish and Details</p>
              <p>Describe any specific finishes, textures, or styles (e.g., polished concrete, matte paint finish, modern tiling pattern, gloss varnish).</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Location-Specific Details</p>
              <p>Are there any location-specific factors that could affect the project? (e.g., access to the site, difficult terrain, proximity to services).</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Timeframe</p>
              <p>Include your estimated timeline for the project (e.g., do you need it completed in a specific number of days or weeks?).</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Additional Work</p>
              <p>Are there any additional tasks or components that should be included in the project? (e.g., electrical work, plumbing installation, landscaping after construction).</p>
            </div>
            <div>
              <p className="font-medium text-construction-orange">Hourly Rates (Optional)</p>
              <p>If you'd like to include information about your company's hourly rates, please specify them here (e.g., carpenter rates, labor costs, subcontractor fees).</p>
            </div>
          </div>
          <div className="mb-3 text-white/70 text-sm italic">
            <span className="font-medium">Example for a Deck:</span> I want to build a 3x2 meter deck that will tie seamlessly into an existing deck which is 300mm off the ground. The deck will be constructed using H3.2 treated pine timber for the framework, ensuring durability in outdoor conditions, and will feature Vitex 140x20mm decking boards for the surface, chosen for its aesthetic appeal and natural resistance to the elements.

The deck will be laid in a picture frame design to create a neat, professional appearance around the perimeter. Once completed, the decking will be stained with a suitable wood stain that complements the natural color of the Vitex wood.

Additionally, the deck will feature a low-pitched roof with polycarbonate roofing sheets, offering protection from the elements while maintaining light and visibility. The project will be located at the back of the house with clear and easy access for materials and construction.

I an unsure how long the job will take to do the installation, finishing touches, and staining of the deck.

The work will be carried out by a qualified builder at an hourly rate of $75 plus GST and an apprentice at $50 per hour plus GST.

I also plan to add an 18% margin on all materials to account for procurement and handling costs.
The deck will have a low-pitched roof that will be framed out of H3.2 timber with corrugate iron for roofing.
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="bg-white/10 border-white/20 text-white resize-none min-h-[200px]"
            placeholder="Enter details about your project following the guidelines above..."
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
