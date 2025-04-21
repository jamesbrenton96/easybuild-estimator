
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RatesAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function RatesAccordion({ value, onChange }: RatesAccordionProps) {
  return (
    <>
      <Label htmlFor="rates" className="form-label mb-2 block">Company's hourly rates</Label>
      <Textarea
        id="rates"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="If you'd like to include information about your company's hourly rates, please specify them here (e.g., carpenter rates, labor costs, subcontractor fees)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Project Management Rate: $85 per hour + GST<br/>
          Builder Rate: $75 per hour + GST<br/>
          Apprentice Rate: $50 per hour + GST
        </p>
      </div>
    </>
  );
}
