
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormSubmitter } from "../submitter/FormSubmitter";
import ReviewDetails from "../submitter/ReviewDetails";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Image, File } from "lucide-react";

export default function SubmitStep() {
  const { formData, prevStep, nextStep, setIsLoading, setEstimationResults } = useEstimator();
  const isMobile = useIsMobile();
  
  // Format the description for better readability
  const formatDescription = (description: string) => {
    if (!description) return "";
    
    // Replace single newlines with two newlines for better readability
    return description
      .split('\n')
      .map(line => {
        // Add extra formatting for headers to make them stand out
        if (line.startsWith('# ')) {
          return `\n${line}`;
        }
        return line;
      })
      .join('\n');
  };
  
  // Format the display content for better readability in the preview
  const formatPreviewContent = (description: string) => {
    if (!description) return [];
    
    const sections: {title: string, content: string}[] = [];
    let currentTitle = "";
    let currentContent = "";
    
    description.split('\n').forEach(line => {
      if (line.startsWith('# ')) {
        // Save the previous section if it exists
        if (currentTitle) {
          sections.push({ title: currentTitle, content: currentContent.trim() });
          currentContent = "";
        }
        // Set the new title
        currentTitle = line.replace('# ', '');
      } else if (line.trim()) {
        // Add to current content
        currentContent += line + '\n';
      }
    });
    
    // Add the last section
    if (currentTitle) {
      sections.push({ title: currentTitle, content: currentContent.trim() });
    }
    
    return sections;
  };
  
  const formattedSections = formatPreviewContent(formData.description || "");
  
  // Get file type icon
  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return <Image className="h-4 w-4 text-construction-orange" />;
    }
    
    return <File className="h-4 w-4 text-blue-500" />;
  };
  
  // Make sure files array exists and is not empty
  const files = Array.isArray(formData.files) ? formData.files.filter(file => file && file.name) : [];
  
  // Log files for debugging
  React.useEffect(() => {
    if (files.length > 0) {
      console.log(`Attached files (${files.length}):`, 
        files.map((f: any) => ({name: f.name, type: f.type, size: `${Math.round(f.size/1024)} KB`})));
    } else {
      console.log("No files attached");
    }
  }, [files]);
  
  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Generate Your Estimate</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please review your information before submitting.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ReviewDetails formData={formData} />
        
        <Card className="mb-8 bg-white/5 border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-2">Project Details Preview</h3>
            <ScrollArea className="h-[400px] rounded-md border border-white/20 bg-white/10 p-4">
              <div className="space-y-6">
                {formattedSections.map((section, index) => (
                  <div key={index} className="pb-4 border-b border-white/10 last:border-0">
                    <h4 className="text-white font-medium mb-2">{section.title}</h4>
                    <div className="text-white/90 whitespace-pre-wrap text-sm pl-3 border-l-2 border-white/20">
                      {section.content}
                    </div>
                  </div>
                ))}
                
                {formattedSections.length === 0 && (
                  <p className="text-white/70 text-center italic">No project details provided</p>
                )}
              </div>
            </ScrollArea>
            <p className="text-white/70 text-xs mt-2">
              This is how your project details will be sent to our AI estimator. You can edit this content in the review step.
            </p>
          </CardContent>
        </Card>
        
        {files.length > 0 && (
          <Card className="mb-8 bg-white/5 border-white/20">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">Attached Files ({files.length})</h3>
              <ScrollArea className="h-[150px] rounded-md border border-white/20 bg-white/10 p-3">
                <ul className="space-y-2">
                  {files.map((file: File, index: number) => (
                    <li key={index} className="flex items-center justify-between py-1 px-2 rounded-md bg-white/5">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        {getFileIcon(file)}
                        <span className="text-white text-sm truncate">{file.name}</span>
                      </div>
                      <span className="text-white/60 text-xs">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
        
        <div className="text-center text-white/80 text-sm mb-8">
          By submitting, our AI will analyze your project details and generate an estimate.
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between'}`}>
          <button
            onClick={prevStep}
            className={`btn-back ${isMobile ? 'order-2' : ''}`}
          >
            Back
          </button>
          
          <FormSubmitter 
            formData={formData}
            setIsLoading={setIsLoading}
            setEstimationResults={setEstimationResults}
            nextStep={nextStep}
            isMobile={isMobile}
          />
        </div>
      </div>
    </motion.div>
  );
}
