
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectNameAccordionProps {
  value: string;
  onChange: (value: string) => void;
}
export default function ProjectNameAccordion({ value, onChange }: ProjectNameAccordionProps) {
  return (
    <>
      <Label htmlFor="projectName" className="form-label mb-2 block">Enter a name for your project</Label>
      <Input
        id="projectName"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white"
        placeholder="e.g., Smith Residence Kitchen Renovation"
      />
      <p className="text-xs text-white/60 mt-2">This will serve as the main title when exported to PDF</p>
    </>
  );
}
