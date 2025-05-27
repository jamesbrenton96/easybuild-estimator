
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Settings } from "lucide-react";
import { useEstimator } from "@/context/EstimatorContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function VisibilityToggles() {
  const {
    showMaterialSources,
    setShowMaterialSources,
    showMaterialCalculations,
    setShowMaterialCalculations,
    showLaborBreakdown,
    setShowLaborBreakdown,
    showTimeline,
    setShowTimeline,
    showNotesAndTerms,
    setShowNotesAndTerms,
    showCorrespondence,
    setShowCorrespondence,
  } = useEstimator();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
            <span>Visibility Settings</span>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <div className="bg-white/10 p-4 rounded-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {showCorrespondence ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-white" />
                  )}
                  <Label htmlFor="show-correspondence" className="text-sm text-white cursor-pointer">
                    Correspondence
                  </Label>
                </div>
                <Switch
                  id="show-correspondence"
                  checked={showCorrespondence}
                  onCheckedChange={setShowCorrespondence}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {showMaterialSources ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-white" />
                  )}
                  <Label htmlFor="show-sources" className="text-sm text-white cursor-pointer">
                    Material sources
                  </Label>
                </div>
                <Switch
                  id="show-sources"
                  checked={showMaterialSources}
                  onCheckedChange={setShowMaterialSources}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {showMaterialCalculations ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-white" />
                  )}
                  <Label htmlFor="show-calculations" className="text-sm text-white cursor-pointer">
                    Material calculations
                  </Label>
                </div>
                <Switch
                  id="show-calculations"
                  checked={showMaterialCalculations}
                  onCheckedChange={setShowMaterialCalculations}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {showLaborBreakdown ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-white" />
                  )}
                  <Label htmlFor="show-labor" className="text-sm text-white cursor-pointer">
                    Labor breakdown
                  </Label>
                </div>
                <Switch
                  id="show-labor"
                  checked={showLaborBreakdown}
                  onCheckedChange={setShowLaborBreakdown}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {showTimeline ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-white" />
                  )}
                  <Label htmlFor="show-timeline" className="text-sm text-white cursor-pointer">
                    Timeline
                  </Label>
                </div>
                <Switch
                  id="show-timeline"
                  checked={showTimeline}
                  onCheckedChange={setShowTimeline}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  {showNotesAndTerms ? (
                    <Eye className="h-4 w-4 text-white" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-white" />
                  )}
                  <Label htmlFor="show-notes" className="text-sm text-white cursor-pointer">
                    Notes and terms
                  </Label>
                </div>
                <Switch
                  id="show-notes"
                  checked={showNotesAndTerms}
                  onCheckedChange={setShowNotesAndTerms}
                />
              </div>

            </div>
            
            <p className="text-white/70 text-xs mt-3">
              These settings control what sections appear in both the preview and PDF download.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
