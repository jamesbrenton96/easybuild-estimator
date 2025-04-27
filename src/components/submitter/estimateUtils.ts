
/**
 * All the logic for calculating an estimate and formatting as markdown.
 */
export function getFullCorrespondenceType(type: string) {
  switch ((type || "").toLowerCase()) {
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

export function createStructuredEstimate(formData: any) {
  return {
    projectOverview: formData.subcategories?.overview?.content || "Custom building project",
    scopeOfWork: formData.subcategories?.projectName?.content || "",
    dimensions: formData.subcategories?.dimensions?.content || "",
    timeline: formData.subcategories?.timeframe?.content || "Not specified",
    totalCost: calculateTotalCost(formData),
    labor: {
      cost: calculateLaborCost(formData),
      hours: estimateHours(formData)
    },
    materials: {
      cost: calculateMaterialsCost(formData),
      breakdown: createMaterialsBreakdown(formData)
    },
    materialDetails: formData.subcategories?.materials?.content || "",
    notes: formData.subcategories?.notes?.content || ""
  };
}

export function calculateTotalCost(formData: any) {
  const laborCost = calculateLaborCost(formData);
  const materialsCost = calculateMaterialsCost(formData);
  return laborCost + materialsCost;
}

export function calculateLaborCost(formData: any) {
  const ratesText = formData.subcategories?.rates?.content || "";
  let hourlyRate = 45;
  if (ratesText) {
    const rateMatch = ratesText.match(/\$(\d+)(?:\.\d+)?(?:\/hr|\/hour|per hour|per hr|\s+hour|\s+hr)/i);
    if (rateMatch && rateMatch[1]) hourlyRate = parseFloat(rateMatch[1]);
  }
  const hours = estimateHours(formData);
  return hourlyRate * hours;
}

export function estimateHours(formData: any) {
  const dimensionsText = formData.subcategories?.dimensions?.content || "";
  let hours = 10;
  if (formData.projectType?.toLowerCase().includes("deck")) hours = 16;
  else if (formData.projectType?.toLowerCase().includes("fence")) hours = 12;
  else if (formData.projectType?.toLowerCase().includes("renovation")) hours = 30;

  if (dimensionsText) {
    const nums = dimensionsText.match(/\d+(?:\.\d+)?/g);
    if (nums && nums.length >= 2) {
      const area = parseFloat(nums[0]) * parseFloat(nums[1]);
      hours = Math.max(hours, area / 20);
    }
  }
  return Math.round(hours);
}

export function calculateMaterialsCost(formData: any) {
  const materialsText = formData.subcategories?.materials?.content || "";
  let cost = 500;
  if (formData.projectType?.toLowerCase().includes("deck")) cost = 1200;
  else if (formData.projectType?.toLowerCase().includes("fence")) cost = 800;
  else if (formData.projectType?.toLowerCase().includes("renovation")) cost = 2500;

  if (materialsText) {
    if (materialsText.toLowerCase().includes("premium") || 
        materialsText.toLowerCase().includes("high quality") ||
        materialsText.toLowerCase().includes("high-quality")) { cost *= 1.2; }
    if (materialsText.toLowerCase().includes("treated") || 
        materialsText.toLowerCase().includes("weather") ||
        materialsText.toLowerCase().includes("resistant")) { cost *= 1.15; }
  }
  return Math.round(cost);
}

export function createMaterialsBreakdown(formData: any) {
  const materialsText = formData.subcategories?.materials?.content || "";
  const breakdown = [];

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
    breakdown.push({name: "Lumber and structural materials", cost: 400});
    breakdown.push({name: "Hardware and fasteners", cost: 100});
  }

  if (materialsText) {
    const lines = materialsText.split('\n');
    lines.forEach(line => {
      if (line.trim() && !breakdown.some(item => item.name.toLowerCase() === line.trim().toLowerCase())) {
        if (line.trim().split(/\s+/).length >= 3) {
          breakdown.push({
            name: line.trim(),
            cost: Math.round(Math.random() * 200 + 100)
          });
        }
      }
    });
  }
  return breakdown;
}

export function createMarkdownDescription(formData: any) {
  let markdownContent = "";
  const projectType = formData.projectType || "Construction Project";
  
  // Start with project type as H1
  markdownContent += `# ${projectType}\n\n`;

  // SECTION 1: Correspondence
  markdownContent += "## SECTION 1: CORRESPONDENCE\n\n";
  
  const correspondenceType = formData.subcategories?.correspondence?.type || "";
  const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
  const clientName = formData.subcategories?.correspondence?.clientName || "";
  const projectAddress = formData.location || "";
  const currentDate = new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const projectName = formData.subcategories?.projectName?.content || "";
  
  markdownContent += `- **Correspondence Type:** ${fullCorrespondenceType}\n`;
  markdownContent += `- **Client Name:** ${clientName}\n`;
  markdownContent += `- **Project Address:** ${projectAddress}\n`;
  markdownContent += `- **Current Date:** ${currentDate}\n`;
  markdownContent += `- **Project Name:** ${projectName}\n\n`;

  // SECTION 2: Project Overview
  markdownContent += "## SECTION 2: PROJECT OVERVIEW\n\n";
  if (formData.subcategories?.overview?.content) {
    markdownContent += `${formData.subcategories.overview.content}\n\n`;
  } else {
    markdownContent += "No overview provided.\n\n";
  }

  // SECTION 3: Scope of Works
  markdownContent += "## SECTION 3: SCOPE OF WORKS\n\n";
  if (formData.subcategories?.overview?.content) {
    // Convert paragraph-style overview to bullet points if needed
    const scopeLines = formData.subcategories.overview.content.split('.')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => `- ${line.trim()}`);
    
    markdownContent += scopeLines.join('\n') + '\n\n';
  } else {
    markdownContent += "- Project scope to be determined\n\n";
  }

  // SECTION 4: Dimensions
  markdownContent += "## SECTION 4: DIMENSIONS\n\n";
  if (formData.subcategories?.dimensions?.content) {
    markdownContent += `${formData.subcategories.dimensions.content}\n\n`;
  } else {
    markdownContent += "No dimensions provided.\n\n";
  }

  // SECTION 5: Materials and Cost Breakdown
  markdownContent += "## SECTION 5: MATERIALS AND COST BREAKDOWN\n\n";
  const materialsBreakdown = createMaterialsBreakdown(formData);
  const buildersMargin = 0.18; // 18% margin
  const materialsSubtotal = calculateMaterialsCost(formData);
  const marginAmount = materialsSubtotal * buildersMargin;
  
  markdownContent += "| Item | Quantity | Unit Price | Total Cost | Source |\n";
  markdownContent += "|------|----------|------------|------------|--------|\n";
  
  materialsBreakdown.forEach(item => {
    markdownContent += `| ${item.name} | 1 | $${item.cost.toFixed(2)} | $${item.cost.toFixed(2)} | Local supplier |\n`;
  });
  
  markdownContent += `| **Materials Subtotal** | | | $${materialsSubtotal.toFixed(2)} | |\n`;
  markdownContent += `| **Builder's Margin (18%)** | | | $${marginAmount.toFixed(2)} | |\n`;
  markdownContent += `| **Materials Total** | | | $${(materialsSubtotal + marginAmount).toFixed(2)} | |\n\n`;

  // SECTION 6: Labor Hours Breakdown
  markdownContent += "## SECTION 6: LABOR HOURS BREAKDOWN\n\n";
  const laborCost = calculateLaborCost(formData);
  const hours = estimateHours(formData);
  const hourlyRate = laborCost / hours;
  
  markdownContent += "| Task Description | Hours | Rate | Cost |\n";
  markdownContent += "|-----------------|-------|------|------|\n";
  
  // Create labor tasks based on project type
  const laborTasks = [];
  if (formData.projectType?.toLowerCase().includes("deck")) {
    laborTasks.push(["Site preparation", Math.round(hours * 0.2), hourlyRate]);
    laborTasks.push(["Foundation work", Math.round(hours * 0.3), hourlyRate]);
    laborTasks.push(["Framing and structure", Math.round(hours * 0.3), hourlyRate]);
    laborTasks.push(["Finishing and cleanup", Math.round(hours * 0.2), hourlyRate]);
  } else if (formData.projectType?.toLowerCase().includes("fence")) {
    laborTasks.push(["Site preparation", Math.round(hours * 0.2), hourlyRate]);
    laborTasks.push(["Post installation", Math.round(hours * 0.4), hourlyRate]);
    laborTasks.push(["Panel installation", Math.round(hours * 0.3), hourlyRate]);
    laborTasks.push(["Finishing and cleanup", Math.round(hours * 0.1), hourlyRate]);
  } else {
    laborTasks.push(["Initial setup and preparation", Math.round(hours * 0.15), hourlyRate]);
    laborTasks.push(["Main construction phase", Math.round(hours * 0.6), hourlyRate]);
    laborTasks.push(["Finishing work", Math.round(hours * 0.15), hourlyRate]);
    laborTasks.push(["Final cleanup", Math.round(hours * 0.1), hourlyRate]);
  }
  
  // Add rows to the labor table
  let taskHoursTotal = 0;
  let taskCostTotal = 0;
  
  laborTasks.forEach(task => {
    const [description, taskHours, rate] = task;
    const taskCost = taskHours * rate;
    taskHoursTotal += taskHours;
    taskCostTotal += taskCost;
    
    markdownContent += `| ${description} | ${taskHours} | $${rate.toFixed(2)}/hr | $${taskCost.toFixed(2)} |\n`;
  });
  
  markdownContent += `| **Labor Total** | **${taskHoursTotal}** | | **$${taskCostTotal.toFixed(2)}** |\n\n`;

  // SECTION 7: Total Summary of Costs
  markdownContent += "## SECTION 7: TOTAL SUMMARY OF COSTS\n\n";
  const totalCost = laborCost + materialsSubtotal + marginAmount;
  const gst = totalCost * 0.15; // 15% GST
  const grandTotal = totalCost + gst;
  
  markdownContent += "| Cost Category | Amount |\n";
  markdownContent += "|---------------|--------|\n";
  markdownContent += `| Labor | $${laborCost.toFixed(2)} |\n`;
  markdownContent += `| Materials (incl. margin) | $${(materialsSubtotal + marginAmount).toFixed(2)} |\n`;
  markdownContent += `| Subtotal | $${totalCost.toFixed(2)} |\n`;
  markdownContent += `| GST (15%) | $${gst.toFixed(2)} |\n`;
  markdownContent += `| **TOTAL PROJECT COST** | **$${grandTotal.toFixed(2)}** |\n\n`;

  // SECTION 8: Project Timeline
  markdownContent += "## SECTION 8: PROJECT TIMELINE\n\n";
  if (formData.subcategories?.timeframe?.content) {
    markdownContent += `${formData.subcategories.timeframe.content}\n\n`;
  } else {
    const days = Math.ceil(hours / 8);
    markdownContent += `- Estimated completion time: ${days} working day${days > 1 ? 's' : ''}\n`;
    markdownContent += `- Project start: Upon agreement and deposit payment\n`;
    markdownContent += `- Project completion: ${days} working days from start date\n\n`;
  }

  // SECTION 9: Notes and Terms
  markdownContent += "## SECTION 9: NOTES AND TERMS\n\n";
  if (formData.subcategories?.notes?.content) {
    markdownContent += `${formData.subcategories.notes.content}\n\n`;
  } else {
    markdownContent += "- This estimate is valid for 30 days from the date issued\n";
    markdownContent += "- Price may vary based on unforeseen circumstances or changes to project scope\n";
    markdownContent += "- Payment terms: 50% deposit required to begin work, remaining balance due upon completion\n";
    markdownContent += "- All materials are subject to availability and price fluctuations\n";
    markdownContent += "- Warranty: All workmanship is guaranteed for 1 year from completion\n";
    markdownContent += "- Client is responsible for obtaining necessary permits unless otherwise specified\n\n";
  }
  
  return markdownContent;
}
