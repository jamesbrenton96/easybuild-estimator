
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FinishAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function FinishAccordion({ value, onChange }: FinishAccordionProps) {
  return (
    <>
      <Label htmlFor="finish" className="form-label mb-2 block">Describe any specific finishes, textures, or styles</Label>
      <Textarea
        id="finish"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="Describe any specific finishes, textures, or styles (e.g., polished concrete, matte paint finish, modern tiling pattern, gloss varnish)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Decking Design: Picture frame design around the perimeter for a neat appearance<br/>
          Finish: Deck will be stained with a wood stain that complements the natural color of the Vitex timber<br/>
          Roof: Low-pitched roof with polycarbonate roofing sheets for light and visibility<br/>
          Aesthetic Appeal: The deck's natural look will complement the existing deck
        </p>
      </div>
    </>
  );
}
