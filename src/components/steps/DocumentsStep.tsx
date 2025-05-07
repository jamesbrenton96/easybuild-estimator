
import React, { useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Image, X, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DocumentsStep() {
  const { formData, updateFormData, prevStep, nextStep } = useEstimator();
  const isMobile = useIsMobile();
  const [fileError, setFileError] = useState<string | null>(null);

  // Remove empty files on mount or field change
  React.useEffect(() => {
    if (formData.files && Array.isArray(formData.files)) {
      const cleanedFiles = formData.files.filter(
        file => file && file.name && file.size > 0
      );
      if (cleanedFiles.length !== formData.files.length) {
        updateFormData({ files: cleanedFiles });
      }
    }
  }, [formData.files, updateFormData]); // Only runs when files change

  const isFilePDF = (file: File) => file.type === "application/pdf";
  const isFileJPEG = (file: File) => ["image/jpeg", "image/jpg"].includes(file.type);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFileError(null);

    // Filter blank/empty files
    const validFiles = selectedFiles.filter(file => file && file.name && file.size > 0);
    
    // Check current files plus new additions
    const existingValidFiles = Array.isArray(formData.files) ? formData.files : [];
    const combinedFiles = [...existingValidFiles, ...validFiles];
    
    const pdfFiles = combinedFiles.filter(isFilePDF);
    const jpegFiles = combinedFiles.filter(isFileJPEG);
    const otherFiles = combinedFiles.filter(file => !isFilePDF(file) && !isFileJPEG(file));
    
    // Validate file restrictions
    if (otherFiles.length > 0) {
      setFileError("Only JPEG and PDF files are allowed.");
      toast({
        variant: "destructive",
        title: "File type not allowed",
        description: "Only JPEG and PDF files are allowed."
      });
      return;
    }
    
    if (pdfFiles.length > 0 && jpegFiles.length > 0) {
      setFileError("You can upload either JPEG files OR a PDF file, not both.");
      toast({
        variant: "destructive",
        title: "Invalid file combination",
        description: "You can upload either JPEG files OR a PDF file, not both."
      });
      return;
    }
    
    if (pdfFiles.length > 1) {
      setFileError("You can upload a maximum of 1 PDF file.");
      toast({
        variant: "destructive",
        title: "Too many PDFs",
        description: "You can upload a maximum of 1 PDF file."
      });
      return;
    }
    
    if (jpegFiles.length > 4) {
      setFileError("You can upload a maximum of 4 JPEG files.");
      toast({
        variant: "destructive",
        title: "Too many JPEGs",
        description: "You can upload a maximum of 4 JPEG files."
      });
      return;
    }
    
    // Update form data with valid files
    updateFormData({
      files: combinedFiles
    });
  };

  const handleRemoveFile = (indexToRemove: number) => {
    if (formData.files && Array.isArray(formData.files)) {
      const updatedFiles = formData.files.filter((_, idx) => idx !== indexToRemove);
      updateFormData({ files: updatedFiles });
      setFileError(null);
    }
  };

  const files = (formData.files && Array.isArray(formData.files))
    ? formData.files.filter(f => f && f.name && f.size > 0)
    : [];

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Attach Documents</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please add only relevant documents for your project. You can upload either:
        </p>
        <ul className="text-white/80 list-disc list-inside max-w-md mx-auto mt-2 text-left">
          <li>Up to 4 JPEG files, OR</li>
          <li>1 PDF document</li>
        </ul>
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8 bg-white/5 border-white/20">
          <CardContent className="p-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full bg-white rounded p-2 mb-4"
              accept=".pdf,.jpg,.jpeg"
            />
            
            {fileError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-white text-sm">{fileError}</span>
              </div>
            )}
            
            <ScrollArea className="h-[200px] rounded-md border border-white/20 bg-white/10 p-4">
              {files.length > 0 ? (
                <ul className="space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-1 px-2 rounded-md bg-white/5"
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        {file.type.startsWith("image/")
                          ? <Image className="h-4 w-4 text-construction-orange" />
                          : <File className="h-4 w-4 text-blue-500" />}
                        <span className="text-white text-sm truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">
                          {Math.round(file.size / 1024)} KB
                        </span>
                        <button 
                          onClick={() => handleRemoveFile(idx)} 
                          className="p-1 hover:bg-white/10 rounded-full"
                          aria-label="Remove file"
                        >
                          <X className="h-4 w-4 text-white/70" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60 italic">No documents attached yet.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <div className={`flex ${isMobile ? "flex-col space-y-4" : "justify-between"}`}>
          <button onClick={prevStep} className={`btn-back ${isMobile ? "order-2" : ""}`}>Back</button>
          <button onClick={nextStep} className={`btn-next ${isMobile ? "order-1" : ""}`}>Next</button>
        </div>
      </div>
    </div>
  );
}
