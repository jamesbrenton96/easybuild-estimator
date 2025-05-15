
import React from "react";
import EstimateHeader from "../estimate/EstimateHeader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useEstimator } from "@/context/EstimatorContext";

export const ReviewHeader = () => {
  const { showMaterialSources, setShowMaterialSources } = useEstimator();
  
  return (
    <div>
      <EstimateHeader />
      <div className="flex justify-end items-center mt-4 mb-2 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-md">
          {showMaterialSources ? (
            <Eye className="h-4 w-4 text-white" />
          ) : (
            <EyeOff className="h-4 w-4 text-white" />
          )}
          <Label htmlFor="show-sources" className="text-sm text-white cursor-pointer">
            Show material sources
          </Label>
          <Switch
            id="show-sources"
            checked={showMaterialSources}
            onCheckedChange={setShowMaterialSources}
          />
        </div>
      </div>
    </div>
  );
};
