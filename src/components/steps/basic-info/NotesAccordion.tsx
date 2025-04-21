
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function NotesAccordion({ value, onChange }: NotesAccordionProps) {
  return (
    <>
      <Label htmlFor="notes" className="form-label mb-2 block">Specific notes or terms related to the project</Label>
      <Textarea
        id="notes"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white resize-none min-h-[120px]"
        placeholder="If you have any specific notes or terms related to the project, please include them here (e.g., payment terms, special requirements, warranty details, or additional conditions)."
      />
      <div className="bg-white/5 p-3 rounded-md mt-3 border border-white/10">
        <p className="text-xs text-white/70 italic">
          <strong>Example:</strong> Please note that all project costs are based on the scope of work as outlined above. Any changes to the project scope, such as additional tasks or materials, will require a revision of the estimate. A 40% deposit is required before work commences, with the balance due upon project completion. Any delays caused by weather or external factors will be communicated promptly, and a revised timeline may be provided if necessary.
        </p>
      </div>
    </>
  );
}
