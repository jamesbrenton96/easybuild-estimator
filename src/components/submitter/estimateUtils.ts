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
  const projectType = formData.projectType || "Construction Project";
  let markdownContent = `${projectType}\n\n`;

  // SECTION 1: Correspondence
  markdownContent += "# 1. Correspondence\n\n";
  const correspondenceType = getFullCorrespondenceType(formData.subcategories?.correspondence?.type || "");
  const clientName = formData.subcategories?.correspondence?.clientName || "";
  const projectAddress = formData.location || "";
  const currentDate = new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const projectName = formData.subcategories?.projectName?.content || "";

  markdownContent += `- **Correspondence Type:** ${correspondenceType}\n`;
  markdownContent += `- **Client Name:** ${clientName}\n`;
  markdownContent += `- **Project Address:** ${projectAddress}\n`;
  markdownContent += `- **Current Date:** ${currentDate}\n`;
  markdownContent += `- **Project Name:** ${projectName}\n\n`;

  // SECTION 2: Project Overview
  markdownContent += "# 2. Project Overview\n\n";
  markdownContent += `${formData.subcategories?.overview?.content || "Project details to be confirmed."}\n\n`;

  // SECTION 3: Scope of Works
  markdownContent += "# 3. Scope of Works\n\n";
  const scopeLines = (formData.subcategories?.overview?.content || "")
    .split('.')
    .filter((line: string) => line.trim())
    .map((line: string) => `- ${line.trim()}`);
  markdownContent += scopeLines.join('\n') + '\n\n';

  // SECTION 4: Dimensions
  markdownContent += "# 4. Dimensions\n\n";
  const dimensionsContent = formData.subcategories?.dimensions?.content || "";
  const dimensionLines = dimensionsContent
    .split('\n')
    .filter(line => line.trim())
    .map(line => `- ${line.trim()}`);
  markdownContent += dimensionLines.join('\n') + '\n\n';

  // SECTION 5: Materials & Cost Breakdown
  markdownContent += "# 5. Materials & Cost Breakdown\n\n";
  const materialsBreakdown = createMaterialsBreakdown(formData);
  const materialsSubtotal = calculateMaterialsCost(formData);
  const gst = materialsSubtotal * 0.15;
  const materialsTotal = materialsSubtotal + gst;
  const buildersMargin = materialsTotal * 0.18;
  const materialsGrandTotal = materialsTotal + buildersMargin;

  markdownContent += "| Item | Qty | Unit Price (NZD) | Total (NZD) | Source |\n";
  markdownContent += "|------|----:|----------------:|------------:|--------|\n";
  
  materialsBreakdown.forEach(item => {
    markdownContent += `| ${item.name} | 1 | $${item.cost.toFixed(2)} | $${item.cost.toFixed(2)} | Local supplier |\n`;
  });
  
  markdownContent += `\n**Materials Sub-total (ex GST):** $${materialsSubtotal.toFixed(2)}\n`;
  markdownContent += `**GST 15 %:** $${gst.toFixed(2)}\n`;
  markdownContent += `**Materials Total (incl GST):** $${materialsTotal.toFixed(2)}\n`;
  markdownContent += `**Builder's Margin 18 %:** $${buildersMargin.toFixed(2)}\n`;
  markdownContent += `**Materials Grand Total:** **$${materialsGrandTotal.toFixed(2)}**\n\n`;

  // SECTION 6: Labour Hours Breakdown
  markdownContent += "# 6. Labour Hours Breakdown\n\n";
  const laborTasks = calculateLaborTasks(formData);
  
  markdownContent += "| Task | Hours | Rate (NZD/hr) | Total (NZD) |\n";
  markdownContent += "|------|------:|-------------:|------------:|\n";
  
  let laborTotal = 0;
  laborTasks.forEach(task => {
    const taskTotal = task.hours * task.rate;
    laborTotal += taskTotal;
    markdownContent += `| ${task.description} | ${task.hours} | $${task.rate.toFixed(2)} | $${taskTotal.toFixed(2)} |\n`;
  });

  // SECTION 7: Total Summary
  markdownContent += "\n# 7. Total Summary\n\n";
  const grandTotal = materialsGrandTotal + laborTotal;
  
  markdownContent += "| Category | Amount (NZD) |\n";
  markdownContent += "|----------|-------------:|\n";
  markdownContent += `| Materials (incl GST & margin) | $${materialsGrandTotal.toFixed(2)} |\n`;
  markdownContent += `| Labour (incl GST) | $${laborTotal.toFixed(2)} |\n`;
  markdownContent += `| **Total Project Cost** | **$${grandTotal.toFixed(2)}** |\n\n`;

  // SECTION 8: Project Timeline
  markdownContent += "# 8. Project Timeline\n\n";
  const timeframeTasks = createTimelineTasks(formData, laborTasks);
  
  markdownContent += "| Phase | Duration |\n";
  markdownContent += "|-------|----------|\n";
  timeframeTasks.forEach(task => {
    markdownContent += `| ${task.phase} | ${task.duration} |\n`;
  });
  markdownContent += "\n";

  // SECTION 9: Notes & Terms
  markdownContent += "# 9. Notes & Terms\n\n";
  const defaultNotes = [
    "This estimate is valid for 30 days from the date issued",
    "Price may vary based on unforeseen circumstances or changes to project scope",
    "Payment terms: 50% deposit required to begin work, remaining balance due upon completion",
    "All materials are subject to availability and price fluctuations",
    "Warranty: All workmanship is guaranteed for 1 year from completion",
    "Client is responsible for obtaining necessary permits unless otherwise specified"
  ];

  const notes = formData.subcategories?.notes?.content
    ? formData.subcategories.notes.content.split('\n').filter(Boolean)
    : defaultNotes;

  notes.forEach(note => {
    markdownContent += `- ${note.trim()}\n`;
  });

  // Footer
  markdownContent += "\n---\n*Generated automatically – Brenton Building*\n";

  return markdownContent;
}

