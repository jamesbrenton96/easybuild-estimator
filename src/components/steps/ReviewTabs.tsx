
import React, { useState, useRef } from "react";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Pencil, FileText } from "lucide-react";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import EditableEstimate from "../estimate/EditableEstimate";
import { useProcessEstimationResults } from "../submitter/useProcessEstimationResults";
import FallbackEstimate from "../estimate/FallbackEstimate";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { useEstimator } from "@/context/EstimatorContext";

export function ReviewTabs({ estimationResults, setEstimationResults }: {
  estimationResults: any,
  setEstimationResults: (r: any) => void,
}) {
  const [activeTab, setActiveTab] = useState("view");
  const estimateRef = useRef<HTMLDivElement>(null);
  const { formData, showMaterialSources, showMaterialBreakdown } = useEstimator();
  
  if (!estimationResults) return null;

  // Extract project details from form data
  const projectDetails = {
    clientName: formData?.clientName || formData?.subcategories?.correspondence?.clientName || "",
    projectAddress: formData?.projectAddress || formData?.location || "",
    projectType: formData?.projectType || "",
    correspondenceType: formData?.subcategories?.correspondence?.type || "quote",
    date: new Date().toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  const processEstimationResults = useProcessEstimationResults(estimationResults, projectDetails);

  const handleSaveEdits = (editedContent: string) => {
    setEstimationResults({
      ...estimationResults,
      markdownContent: editedContent
    });
    setActiveTab("view");
    toast.success("Your changes have been saved");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto mb-4">
      <TabsList className="grid w-full grid-cols-2 bg-white/10">
        <TabsTrigger value="view" className="flex items-center gap-2 text-white data-[state=active]:bg-construction-orange data-[state=active]:text-white">
          <FileText className="h-4 w-4" />
          <span>View Estimate</span>
        </TabsTrigger>
        <TabsTrigger value="edit" className="flex items-center gap-2 text-white data-[state=active]:bg-construction-orange data-[state=active]:text-white">
          <Pencil className="h-4 w-4" />
          <span>Edit Estimate</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="view">
        <div ref={estimateRef} className="max-w-4xl mx-auto pdf-content bg-white p-0 rounded-lg shadow-lg">
          <style dangerouslySetInnerHTML={{ __html: `
            .pdf-content {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.6;
            }
            
            /* Project title */
            .project-title-wrapper {
              text-align: center;
              margin: 20px 0 30px 0;
              position: relative;
            }
            
            .project-title {
              font-size: 24px;
              color: #e58c33;
              font-weight: bold;
              display: inline-block;
              position: relative;
            }
            
            .project-title:after {
              content: '';
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 80px;
              height: 3px;
              background-color: #e58c33;
            }
            
            /* Section headers */
            .section-header {
              color: #e58c33;
              text-transform: uppercase;
              font-weight: bold;
              border-bottom: 1px solid #e58c33;
              padding-bottom: 5px;
              margin-bottom: 12px;
              margin-top: 25px;
              font-size: 16px;
              letter-spacing: 0.03em;
              display: flex;
              align-items: center;
            }
            
            .section-number {
              background: #e58c33;
              color: white;
              border-radius: 50%;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
              font-size: 14px;
              flex-shrink: 0;
            }
            
            /* Table styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0 20px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            
            tr:nth-child(even) {
              background-color: #fafafa;
            }
            
            tr:last-child {
              border-bottom: 2px solid #ddd;
            }
            
            /* Totals row */
            tr:last-child td {
              font-weight: bold;
            }
            
            /* Bullet points */
            .scope-bullet {
              display: flex;
              align-items: flex-start;
              margin-bottom: 5px;
            }
            
            .bullet-marker {
              color: #e58c33;
              margin-right: 8px;
              font-size: 16px;
            }
            
            /* Correspondence items */
            .correspondence-item {
              display: flex;
              align-items: baseline;
              margin-bottom: 6px;
              line-height: 1.4;
            }

            /* Source column visibility based on toggle */
            ${!showMaterialSources ? `
              table th:nth-child(5),
              table td:nth-child(5) {
                display: none;
              }
            ` : ''}
            
            /* Material breakdown visibility based on toggle */
            ${!showMaterialBreakdown ? `
              /* Hide specific material breakdown sections */
              h1:contains('MATERIALS AND COST BREAKDOWN'),
              h2:contains('MATERIALS AND COST BREAKDOWN'),
              h2:contains('Materials and Cost Breakdown'),
              h2:contains('MATERIAL AND COST BREAKDOWN'),
              h2:contains('Material and Cost Breakdown') {
                display: none !important;
              }
              
              /* Hide tables under material breakdown headers */
              h1:contains('MATERIALS AND COST BREAKDOWN') + table,
              h2:contains('MATERIALS AND COST BREAKDOWN') + table,
              h2:contains('Materials and Cost Breakdown') + table,
              h2:contains('MATERIAL AND COST BREAKDOWN') + table,
              h2:contains('Material and Cost Breakdown') + table {
                display: none !important;
              }
              
              /* Hide the material calculation notes after material breakdown tables */
              h1:contains('MATERIALS AND COST BREAKDOWN') + table + p,
              h2:contains('MATERIALS AND COST BREAKDOWN') + table + p,
              h2:contains('Materials and Cost Breakdown') + table + p,
              h2:contains('MATERIAL AND COST BREAKDOWN') + table + p,
              h2:contains('Material and Cost Breakdown') + table + p,
              p:contains('Material calculation notes') {
                display: none !important;
              }
              
              /* Make sure summary totals remain visible */
              tr:contains('Materials Subtotal'),
              tr:contains('Materials Total'),
              tr:contains('Materials Grand Total'),
              tr:contains('GST'),
              tr:contains('Builder\'s Margin'),
              .material-summary {
                display: table-row !important;
              }
            ` : ''}
          `}} />
          {processEstimationResults}
        </div>
      </TabsContent>
      
      <TabsContent value="edit">
        <EditableEstimate
          initialContent={estimationResults.markdownContent || ""}
          onSave={handleSaveEdits}
        />
      </TabsContent>
    </Tabs>
  );
}
