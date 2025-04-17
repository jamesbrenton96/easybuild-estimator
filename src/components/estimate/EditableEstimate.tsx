
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw, AlertOctagon } from "lucide-react";

interface EditableEstimateProps {
  initialContent: string;
  onSave: (content: string) => void;
}

export default function EditableEstimate({ initialContent, onSave }: EditableEstimateProps) {
  const [content, setContent] = useState(initialContent);
  
  const handleRevert = () => {
    setContent(initialContent);
  };
  
  // A simple formatting function to make the content more readable
  const formatMarkdown = (text: string) => {
    // Add proper line breaks between sections
    return text
      .replace(/^#\s+([^\n]+)/gm, "\n\n# $1\n") // Add space before and after headers
      .replace(/^\s*\n+/gm, "\n") // Remove multiple consecutive blank lines
      .trim();
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
            onClick={() => {
              // Format the content before saving
              const formattedContent = formatMarkdown(content);
              onSave(formattedContent);
            }}
            className="bg-construction-orange hover:bg-construction-orange/90 flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
      <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
        <AlertOctagon className="h-5 w-5 text-amber-500" />
        <p className="text-sm text-amber-700">
          Edit your content using Markdown formatting. Use # for headings, * for bullets, and blank lines between sections.
        </p>
      </div>
      <div className="p-6">
        <Textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="min-h-[600px] font-mono resize-vertical text-sm leading-relaxed"
          placeholder="# Project Title

# Materials
- Item 1
- Item 2

# Labor
..."
        />
      </div>
    </Card>
  );
}
