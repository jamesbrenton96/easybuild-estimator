
import React from "react";
import { Card } from "@/components/ui/card";

interface MarkdownEstimateHeaderProps {
  title?: string;
}

export default function MarkdownEstimateHeader({ title = "Construction Cost Estimate" }: MarkdownEstimateHeaderProps) {
  return (
    <div className="p-5 border-b border-gray-200 bg-gray-50">
      <h2 className="text-gray-800 font-semibold text-xl">{title}</h2>
    </div>
  );
}
