
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-construction-dark pb-16">
      <header className="w-full py-6 px-4">
        <div className="container mx-auto flex justify-center items-center">
          <motion.img
            src="/lovable-uploads/bee065c6-a438-40bf-b1e3-4e1183bbda1d.png"
            alt="Brenton Building Estimator"
            className="h-24 sm:h-32 w-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-8">
        <motion.div
          className="max-w-3xl mx-auto bg-white/10 rounded-xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Welcome to the Brenton Building Estimator
            </h1>
            <div className="w-20 h-1 bg-construction-orange mx-auto mb-6"></div>
          </div>
          
          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-xl font-semibold text-construction-orange mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" /> How Our AI Estimator Works
              </h2>
              <p className="leading-relaxed">
                Our AI-powered estimator uses cutting-edge technology to calculate accurate cost estimates 
                based on your project details. By analyzing the information you provide, including project 
                type, scope, and location, our system generates comprehensive estimates using 
                industry-standard calculations and up-to-date pricing data.
              </p>
            </section>
            
            <section className="border-t border-white/10 pt-6">
              <h2 className="text-xl font-semibold text-construction-orange mb-3">Important Disclaimer</h2>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="leading-relaxed">
                  Please note that the estimates provided are intended to serve as a guide only. 
                  These estimates are not legally binding quotes and may vary based on actual project 
                  requirements, market conditions, material availability, and other factors that may 
                  affect final costs. For a legally binding quote, we recommend consulting with Brenton Building 'UKNZ' Limited.
                </p>
              </div>
            </section>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Button 
              onClick={() => navigate("/estimator")} 
              className="px-8 py-6 h-auto text-base bg-construction-orange hover:bg-construction-orange/80"
            >
              Continue to Estimator <ArrowRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </main>
      
      <footer className="mt-16 text-center text-white/50 text-sm">
        <p>© {new Date().getFullYear()} Brenton Building Estimator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Intro;
