import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Image, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function DocumentsStep() {
  const { formData, updateFormData, prevStep, nextStep } = useEstimator();
  const isMobile = useIsMobile();
  
  const MAX_FILE_SIZE_MB = 4; // 4MB maximum file size (reduced from 5MB)
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Filter blank/empty files
    const cleanedFiles = selectedFiles.filter(file => file && file.name && file.size > 0);

    // Check file size limits
    const oversizedFiles = cleanedFiles.filter(file => file.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      toast.error(`Files exceeding ${MAX_FILE_SIZE_MB}MB limit: ${fileNames}`);
      e.target.value = ''; // Reset the input
      return;
    }

    // Count existing files by type
    const existingFiles = formData.files && Array.isArray(formData.files) 
      ? formData.files.filter(f => f && f.name && f.size > 0) 
      : [];
    
    const existingPdfFiles = existingFiles.filter((file: File) => file.type === "application/pdf");
    const existingImageFiles = existingFiles.filter((file: File) => 
      file.type === "image/jpeg" || file.type === "image/png");
    
    // Count new files by type
    const newPdfFiles = cleanedFiles.filter(file => file.type === "application/pdf");
    const newImageFiles = cleanedFiles.filter(file => 
      file.type === "image/jpeg" || file.type === "image/png");
    
    // Check if any unsupported file types
    const unsupportedFiles = cleanedFiles.filter(file => 
      file.type !== "application/pdf" && 
      file.type !== "image/jpeg" && 
      file.type !== "image/png");
    
    if (unsupportedFiles.length > 0) {
      toast.error("Only PDF, JPEG, or PNG files are allowed");
      e.target.value = ''; // Reset the input
      return;
    }

    // Enforce file type limitations
    if (newPdfFiles.length > 0 && existingImageFiles.length > 0) {
      toast.error("You can only upload either PDF or image files, not both");
      e.target.value = ''; // Reset the input
      return;
    }
    
    if (newImageFiles.length > 0 && existingPdfFiles.length > 0) {
      toast.error("You can only upload either PDF or image files, not both");
      e.target.value = ''; // Reset the input
      return;
    }
    
    // Check PDF limit (max 1)
    if ((existingPdfFiles.length + newPdfFiles.length) > 1) {
      toast.error("Only 1 PDF file is allowed");
      e.target.value = ''; // Reset the input
      return;
    }
    
    // Check image files limit (max 2)
    if (newImageFiles.length > 0) {
      const totalImageCount = existingImageFiles.length + newImageFiles.length;
      if (totalImageCount > 2) {
        toast.error("Maximum 2 image files are allowed");
        e.target.value = ''; // Reset the input
        return;
      }
    }
    
    // All checks passed, update form data
    const updatedFiles = [...existingFiles, ...cleanedFiles];
    updateFormData({
      files: updatedFiles
    });
    
    e.target.value = ''; // Reset the input for next upload
  };

  const handleRemoveFile = (index: number) => {
    const currentFiles = [...(formData.files || [])];
    currentFiles.splice(index, 1);
    updateFormData({ files: currentFiles });
  };

  const files = (formData.files && Array.isArray(formData.files))
    ? formData.files.filter(f => f && f.name && f.size > 0)
    : [];

  const hasPdf = files.some((file: File) => file.type === "application/pdf");
  const hasImages = files.some((file: File) => file.type === "image/jpeg" || file.type === "image/png");
  const imageCount = files.filter((file: File) => file.type === "image/jpeg" || file.type === "image/png").length;

  // No validation needed for next step, can proceed with 0-2 images or 0-1 PDF
  const handleNextStep = () => {
    nextStep();
  };

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Attach Documents</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          {hasPdf ? 
            "You've uploaded 1 PDF document." :
            hasImages ? 
              `You've uploaded ${imageCount} of maximum 2 image files.` :
              "Please attach up to 2 images (JPEG/PNG), 1 PDF document, or continue without attaching files."
          }
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8 bg-white/5 border-white/20">
          <CardContent className="p-4">
            <div className="bg-white/10 rounded p-3 mb-4 border border-white/20 flex items-center gap-2 text-sm text-white/80">
              <AlertCircle className="h-4 w-4 text-white/80" />
              <span>
                {hasPdf 
                  ? "Only 1 PDF file is allowed"
                  : hasImages 
                    ? `You've uploaded ${imageCount} of maximum 2 image files`
                    : "Choose either 1 PDF file (max 4MB) or up to 2 image files (max 4MB each)"}
              </span>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full bg-white rounded p-2 mb-4"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={!hasPdf && imageCount < 2}
            />
            <ScrollArea className="h-[200px] rounded-md border border-white/20 bg-white/10 p-4">
              {files.length > 0 ? (
                <ul className="space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-1 px-2 rounded-md bg-white/5"
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        {file.type === "application/pdf" ? (
                          <File className="h-4 w-4 text-red-500" />
                        ) : (
                          <Image className="h-4 w-4 text-construction-orange" />
                        )}
                        <span className="text-white text-sm truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-xs">
                          {Math.round(file.size / 1024)} KB
                        </span>
                        <button 
                          onClick={() => handleRemoveFile(idx)}
                          className="text-white/60 hover:text-red-400 text-xs px-2 py-1"
                        >
                          ✕
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
          <button onClick={handleNextStep} className={`btn-next ${isMobile ? "order-1" : ""}`}>Next</button>
        </div>
      </div>
    </div>
  );
}
