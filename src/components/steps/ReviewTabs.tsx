
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

export function ReviewTabs({ estimationResults, setEstimationResults }: {
  estimationResults: any,
  setEstimationResults: (r: any) => void,
}) {
  const [activeTab, setActiveTab] = useState("view");
  const estimateRef = useRef<HTMLDivElement>(null);

  if (!estimationResults) return null;

  const processEstimationResults = useProcessEstimationResults(estimationResults);

  const handleSaveEdits = (editedContent: string) => {
    setEstimationResults({
      ...estimationResults,
      markdownContent: editedContent
    });
    setActiveTab("view");
    toast.success("Your changes have been saved");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto mb-4">
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
        <div ref={estimateRef} className="max-w-3xl mx-auto pdf-content bg-white p-8 rounded-lg shadow-lg">
          <style dangerouslySetInnerHTML={{ __html: `
            .pdf-content {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.6;
            }
            /* ... keep view estimate CSS inline as before ... */
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
