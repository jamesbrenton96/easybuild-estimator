
import React from "react";
import { EstimatorProvider } from "@/context/EstimatorContext";
import CostEstimator from "@/components/CostEstimator";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-construction-dark pb-16">
      <header className="w-full py-6 px-4">
        <div className="container mx-auto flex justify-center items-center">
          <motion.img
            src="/lovable-uploads/d3498cf4-8a5c-497e-a463-cb5240526bb3.png"
            alt="Easy Build Estimator"
            className="h-16 sm:h-20 w-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <EstimatorProvider>
          <CostEstimator />
        </EstimatorProvider>
      </main>
      
      <footer className="mt-16 text-center text-white/50 text-sm">
        <p>© {new Date().getFullYear()} Easy Build Estimator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
