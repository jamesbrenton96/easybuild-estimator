
import React, { useEffect } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, FileText, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReviewStep() {
  const { estimationResults, setStep } = useEstimator();
  
  // If there are no results, redirect to step 1
  useEffect(() => {
    if (!estimationResults) {
      setStep(1);
    }
  }, [estimationResults, setStep]);
  
  if (!estimationResults) {
    return null;
  }
  
  const { estimate } = estimationResults;

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your Construction Estimate</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Here's a breakdown of your project's estimated costs and timeline.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {/* Cost Summary */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 mb-8">
          <div className="p-6 text-center">
            <h2 className="text-white text-lg font-medium mb-2">Total Estimated Cost</h2>
            <div className="text-4xl font-bold text-construction-orange mb-2">
              {formatCurrency(estimate.totalCost)}
            </div>
            <div className="flex items-center justify-center text-white/70">
              <Clock className="w-4 h-4 mr-1" />
              <span>Estimated Timeline: {estimate.timeline}</span>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-t border-white/10">
            <div className="p-6">
              <h3 className="text-white/70 text-sm mb-2">Labor</h3>
              <div className="text-2xl font-semibold text-white mb-1">
                {formatCurrency(estimate.labor.cost)}
              </div>
              <div className="text-white/70 text-sm">{estimate.labor.hours} hours</div>
            </div>
            
            <div className="p-6">
              <h3 className="text-white/70 text-sm mb-2">Materials</h3>
              <div className="text-2xl font-semibold text-white mb-1">
                {formatCurrency(estimate.materials.cost)}
              </div>
              <div className="text-white/70 text-sm">{estimate.materials.breakdown.length} items</div>
            </div>
          </div>
        </div>
        
        {/* Materials Breakdown */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 mb-8">
          <div className="p-4 border-b border-white/10 flex items-center">
            <h2 className="text-white font-medium">Materials Breakdown</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {estimate.materials.breakdown.map((item, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <span className="text-white">{item.name}</span>
                <span className="text-white font-medium">{formatCurrency(item.cost)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-8 flex items-start">
          <Info className="h-5 w-5 text-construction-orange mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-white font-medium mb-1">Notes</h3>
            <p className="text-white/80 text-sm">{estimate.notes}</p>
          </div>
        </div>
        
        {/* Export and Share Options */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium rounded-md px-5 py-3 transition-all">
            <FileText className="h-5 w-5 mr-2" />
            Save as PDF
          </button>
          
          <button className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium rounded-md px-5 py-3 transition-all">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share Estimate
          </button>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Start New Estimate
          </button>
        </div>
      </div>
    </motion.div>
  );
}
