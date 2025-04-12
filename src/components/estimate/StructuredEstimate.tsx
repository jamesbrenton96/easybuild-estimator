
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Clock, Info } from "lucide-react";

interface StructuredEstimateProps {
  estimate: any;
}

export default function StructuredEstimate({ estimate }: StructuredEstimateProps) {
  return (
    <>
      {/* Project Overview */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-gray-800 font-medium text-lg">Project Overview</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700">{estimate.projectOverview || estimate.description || "Custom building project"}</p>
        </div>
      </div>
      
      {/* Scope of Work */}
      {estimate.scopeOfWork && (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-gray-800 font-medium text-lg">Scope of Work</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{estimate.scopeOfWork}</p>
          </div>
        </div>
      )}
      
      {/* Dimensions */}
      {estimate.dimensions && (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-gray-800 font-medium text-lg">Dimensions</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{estimate.dimensions}</p>
          </div>
        </div>
      )}
      
      {/* Cost Summary */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6 text-center">
          <h2 className="text-gray-800 text-lg font-medium mb-2">Total Estimated Cost</h2>
          <div className="text-4xl font-bold text-construction-orange mb-2">
            {formatCurrency(estimate.totalCost)}
          </div>
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Estimated Timeline: {estimate.timeline}</span>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200">
          <div className="p-6">
            <h3 className="text-gray-500 text-sm mb-2">Labor</h3>
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {formatCurrency(estimate.labor.cost)}
            </div>
            <div className="text-gray-600 text-sm">{estimate.labor.hours} hours</div>
          </div>
          
          <div className="p-6">
            <h3 className="text-gray-500 text-sm mb-2">Materials</h3>
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {formatCurrency(estimate.materials.cost)}
            </div>
            <div className="text-gray-600 text-sm">{estimate.materials.breakdown.length} items</div>
          </div>
        </div>
      </div>
      
      {/* Materials Breakdown */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <h2 className="text-gray-800 font-medium">Materials Breakdown</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {estimate.materials.breakdown.map((item: any, index: number) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-800 font-medium">{formatCurrency(item.cost)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Material Details & Calculations */}
      {estimate.materialDetails && (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-gray-800 font-medium text-lg">Material Details & Calculations</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{estimate.materialDetails}</p>
          </div>
        </div>
      )}
      
      {/* Notes */}
      <div className="bg-white rounded-lg p-4 shadow-lg mb-8 flex items-start">
        <Info className="h-5 w-5 text-construction-orange mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-gray-800 font-medium mb-1">Notes</h3>
          <p className="text-gray-600 text-sm">{estimate.notes}</p>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      {estimate.termsAndConditions && (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-gray-800 font-medium text-lg">Terms & Conditions</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{estimate.termsAndConditions}</p>
          </div>
        </div>
      )}
    </>
  );
}
