
import { useMemo } from "react";

/**
 * useFormattedMarkdown - Cleans & reformats markdown text for much more readable output.
 * This will: 
 *  - Insert extra line breaks after single/double line endings before section headers.
 *  - Add missing newlines for lists and tables.
 *  - Bold key totals.
 *  - Space tables nicely.
 *  - Tidy up number and currency columns.
 *
 * @param markdownContent string - incoming content directly from webhook/service.
 * @returns cleaned/beautified markdown string
 */
export function useFormattedMarkdown(markdownContent: string) {
  return useMemo(() => {
    if (!markdownContent) return "";

    let cleaned = markdownContent;

    // Fix basic escaped newlines/tabs/quotes
    cleaned = cleaned
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "    ")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // Add project type to the beginning if not present
    if (!cleaned.startsWith("# ")) {
      const projectTypeMatch = cleaned.match(/Project Type:\s*([^\n]+)/i);
      if (projectTypeMatch) {
        const projectType = projectTypeMatch[1].trim();
        cleaned = `# ${projectType}\n\n${cleaned}`;
      }
    }

    // Format section headers consistently
    cleaned = cleaned.replace(/##\s+SECTION\s+(\d+):\s+([^\n]+)/gi, (_, num, title) => {
      return `\n## SECTION ${num}: ${title.toUpperCase()}\n`;
    });

    // Format section headers without section numbers
    const sectionTitles = [
      "CORRESPONDENCE", "PROJECT OVERVIEW", "SCOPE OF WORKS", "DIMENSIONS",
      "MATERIALS AND COST BREAKDOWN", "LABOR HOURS BREAKDOWN", "TOTAL SUMMARY OF COSTS", 
      "PROJECT TIMELINE", "NOTES AND TERMS"
    ];
    
    sectionTitles.forEach((title, index) => {
      const regex = new RegExp(`##\\s+${title}`, "gi");
      cleaned = cleaned.replace(regex, `\n## SECTION ${index + 1}: ${title}`);
    });

    // Format correspondence items into a clean list
    const correspondenceSectionRegex = /## SECTION 1: CORRESPONDENCE\s+([^#]*)/i;
    const correspondenceMatch = cleaned.match(correspondenceSectionRegex);
    if (correspondenceMatch) {
      let correspondenceContent = correspondenceMatch[1];
      const correspondenceItems = [
        "Correspondence Type", "Client Name", "Project Address", 
        "Current Date", "Project Name"
      ];
      
      let formattedCorrespondence = "";
      correspondenceItems.forEach(item => {
        const itemRegex = new RegExp(`${item}:\\s*([^\\n]+)`, "i");
        const match = correspondenceContent.match(itemRegex);
        if (match) {
          formattedCorrespondence += `- **${item}:** ${match[1].trim()}\n`;
        }
      });
      
      if (formattedCorrespondence) {
        cleaned = cleaned.replace(
          correspondenceSectionRegex,
          `## SECTION 1: CORRESPONDENCE\n\n${formattedCorrespondence}\n`
        );
      }
    }

    // Format scope of works as bullet points
    const scopeRegex = /## SECTION 3: SCOPE OF WORKS\s+([^#]*)/i;
    const scopeMatch = cleaned.match(scopeRegex);
    if (scopeMatch) {
      let scopeContent = scopeMatch[1].trim();
      if (scopeContent && !scopeContent.includes("- ")) {
        const items = scopeContent.split(/\n+/).filter(Boolean);
        const bulletedItems = items.map(item => `- ${item.trim()}`).join("\n");
        cleaned = cleaned.replace(
          scopeRegex, 
          `## SECTION 3: SCOPE OF WORKS\n\n${bulletedItems}\n\n`
        );
      }
    }

    // Format tables nicely (materials and cost breakdown, labor hours)
    const tableRegexes = [
      /## SECTION 5: MATERIALS AND COST BREAKDOWN\s+([^#]*)/i,
      /## SECTION 6: LABOR HOURS BREAKDOWN\s+([^#]*)/i
    ];
    
    tableRegexes.forEach(regex => {
      const match = cleaned.match(regex);
      if (match) {
        let content = match[1].trim();
        
        // Create table if content isn't already in table format
        if (!content.includes("|")) {
          const lines = content.split("\n").filter(Boolean);
          const isMultiColumnData = lines.some(line => line.includes(":") || line.includes(","));
          
          if (isMultiColumnData) {
            let tableContent = "";
            
            // Determine columns based on content
            const isLaborTable = regex.toString().includes("LABOR");
            
            if (isLaborTable) {
              tableContent = "| Task Description | Hours | Rate | Cost |\n";
              tableContent += "|-----------------|-------|------|------|\n";
            } else { // Materials table
              tableContent = "| Item | Quantity | Unit Price | Total Cost | Source |\n";
              tableContent += "|------|----------|------------|------------|--------|\n";
            }
            
            // Process each line into table rows
            lines.forEach(line => {
              const parts = line.split(/[,:]/).map(p => p.trim());
              if (parts.length >= 2) {
                if (isLaborTable) {
                  const [task, hours = "", rate = "", cost = ""] = parts;
                  tableContent += `| ${task} | ${hours} | ${rate} | ${cost} |\n`;
                } else {
                  const [item, quantity = "", price = "", total = "", source = ""] = parts;
                  tableContent += `| ${item} | ${quantity} | ${price} | ${total} | ${source} |\n`;
                }
              }
            });
            
            // Update the content
            cleaned = cleaned.replace(match[0], match[0].replace(content, "\n" + tableContent + "\n"));
          }
        }
      }
    });

    // Format the total summary section
    const totalSummaryRegex = /## SECTION 7: TOTAL SUMMARY OF COSTS\s+([^#]*)/i;
    const totalMatch = cleaned.match(totalSummaryRegex);
    if (totalMatch) {
      let content = totalMatch[1].trim();
      
      // If not already in a table format
      if (!content.includes("|")) {
        const lines = content.split("\n").filter(Boolean);
        let tableContent = "| Cost Category | Amount |\n";
        tableContent += "|---------------|--------|\n";
        
        let totalLine = "";
        
        lines.forEach(line => {
          line = line.trim();
          const colonPos = line.indexOf(":");
          const dollarPos = line.indexOf("$");
          
          if (colonPos > -1 && dollarPos > -1) {
            const category = line.substring(0, colonPos).trim();
            const amount = line.substring(dollarPos).trim();
            
            if (line.toLowerCase().includes("total")) {
              totalLine = `| **${category}** | **${amount}** |\n`;
            } else {
              tableContent += `| ${category} | ${amount} |\n`;
            }
          }
        });
        
        if (totalLine) {
          tableContent += totalLine;
        }
        
        cleaned = cleaned.replace(totalMatch[0], totalMatch[0].replace(content, "\n" + tableContent + "\n"));
      }
    }

    // Format project timeline as bullet points if not already formatted
    const timelineRegex = /## SECTION 8: PROJECT TIMELINE\s+([^#]*)/i;
    const timelineMatch = cleaned.match(timelineRegex);
    if (timelineMatch) {
      let timelineContent = timelineMatch[1].trim();
      if (timelineContent && !timelineContent.includes("- ")) {
        const items = timelineContent.split(/\n+/).filter(Boolean);
        const bulletedItems = items.map(item => `- ${item.trim()}`).join("\n");
        cleaned = cleaned.replace(
          timelineRegex,
          `## SECTION 8: PROJECT TIMELINE\n\n${bulletedItems}\n\n`
        );
      }
    }

    // Ensure notes and terms section is formatted properly
    cleaned = cleaned.replace(/## SECTION 9: NOTES AND TERMS/i, "## SECTION 9: NOTES AND TERMS");
    
    // Add an extra newline before headers for spacing
    cleaned = cleaned.replace(/([^\n])(\n#+\s)/g, "$1\n$2");
    cleaned = cleaned.replace(/(#+\s)/g, "\n$1");

    // Add a blank line before tables if not present
    cleaned = cleaned.replace(/([^\n])(\n\|)/g, "$1\n$2");
    cleaned = cleaned.replace(/(\n\|.*\|\n)/g, "\n$1");
    
    // Condense multiple blank lines
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    // Bold "Total Project Cost" and similar summary headings
    cleaned = cleaned.replace(/(\*\*Total Project Cost\*\*|Total Project Cost|Total Estimate)/g, match =>
      `**${match.replace(/\*\*/g, "")}**`
    );

    // Trim any excess leading/trailing whitespace
    cleaned = cleaned.trim();

    return cleaned;
  }, [markdownContent]);
}
