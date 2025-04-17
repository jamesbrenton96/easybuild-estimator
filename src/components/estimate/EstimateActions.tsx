
import React from "react";
import { ArrowLeft, Download, Share2 } from "lucide-react";

interface EstimateActionsProps {
  onDownloadPDF: () => void;
  onStartNew: () => void;
  onShare: () => void;
}

export default function EstimateActions({ onDownloadPDF, onStartNew, onShare }: EstimateActionsProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button 
          onClick={onDownloadPDF}
          className="inline-flex items-center justify-center bg-construction-orange hover:bg-construction-orange/90 text-white font-medium rounded-md px-5 py-3 transition-all"
        >
          <Download className="h-5 w-5 mr-2" />
          Save as PDF
        </button>
        
        <button 
          onClick={onShare}
          className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium rounded-md px-5 py-3 transition-all"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Estimate
        </button>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={onStartNew}
          className="inline-flex items-center text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Start New Estimate
        </button>
      </div>
    </>
  );
}