function calculateLaborTasks(formData: any) {
  const hours = estimateHours(formData);
  const hourlyRate = calculateLaborCost(formData) / hours;
  
  if (formData.projectType?.toLowerCase().includes("deck")) {
    return [
      { description: "Site preparation", hours: Math.round(hours * 0.2), rate: hourlyRate },
      { description: "Foundation work", hours: Math.round(hours * 0.3), rate: hourlyRate },
      { description: "Framing and structure", hours: Math.round(hours * 0.3), rate: hourlyRate },
      { description: "Finishing and cleanup", hours: Math.round(hours * 0.2), rate: hourlyRate }
    ];
  }
  
  if (formData.projectType?.toLowerCase().includes("fence")) {
    return [
      { description: "Site preparation", hours: Math.round(hours * 0.2), rate: hourlyRate },
      { description: "Post installation", hours: Math.round(hours * 0.4), rate: hourlyRate },
      { description: "Panel installation", hours: Math.round(hours * 0.3), rate: hourlyRate },
      { description: "Finishing and cleanup", hours: Math.round(hours * 0.1), rate: hourlyRate }
    ];
  }
  
  return [
    { description: "Initial setup and preparation", hours: Math.round(hours * 0.15), rate: hourlyRate },
    { description: "Main construction phase", hours: Math.round(hours * 0.6), rate: hourlyRate },
    { description: "Finishing work", hours: Math.round(hours * 0.15), rate: hourlyRate },
    { description: "Final cleanup", hours: Math.round(hours * 0.1), rate: hourlyRate }
  ];
}

function createTimelineTasks(formData: any, laborTasks: any[]) {
  const totalHours = laborTasks.reduce((sum, task) => sum + task.hours, 0);
  const daysPerPhase = Math.ceil(totalHours / 8);
  
  return laborTasks.map(task => ({
    phase: task.description,
    duration: `${Math.ceil(task.hours / 8)} working days`
  }));
}
