
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MaterialsAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function MaterialsAccordion({ value, onChange }: MaterialsAccordionProps) {
  return (
    <>
      <Label htmlFor="materials" className="form-label mb-2 block">Specify the type of materials you're planning to use</Label>
      <Textarea
        id="materials"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="Specify the type of materials you're planning to use (e.g., timber type for decking, tile material for bathroom, concrete grade for flooring)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Framework: H3.2 treated pine timber<br/>
          Decking Boards: 140x20mm Vitex timber<br/>
          Roofing: Polycarbonate roofing sheets for the deck roof<br/>
          Finish: Wood stain (suitable for Vitex wood)<br/>
          Roof Frame: H3.2 treated pine<br/>
          Roofing Sheets: Corrugated iron
        </p>
      </div>
    </>
  );
}
