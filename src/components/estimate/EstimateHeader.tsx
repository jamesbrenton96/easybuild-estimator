
import React from "react";
import { Check } from "lucide-react";

export default function EstimateHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
        <Check className="h-8 w-8 text-green-500" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your Construction Estimate</h1>
      <p className="text-white/80 max-w-2xl mx-auto">
        Here's a detailed breakdown of your project's estimated costs and specifications.
      </p>
    </div>
  );
}
