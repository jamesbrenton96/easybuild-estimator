
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalWorkAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function AdditionalWorkAccordion({ value, onChange }: AdditionalWorkAccordionProps) {
  return (
    <>
      <Label htmlFor="additionalWork" className="form-label mb-2 block">Are there any additional tasks or components?</Label>
      <Textarea
        id="additionalWork"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="Are there any additional tasks or components that should be included in the project? (e.g., electrical work, plumbing installation, landscaping after construction)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Take into account a small 2.5m long rotten weatherboard on the house underneath a window that needs to be replaced.
        </p>
      </div>
    </>
  );
}
