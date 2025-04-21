
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LocationDetailsAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function LocationDetailsAccordion({ value, onChange }: LocationDetailsAccordionProps) {
  return (
    <>
      <Label htmlFor="locationDetails" className="form-label mb-2 block">Are there any location-specific factors that could affect the project?</Label>
      <Textarea
        id="locationDetails"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="Are there any location-specific factors that could affect the project? (e.g., access to the site, difficult terrain, proximity to services)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Site Location: At the back of the house<br/>
          Access: Clear and easy access for materials and construction
        </p>
      </div>
    </>
  );
}
