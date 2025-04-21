
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OverviewAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function OverviewAccordion({ value, onChange }: OverviewAccordionProps) {
  return (
    <>
      <Label htmlFor="overview" className="form-label mb-2 block">What is the overall scope of the project?</Label>
      <Textarea
        id="overview"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="What is the overall scope of the project? (e.g., Building a deck, renovating a bathroom, installing new plumbing)"
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Build a 3x2 meter deck that ties seamlessly into an existing deck. The deck will feature a low-pitched roof and will be constructed using H3.2 treated pine for the framework and Vitex timber decking for the surface.
        </p>
      </div>
    </>
  );
}
