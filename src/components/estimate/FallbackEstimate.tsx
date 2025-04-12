
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function FallbackEstimate() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-gray-800 text-lg font-medium mb-2">Sorry, the estimate couldn't be generated</h2>
        <p className="text-gray-600">Please try again later or contact our support team for assistance.</p>
      </div>
    </div>
  );
}
