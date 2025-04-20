
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Image } from "lucide-react";

export default function DocumentsStep() {
  const { formData, setFormData, prevStep, nextStep } = useEstimator();
  const isMobile = useIsMobile();

  // Remove empty files on mount or field change
  React.useEffect(() => {
    if (formData.files && Array.isArray(formData.files)) {
      const cleanedFiles = formData.files.filter(
        file => file && file.name && file.size > 0
      );
      if (cleanedFiles.length !== formData.files.length) {
        setFormData({ ...formData, files: cleanedFiles });
      }
    }
  }, [formData.files, setFormData]); // Only runs when files change

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Filter blank/empty files
    const cleanedFiles = files.filter(file => file && file.name && file.size > 0);
    setFormData({
      ...formData,
      files: cleanedFiles
    });
  };

  const files = (formData.files && Array.isArray(formData.files))
    ? formData.files.filter(f => f && f.name && f.size > 0)
    : [];

  return (
    <div className="step-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Attach Documents</h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please add only relevant documents for your project. Accepted formats are PDF, images, etc.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8 bg-white/5 border-white/20">
          <CardContent className="p-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full bg-white rounded p-2 mb-4"
              accept=".pdf,image/*"
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
                        {file.type.startsWith("image/")
                          ? <Image className="h-4 w-4 text-construction-orange" />
                          : <File className="h-4 w-4 text-blue-500" />}
                        <span className="text-white text-sm truncate">{file.name}</span>
                      </div>
                      <span className="text-white/60 text-xs">
                        {Math.round(file.size / 1024)} KB
                      </span>
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
