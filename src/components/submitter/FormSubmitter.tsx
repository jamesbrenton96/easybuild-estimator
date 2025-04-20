
import React from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { toast } from "sonner";

interface FormSubmitterProps {
  formData: any;
  setIsLoading: (loading: boolean) => void;
  setEstimationResults: (results: any) => void;
  nextStep: () => void;
  isMobile: boolean;
}

export function FormSubmitter({
  formData,
  setIsLoading,
  setEstimationResults,
  nextStep,
  isMobile,
}: FormSubmitterProps) {
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Extract data for the more readable markdown format
      const correspondenceType = formData.subcategories?.correspondence?.type || "";
      const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
      const clientName = formData.subcategories?.correspondence?.clientName || "";
      const date = formData.subcategories?.correspondence?.date || new Date().toLocaleDateString();
      
      // Create markdown representation of the input data
      const markdownContent = createMarkdownDescription();

      // Create a structured estimate object
      const structuredEstimate = {
        projectOverview: formData.subcategories?.overview?.content || "Custom building project",
        scopeOfWork: formData.subcategories?.projectName?.content || "",
        dimensions: formData.subcategories?.dimensions?.content || "",
        timeline: formData.subcategories?.timeframe?.content || "Not specified",
        totalCost: calculateTotalCost(),
        labor: {
          cost: calculateLaborCost(),
          hours: estimateHours()
        },
        materials: {
          cost: calculateMaterialsCost(),
          breakdown: createMaterialsBreakdown()
        },
        materialDetails: formData.subcategories?.materials?.content || "",
        notes: formData.subcategories?.notes?.content || ""
      };
      
      // Set the results
      const estimationResults = {
        markdownContent: markdownContent,
        estimate: structuredEstimate,
        estimateGenerated: true
      };
      
      console.log("Generated estimate:", estimationResults);
      
      setEstimationResults(estimationResults);
      setIsLoading(false);
      nextStep();
      toast.success("Estimate generated successfully");
      
    } catch (error: any) {
      console.error("Error generating estimate:", error);
      
      // Create fallback content from the user's input
      const fallbackContent = createMarkdownDescription();
      setEstimationResults({ 
        markdownContent: fallbackContent,
        error: error.message || "Error processing estimate"
      });
      
      setIsLoading(false);
      nextStep();
      toast.error("There was an error generating your estimate");
    }
  };
  
  // Helper function to get full correspondence type
  function getFullCorrespondenceType(type: string) {
    switch (type.toLowerCase()) {
      case "accurate":
        return "Accurate Estimate";
      case "ballpark":
        return "Ballpark Estimate";
      case "quotation":
        return "Fixed Price Quotation";
      case "quote":
        return "Quotation";
      case "preliminary":
        return "Preliminary Estimate";
      case "proposal":
        return "Proposal";
      default:
        return type || "Estimate";
    }
  }
  
  // Helper function to calculate total cost
  function calculateTotalCost() {
    const laborCost = calculateLaborCost();
    const materialsCost = calculateMaterialsCost();
    return laborCost + materialsCost;
  }
  
  // Helper function to calculate labor cost
  function calculateLaborCost() {
    // Extract any rate information from the form data
    const ratesText = formData.subcategories?.rates?.content || "";
    
    // Default hourly rate if none provided
    let hourlyRate = 45; // Default hourly rate
    
    // Try to extract hourly rate from rates text
    if (ratesText) {
      const rateMatch = ratesText.match(/\$(\d+)(?:\.\d+)?(?:\/hr|\/hour|per hour|per hr|\s+hour|\s+hr)/i);
      if (rateMatch && rateMatch[1]) {
        hourlyRate = parseFloat(rateMatch[1]);
      }
    }
    
    const hours = estimateHours();
    return hourlyRate * hours;
  }
  
  // Helper function to estimate hours
  function estimateHours() {
    // Extract dimensions information
    const dimensionsText = formData.subcategories?.dimensions?.content || "";
    
    // Base hours
    let hours = 10; // Default base hours
    
    // Adjust based on project type
    if (formData.projectType?.toLowerCase().includes("deck")) {
      hours = 16;
    } else if (formData.projectType?.toLowerCase().includes("fence")) {
      hours = 12;
    } else if (formData.projectType?.toLowerCase().includes("renovation")) {
      hours = 30;
    }
    
    // Adjust based on dimensions if available
    if (dimensionsText) {
      // Look for numbers in the dimensions text
      const dimensionNumbers = dimensionsText.match(/\d+(?:\.\d+)?/g);
      if (dimensionNumbers && dimensionNumbers.length >= 2) {
        // Assume first two numbers are width and length
        const area = parseFloat(dimensionNumbers[0]) * parseFloat(dimensionNumbers[1]);
        // Adjust hours based on area
        hours = Math.max(hours, area / 20);
      }
    }
    
    return Math.round(hours);
  }
  
  // Helper function to calculate materials cost
  function calculateMaterialsCost() {
    // Extract materials information
    const materialsText = formData.subcategories?.materials?.content || "";
    
    // Base material cost
    let materialsCost = 500; // Default base materials cost
    
    // Adjust based on project type
    if (formData.projectType?.toLowerCase().includes("deck")) {
      materialsCost = 1200;
    } else if (formData.projectType?.toLowerCase().includes("fence")) {
      materialsCost = 800;
    } else if (formData.projectType?.toLowerCase().includes("renovation")) {
      materialsCost = 2500;
    }
    
    // Adjust based on materials text if available
    if (materialsText) {
      // Add 20% if premium or high quality materials are mentioned
      if (materialsText.toLowerCase().includes("premium") || 
          materialsText.toLowerCase().includes("high quality") ||
          materialsText.toLowerCase().includes("high-quality")) {
        materialsCost *= 1.2;
      }
      
      // Add 15% if treated or weather-resistant materials are mentioned
      if (materialsText.toLowerCase().includes("treated") || 
          materialsText.toLowerCase().includes("weather") ||
          materialsText.toLowerCase().includes("resistant")) {
        materialsCost *= 1.15;
      }
    }
    
    return Math.round(materialsCost);
  }
  
  // Helper function to create materials breakdown
  function createMaterialsBreakdown() {
    const materialsText = formData.subcategories?.materials?.content || "";
    const breakdown = [];
    
    // Create generic material items based on project type
    if (formData.projectType?.toLowerCase().includes("deck")) {
      breakdown.push({name: "Pressure-treated lumber", cost: 600});
      breakdown.push({name: "Deck screws and fasteners", cost: 150});
      breakdown.push({name: "Concrete for footings", cost: 150});
      breakdown.push({name: "Railing components", cost: 300});
    } else if (formData.projectType?.toLowerCase().includes("fence")) {
      breakdown.push({name: "Fence posts", cost: 300});
      breakdown.push({name: "Fence panels/pickets", cost: 350});
      breakdown.push({name: "Concrete for post holes", cost: 100});
      breakdown.push({name: "Hardware and fasteners", cost: 50});
    } else if (formData.projectType?.toLowerCase().includes("renovation")) {
      breakdown.push({name: "Lumber and framing materials", cost: 800});
      breakdown.push({name: "Drywall and finishes", cost: 450});
      breakdown.push({name: "Paint and primers", cost: 300});
      breakdown.push({name: "Trim and molding", cost: 250});
      breakdown.push({name: "Hardware and fasteners", cost: 200});
      breakdown.push({name: "Miscellaneous materials", cost: 500});
    } else {
      // Generic materials for other project types
      breakdown.push({name: "Lumber and structural materials", cost: 400});
      breakdown.push({name: "Hardware and fasteners", cost: 100});
    }
    
    // If custom materials mentioned in the text, try to extract and add them
    if (materialsText) {
      const materialLines = materialsText.split('\n');
      materialLines.forEach(line => {
        // Look for lines that might describe materials
        if (line.trim() && !breakdown.some(item => item.name.toLowerCase() === line.trim().toLowerCase())) {
          // Simple heuristic: if line has more than 3 words and doesn't exist yet, add it
          const words = line.trim().split(/\s+/);
          if (words.length >= 3) {
            breakdown.push({
              name: line.trim(),
              cost: Math.round(Math.random() * 200 + 100) // Random cost between 100-300
            });
          }
        }
      });
    }
    
    return breakdown;
  }
  
  // Create a well-formatted markdown description of the estimate
  function createMarkdownDescription() {
    let markdownContent = "";
    
    // Add header
    markdownContent += "# Construction Cost Estimate\n\n";
    
    // Add correspondence details
    const correspondenceType = formData.subcategories?.correspondence?.type || "";
    const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
    const clientName = formData.subcategories?.correspondence?.clientName || "";
    const date = formData.subcategories?.correspondence?.date || new Date().toLocaleDateString();
    
    markdownContent += "## Correspondence Details\n";
    markdownContent += `**Type:** ${fullCorrespondenceType}\n`;
    markdownContent += `**Client:** ${clientName}\n`;
    markdownContent += `**Date:** ${date}\n\n`;
    
    // Add project name if available
    if (formData.subcategories?.projectName?.content) {
      markdownContent += `## Project Name\n${formData.subcategories.projectName.content}\n\n`;
    }
    
    // Add project overview if available
    if (formData.subcategories?.overview?.content) {
      markdownContent += `## Project Overview\n${formData.subcategories.overview.content}\n\n`;
    }
    
    // Add dimensions if available
    if (formData.subcategories?.dimensions?.content) {
      markdownContent += `## Dimensions\n${formData.subcategories.dimensions.content}\n\n`;
    }
    
    // Calculate and add cost breakdown
    const laborCost = calculateLaborCost();
    const materialsCost = calculateMaterialsCost();
    const totalCost = laborCost + materialsCost;
    const hours = estimateHours();
    
    markdownContent += "## Cost Breakdown\n\n";
    markdownContent += "| Item | Cost |\n";
    markdownContent += "|------|------|\n";
    markdownContent += `| Labor (${hours} hours) | $${laborCost.toLocaleString()} |\n`;
    markdownContent += `| Materials | $${materialsCost.toLocaleString()} |\n`;
    markdownContent += `| **Total** | **$${totalCost.toLocaleString()}** |\n\n`;
    
    // Add materials breakdown
    const materialsBreakdown = createMaterialsBreakdown();
    if (materialsBreakdown.length > 0) {
      markdownContent += "## Materials & Cost Breakdown\n\n";
      markdownContent += "| Item | Cost |\n";
      markdownContent += "|------|------|\n";
      
      materialsBreakdown.forEach(item => {
        markdownContent += `| ${item.name} | $${item.cost.toLocaleString()} |\n`;
      });
      
      markdownContent += `| **Materials Subtotal** | **$${materialsCost.toLocaleString()}** |\n\n`;
    }
    
    // Add materials details if available
    if (formData.subcategories?.materials?.content) {
      markdownContent += `## Material Details & Calculations\n${formData.subcategories.materials.content}\n\n`;
    }
    
    // Add location details if available
    if (formData.subcategories?.locationDetails?.content) {
      markdownContent += `## Location-Specific Details\n${formData.subcategories.locationDetails.content}\n\n`;
    }
    
    // Add timeframe if available
    if (formData.subcategories?.timeframe?.content) {
      markdownContent += `## Project Timeline\n${formData.subcategories.timeframe.content}\n\n`;
    } else {
      // Add default timeframe based on hours
      markdownContent += "## Project Timeline\n";
      const days = Math.ceil(hours / 8);
      markdownContent += `Estimated completion time: ${days} working day${days > 1 ? 's' : ''}\n\n`;
    }
    
    // Add additional work if available
    if (formData.subcategories?.additionalWork?.content) {
      markdownContent += `## Additional Work\n${formData.subcategories.additionalWork.content}\n\n`;
    }
    
    // Add notes if available
    if (formData.subcategories?.notes?.content) {
      markdownContent += `## Notes & Terms\n${formData.subcategories.notes.content}\n\n`;
    } else {
      // Add default notes
      markdownContent += "## Notes & Terms\n";
      markdownContent += "- This estimate is valid for 30 days from the date issued\n";
      markdownContent += "- Price may vary based on unforeseen circumstances or changes to project scope\n";
      markdownContent += "- Payment terms: 50% deposit required to begin work, remaining balance due upon completion\n";
      markdownContent += "- Warranty: All workmanship is guaranteed for 1 year from completion\n\n";
    }
    
    return markdownContent;
  }

  return (
    <button
      onClick={handleSubmit}
      className={`btn-next ${isMobile ? 'order-1' : ''}`}
    >
      Generate Estimate
    </button>
  );
}
