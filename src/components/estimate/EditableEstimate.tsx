
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";

interface EditableEstimateProps {
  initialContent: string;
  onSave: (content: string) => void;
}

export default function EditableEstimate({ initialContent, onSave }: EditableEstimateProps) {
  const [content, setContent] = useState(initialContent);
  
  const handleRevert = () => {
    setContent(initialContent);
  };
  
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-gray-800 font-semibold text-xl">Edit Estimate</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRevert}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Revert</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onSave(content)}
            className="bg-construction-orange hover:bg-construction-orange/90 flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
      <div className="p-6">
        <Textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="min-h-[500px] font-mono resize-vertical"
        />
      </div>
    </Card>
  );
}
