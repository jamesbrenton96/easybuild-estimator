
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TimeframeAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function TimeframeAccordion({ value, onChange }: TimeframeAccordionProps) {
  return (
    <>
      <Label htmlFor="timeframe" className="form-label mb-2 block">Include your estimated timeline for the project</Label>
      <Textarea
        id="timeframe"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="Include your estimated timeline for the project (e.g., do you need it completed in a specific number of days or weeks?)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> The duration is unclear, but it will include installation, finishing touches, and staining. Estimated timeline is needed to determine exact completion time.
        </p>
      </div>
    </>
  );
}
