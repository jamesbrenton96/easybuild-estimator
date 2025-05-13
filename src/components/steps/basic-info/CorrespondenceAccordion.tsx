
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CorrespondenceAccordionProps {
  value: {
    type?: string;
    clientName?: string;
    date?: string;
  };
  location: string;
  onTypeChange: (v: string) => void;
  onClientNameChange: (v: string) => void;
  onProjectAddressChange: (v: string) => void;
  onDateChange: (v: string) => void;
}

export default function CorrespondenceAccordion({
  value,
  location,
  onTypeChange,
  onClientNameChange,
  onProjectAddressChange,
  onDateChange,
}: CorrespondenceAccordionProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format as dd/MM/yyyy
      const formatted = date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("/");
      onDateChange(formatted);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="correspondenceType" className="form-label">Correspondence Type</Label>
        <Select value={value.type || ""} onValueChange={onTypeChange}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="accurate">Accurate Estimate</SelectItem>
            <SelectItem value="preliminary">Preliminary Estimate</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="clientName" className="form-label">Client Name</Label>
        <Input
          id="clientName"
          value={value.clientName || ""}
          onChange={(e) => onClientNameChange(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
          placeholder="e.g., Joe Bloggs"
        />
      </div>
      <div>
        <Label htmlFor="projectAddress" className="form-label">Project Address</Label>
        <Input
          id="projectAddress"
          value={location || ""}
          onChange={(e) => onProjectAddressChange(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
          placeholder="e.g., 123 Willow Grove, Mount Eden, Auckland 1024, New Zealand"
        />
      </div>
      <div>
        <Label htmlFor="currentDate" className="form-label">Current Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              id="currentDate"
              className={cn(
                "w-full flex items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white",
                !value.date && "text-white/50"
              )}
            >
              {value.date || "Select date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                value.date
                  ? new Date(value.date.split('/').reverse().join('-'))
                  : undefined
              }
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
