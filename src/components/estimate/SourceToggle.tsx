
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SourceToggleProps {
  showSources: boolean;
  setShowSources: (show: boolean) => void;
}

export const SourceToggle: React.FC<SourceToggleProps> = ({ 
  showSources, 
  setShowSources 
}) => {
  return (
    <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-md mb-4">
      <Switch 
        id="show-sources" 
        checked={showSources} 
        onCheckedChange={setShowSources}
      />
      <Label htmlFor="show-sources" className="text-white cursor-pointer">
        Show material sources in PDF
      </Label>
    </div>
  );
};

export default SourceToggle;
