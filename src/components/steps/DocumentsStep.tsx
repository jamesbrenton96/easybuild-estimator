
import React, { useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { Upload, X, FileText, Image } from "lucide-react";
import { toast } from "sonner";

export default function DocumentsStep() {
  const { formData, updateFormData, nextStep, prevStep } = useEstimator();
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    const imageFiles = newFiles.filter(file => 
      file.type === 'image/jpeg' || 
      file.type === 'image/png'
    );
    
    const existingPdfFiles = formData.files.filter(file => 
      file.type === 'application/pdf'
    );
    
    if (pdfFiles.length > 1 || (existingPdfFiles.length > 0 && pdfFiles.length > 0)) {
      toast.error("Only one PDF file is allowed", {
        description: "Please remove existing PDF before uploading a new one."
      });
      return;
    }
    
    if (newFiles.some(file => 
      !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    )) {
      toast.error("Invalid file type", {
        description: "Only PDF, JPEG, and PNG files are allowed."
      });
      return;
    }
    
    const existingNonPdfFiles = formData.files.filter(file => 
      file.type !== 'application/pdf'
    );
    
    updateFormData({ 
      files: [...existingNonPdfFiles, ...imageFiles, ...pdfFiles] 
    });
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    updateFormData({ files: updatedFiles });
  };
  
  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return <Image className="h-5 w-5 text-construction-orange" />;
    }
    
    return <FileText className="h-5 w-5 text-construction-orange" />;
  };

  const handleNextStep = () => {
    if (formData.files.length === 0) {
      toast.error("Please upload at least one document", {
        description: "At least one file (PDF or image) is required to proceed."
      });
      return;
    }
    
    nextStep();
  };

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Upload Documents</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Upload supporting documents for your project. You may include one optional PDF document and multiple images (JPEG, PNG).
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            dragActive ? "border-construction-orange bg-white/10" : "border-white/30"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer py-6">
            <motion.div 
              animate={{ y: dragActive ? -5 : 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 bg-white/10 p-3 rounded-full"
            >
              <Upload className="h-6 w-6 text-construction-orange" />
            </motion.div>
            <p className="text-white font-medium">Drag and drop files here, or click to browse</p>
            <p className="text-white/60 text-sm mt-1">Optional PDF file (maximum one) and JPEG/PNG images</p>
          </label>
        </div>
        
        {formData.files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white font-medium mb-3">Uploaded Files ({formData.files.length})</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto rounded-md bg-white/5 p-2">
              {formData.files.map((file, index) => (
                <li key={index} className="flex items-center justify-between py-2 px-3 rounded-md bg-white/5">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    {getFileIcon(file)}
                    <span className="text-white text-sm truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={prevStep}
            className="btn-back"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="btn-next"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
