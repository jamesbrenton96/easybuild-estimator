
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

  const correspondenceType = formData.subcategories?.correspondence?.type || "";
  const fullCorrespondenceType = getFullCorrespondenceType(correspondenceType);
  const clientName = formData.subcategories?.correspondence?.clientName || "";
  const date = formData.subcategories?.correspondence?.date || new Date().toLocaleDateString();

  markdownContent += "# Construction Cost Estimate\n\n";
  markdownContent += "## Correspondence Details\n";
  markdownContent += `**Type:** ${fullCorrespondenceType}\n`;
  markdownContent += `**Client:** ${clientName}\n`;
  markdownContent += `**Date:** ${date}\n\n`;

  if (formData.subcategories?.projectName?.content) markdownContent += `## Project Name\n${formData.subcategories.projectName.content}\n\n`;
  if (formData.subcategories?.overview?.content) markdownContent += `## Project Overview\n${formData.subcategories.overview.content}\n\n`;
  if (formData.subcategories?.dimensions?.content) markdownContent += `## Dimensions\n${formData.subcategories.dimensions.content}\n\n`;

  const laborCost = calculateLaborCost(formData);
  const materialsCost = calculateMaterialsCost(formData);
  const totalCost = laborCost + materialsCost;
  const hours = estimateHours(formData);

  markdownContent += "## Cost Breakdown\n\n";
  markdownContent += "| Item | Cost |\n";
  markdownContent += "|------|------|\n";
  markdownContent += `| Labor (${hours} hours) | $${laborCost.toLocaleString()} |\n`;
  markdownContent += `| Materials | $${materialsCost.toLocaleString()} |\n`;
  markdownContent += `| **Total** | **$${totalCost.toLocaleString()}** |\n\n`;

  const materialsBreakdown = createMaterialsBreakdown(formData);
  if (materialsBreakdown.length > 0) {
    markdownContent += "## Materials & Cost Breakdown\n\n";
    markdownContent += "| Item | Cost |\n";
    markdownContent += "|------|------|\n";
    materialsBreakdown.forEach(item => markdownContent += `| ${item.name} | $${item.cost.toLocaleString()} |\n`);
    markdownContent += `| **Materials Subtotal** | **$${materialsCost.toLocaleString()}** |\n\n`;
  }
  if (formData.subcategories?.materials?.content) markdownContent += `## Material Details & Calculations\n${formData.subcategories.materials.content}\n\n`;
  if (formData.subcategories?.locationDetails?.content) markdownContent += `## Location-Specific Details\n${formData.subcategories.locationDetails.content}\n\n`;

  if (formData.subcategories?.timeframe?.content) {
    markdownContent += `## Project Timeline\n${formData.subcategories.timeframe.content}\n\n`;
  } else {
    markdownContent += "## Project Timeline\n";
    const days = Math.ceil(hours / 8);
    markdownContent += `Estimated completion time: ${days} working day${days > 1 ? 's' : ''}\n\n`;
  }
  if (formData.subcategories?.additionalWork?.content) markdownContent += `## Additional Work\n${formData.subcategories.additionalWork.content}\n\n`;
  if (formData.subcategories?.notes?.content) {
    markdownContent += `## Notes & Terms\n${formData.subcategories.notes.content}\n\n`;
  } else {
    markdownContent += "## Notes & Terms\n";
    markdownContent += "- This estimate is valid for 30 days from the date issued\n";
    markdownContent += "- Price may vary based on unforeseen circumstances or changes to project scope\n";
    markdownContent += "- Payment terms: 50% deposit required to begin work, remaining balance due upon completion\n";
    markdownContent += "- Warranty: All workmanship is guaranteed for 1 year from completion\n\n";
  }
  return markdownContent;
}
