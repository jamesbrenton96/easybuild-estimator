
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, Lightbulb, AlertTriangle } from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-construction-dark pb-16">
      <header className="w-full py-6 px-4">
        <div className="container mx-auto flex justify-center items-center">
          <motion.img
            src="/lovable-uploads/bee065c6-a438-40bf-b1e3-4e1183bbda1d.png"
            alt="Quote Quickly AI by Brenton Building"
            className="h-24 sm:h-32 w-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-8 max-w-5xl">
        <motion.div
          className="bg-white/10 rounded-xl p-8 border border-white/20 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Welcome to Quote Quickly AI by Brenton Building
            </h1>
            <div className="w-20 h-1 bg-construction-orange mx-auto mb-6"></div>
          </div>
          
          <div className="space-y-8 text-white/90">
            <section>
              <h2 className="text-xl font-semibold text-construction-orange mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" /> How Our AI Estimator Works
              </h2>
              <div className="space-y-4 leading-relaxed">
                <p>
                  Our AI estimator takes the guesswork out of pricing your jobs. Just tell it what you're building, 
                  where you're building it, and what specific materials you want to use - and it'll crunch the numbers 
                  for you on the spot without hours and hours of scrolling through price books. It pulls from current 
                  market prices and industry standards of NZS3604 to give you detailed breakdowns that look professional 
                  and cover all your bases.
                </p>
                <p>
                  The system generates comprehensive quotes with material lists, labor hours, and project timelines - 
                  everything you need to present to your clients or price your next job.
                </p>
              </div>
            </section>
            
            <section className="border-t border-white/10 pt-8">
              <h2 className="text-xl font-semibold text-construction-orange mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" /> Important Disclaimer
              </h2>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <p className="leading-relaxed">
                  These estimates are a starting point, not a final quote. Your actual costs might vary depending 
                  on site conditions, material availability, supplier pricing, and those little surprises that pop 
                  up on every job. For binding quotes, get in touch with Brenton Building 'UKNZ' Limited directly.
                </p>
              </div>
            </section>

            <section className="border-t border-white/10 pt-8">
              <h2 className="text-xl font-semibold text-construction-orange mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" /> Tips for Getting the Best Results
              </h2>
              <p className="mb-6 text-white/80">
                Here are some things we've learned that'll help you get the most accurate estimates:
              </p>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">1. Hide the Materials Source Info</h3>
                  <p className="text-sm text-white/80">
                    The materials source is just there to show you where we're getting our pricing from - you can 
                    hide this section using the toggle at the top to keep your quotes looking clean for clients.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">2. Run It Twice for Better Accuracy</h3>
                  <p className="text-sm text-white/80">
                    The tool works best when you run it through more than once. The first run might miss some details, 
                    so give it another go with any extra info you think of - you'll get a much more accurate estimate.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">3. Edit Carefully</h3>
                  <p className="text-sm text-white/80">
                    The entire output is editable, but if you see materials the AI has assumed that you don't want, 
                    it's better to run the tool again with more specific details rather than just editing them out. 
                    This way you get proper pricing for what you actually want to use.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">4. Let the AI Get Creative First</h3>
                  <p className="text-sm text-white/80">
                    If you're stuck on material choices or don't know where to start, leave some boxes blank and 
                    let the tool suggest what it thinks will work best for your project. You can always come back 
                    and refine it with more specific requirements in your next run.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">5. Save Time on Variations</h3>
                  <p className="text-sm text-white/80">
                    Use the tool to quickly price up different options for your client - timber vs steel framing, 
                    different cladding options, upgraded fixtures. Run separate estimates and show them the cost 
                    difference between good, better, and best options.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">6. Upload Your Plans and Photos</h3>
                  <p className="text-sm text-white/80">
                    The tool can handle 1 set of PDF plans (under 10MB) or up to 4 image files totalling less than 
                    10MB. Even if you don't have proper plans or site photos, chuck in at least one hand-drawn sketch - 
                    it makes a huge difference to the accuracy. The more visual info you can give it, the better it'll 
                    understand what you're trying to build.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">7. Garbage In, Garbage Out</h3>
                  <p className="text-sm text-white/80">
                    AI is brilliant, but it's only as good as the information you give it. The more specific you are 
                    about materials, site conditions, and project details, the better your estimate will be. 
                    Vague input = dodgy estimate.
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-white mb-2">8. Save Your Work</h3>
                  <p className="text-sm text-white/80">
                    If the tool hits any errors, your estimate should automatically save and you can reload it when you 
                    refresh the page. But to be safe, hit the "Drafts" button at the top of your "Basic Information" page 
                    to save a backup. This way if your browser crashes or you need to come back later to finish the job, 
                    you won't lose all your work.
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          <div className="mt-10 flex justify-center pt-6 border-t border-white/10">
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
        <p>© {new Date().getFullYear()} Quote Quickly AI by Brenton Building. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Intro;
