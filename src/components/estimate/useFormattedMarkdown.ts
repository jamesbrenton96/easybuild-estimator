
import { useMemo } from "react";

/**
 * Format numbers with or without thin space separators for thousands
 */
const formatNumber = (num: number): string => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export function useFormattedMarkdown(markdownContent: string) {
  return useMemo(() => {
    if (!markdownContent) return "";

    let formatted = markdownContent;

    // Clean up escaped characters
    formatted = formatted
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "    ")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // Ensure correct section numbering and formatting
    const sections = [
      "Correspondence",
      "Project Overview",
      "Scope of Works",
      "Dimensions",
      "Materials & Cost Breakdown",
      "Labour Hours Breakdown",
      "Total Summary",
      "Project Timeline",
      "Notes & Terms"
    ];

    sections.forEach((section, index) => {
      const numberPrefix = `# ${index + 1}. `;
      const sectionRegex = new RegExp(`#\\s*(?:${index + 1}\\.\\s*)?${section}`, 'gi');
      formatted = formatted.replace(sectionRegex, `\n${numberPrefix}${section}\n\n`);
    });

    // Format tables with proper alignment and spacing
    formatted = formatted.replace(/\|[\s-:|]+\|/g, match => {
      return match.replace(/(\|)(\s*:?-+:?\s*(\|))/g, (_, start, content, end) => {
        return `${start}${'-'.repeat(20)}${end}`;
      });
    });

    // Format numbers in tables
    formatted = formatted.replace(
      /\|\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*\|/g,
      (match, number) => {
        const num = parseFloat(number.replace(/,/g, ''));
        return match.replace(number, formatNumber(num));
      }
    );

    // Ensure proper spacing after sections
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.replace(/(\n#\s[^\n]+)\n(?!\n)/g, '$1\n\n');
    
    // Ensure bullet points use dash instead of any other character
    formatted = formatted.replace(/^[•\*]\s/gm, '- ');

    // Add footer if not present
    if (!formatted.includes('---')) {
      formatted += '\n\n---\n*Generated automatically – Brenton Building*\n';
    }

    return formatted.trim();
  }, [markdownContent]);
}
