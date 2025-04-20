
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Clock, Info, AlertTriangle } from "lucide-react";

interface StructuredEstimateProps {
  estimate: any;
}

export default function StructuredEstimate({ estimate }: StructuredEstimateProps) {
  // Check if the estimate object has the expected structure
  const hasValidStructure = 
    estimate && 
    (estimate.labor || estimate.labour) && 
    estimate.materials && 
    (typeof estimate.totalCost === 'number' || typeof estimate.totalCost === 'string');
  
  if (!hasValidStructure) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-gray-800 font-medium text-lg">Project Overview</h2>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-700">
                  <strong>Note:</strong> The structured estimate does not contain valid data.
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  Please try submitting your project information again.
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700">
            {estimate.projectOverview || estimate.description || "Custom building project"}
          </p>
        </div>
      </div>
    );
  }
  
  // Normalize labor/labour differences
  const laborData = estimate.labor || estimate.labour || { cost: 0, hours: 0 };
  
  // Make sure totalCost is a number
  const totalCost = typeof estimate.totalCost === 'string' 
    ? parseFloat(estimate.totalCost.replace(/[^\d.-]/g, '')) 
    : estimate.totalCost;
  
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
            {formatCurrency(totalCost)}
          </div>
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Estimated Timeline: {estimate.timeline || "Not specified"}</span>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-t border-gray-200">
          <div className="p-6">
            <h3 className="text-gray-500 text-sm mb-2">Labor</h3>
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {formatCurrency(laborData.cost)}
            </div>
            <div className="text-gray-600 text-sm">{laborData.hours || "0"} hours</div>
          </div>
          
          <div className="p-6">
            <h3 className="text-gray-500 text-sm mb-2">Materials</h3>
            <div className="text-2xl font-semibold text-gray-800 mb-1">
              {formatCurrency(estimate.materials.cost)}
            </div>
            <div className="text-gray-600 text-sm">
              {estimate.materials.breakdown && Array.isArray(estimate.materials.breakdown) 
                ? `${estimate.materials.breakdown.length} items` 
                : "Materials breakdown not available"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Materials Breakdown */}
      {estimate.materials.breakdown && Array.isArray(estimate.materials.breakdown) && estimate.materials.breakdown.length > 0 && (
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
      )}
      
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
      {estimate.notes && (
        <div className="bg-white rounded-lg p-4 shadow-lg mb-8 flex items-start">
          <Info className="h-5 w-5 text-construction-orange mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-gray-800 font-medium mb-1">Notes</h3>
            <p className="text-gray-600 text-sm">{estimate.notes}</p>
          </div>
        </div>
      )}
    </>
  );
}
