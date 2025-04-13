
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function FallbackEstimate() {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <CardHeader className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-gray-800 text-lg font-medium mb-3">Sorry, the estimate couldn't be generated</h2>
        <p className="text-gray-600 leading-relaxed">Please try again later or contact our support team for assistance.</p>
      </CardContent>
    </Card>
  );
}
