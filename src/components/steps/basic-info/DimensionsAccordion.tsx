
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DimensionsAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function DimensionsAccordion({ value, onChange }: DimensionsAccordionProps) {
  return (
    <>
      <Label htmlFor="dimensions" className="form-label mb-2 block">Include the exact measurements</Label>
      <Textarea
        id="dimensions"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="Include the exact measurements (e.g., length, width, height, area in square meters, volume in cubic meters)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Deck Size: 3 meters (length) x 2 meters (width)<br/>
          Existing Deck Height: 300mm off the ground<br/>
          Decking Boards: 140x20mm Vitex<br/>
          Roof Pitch: Low-pitched roof<br/>
          - Take into account any extra materials that might be needed.
        </p>
      </div>
    </>
  );
}
