
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MarginAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function MarginAccordion({ value, onChange }: MarginAccordionProps) {
  return (
    <>
      <Label htmlFor="margin" className="form-label mb-2 block">Profit margin for materials</Label>
      <Textarea
        id="margin"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="If you'd like to include a margin for materials, please specify the percentage here (e.g., 18% to cover procurement, handling, and additional costs)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Materials Margin: 18% on all materials for procurement and handling costs
        </p>
      </div>
    </>
  );
}
