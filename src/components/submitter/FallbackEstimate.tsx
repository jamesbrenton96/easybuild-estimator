
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function FallbackEstimate({ errorDetails }: { errorDetails?: string }) {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">
      <CardHeader className="p-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-gray-800 font-semibold text-xl">Construction Cost Estimate</h2>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-gray-800 text-lg font-medium mb-3">Sorry, the estimate couldn't be generated</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We encountered an issue while processing your estimate. This may be due to:
        </p>
        <ul className="text-left text-gray-600 max-w-md mx-auto mb-4 space-y-2 list-disc pl-4">
          <li>A temporary connection issue with our estimation service</li>
          <li>Incomplete project information in your submission</li>
          <li>An issue with file uploads or project details</li>
        </ul>
        
        {errorDetails && (
          <Alert className="bg-gray-100 p-3 rounded text-left mb-4">
            <AlertTitle className="text-sm text-gray-700 font-medium">Error details:</AlertTitle>
            <AlertDescription className="text-sm text-gray-700">
              {errorDetails}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="px-4 py-2"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-construction-orange hover:bg-construction-orange/90 text-white"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
