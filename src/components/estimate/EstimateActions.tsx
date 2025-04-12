
import React from "react";
import { ArrowLeft, Download } from "lucide-react";

interface EstimateActionsProps {
  onDownloadPDF: () => void;
  onStartNew: () => void;
}

export default function EstimateActions({ onDownloadPDF, onStartNew }: EstimateActionsProps) {
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
        
        <button className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium rounded-md px-5 py-3 transition-all">
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
