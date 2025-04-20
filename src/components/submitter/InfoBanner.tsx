
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const InfoBanner = () => (
  <Card className="mb-8 bg-white/5 border-white/20">
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
        <div>
          <h3 className="text-white font-medium mb-1">Important Information</h3>
          <p className="text-white/80 text-sm">
            The estimate generation requires a connection to our AI service. If you receive an error or only see your input data returned, it may be due to:
          </p>
          <ul className="list-disc text-white/80 text-sm pl-5 mt-2 space-y-1">
            <li>Connection issues with our estimation service</li>
            <li>High traffic on our service</li>
            <li>Technical limitations with the webhook</li>
          </ul>
          <p className="text-white/80 text-sm mt-2">
            If this happens, please try again in a few minutes. Detailed error information will be available in the browser console.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
