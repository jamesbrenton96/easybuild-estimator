
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <Loader2 className="h-12 w-12 animate-spin text-construction-orange mb-6" />
        <h2 className="text-2xl font-medium mb-3">Processing your estimate</h2>
        <p className="text-white/70 text-center max-w-md">
          Our AI is analyzing your project details to generate an accurate cost estimate. This should only take a moment...
        </p>
      </motion.div>
    </div>
  );
}
