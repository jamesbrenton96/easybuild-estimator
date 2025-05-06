
import React from "react";

/**
 * Bullet-style unordered list for section content.
 */
export default function MarkdownSectionBulletList({
  header,
  bulletPoints,
}: {
  header: React.ReactNode,
  bulletPoints: string[],
}) {
  if (!header || !bulletPoints?.length) return null;
  
  // Check if this is the Notes and Terms section
  const isNotesAndTerms = header && (
    typeof header === 'string' && header.includes('NOTES AND TERMS') ||
    React.isValidElement(header) && header.props?.children?.includes?.('NOTES AND TERMS')
  );
  
  // Process bullet points - if already has numbered items, don't add bullets
  const processedPoints = bulletPoints.map((item, i) => {
    // Check for numbered list items like "1. Text"
    const numberMatch = item.match(/^(\d+)[\.\)]\s*(.*)/);
    if (numberMatch) {
      const number = numberMatch[1];
      const text = numberMatch[2];
      
      // Apply black text styling for Notes and Terms section
      return (
        <li key={i} className={`flex items-start mb-3 list-none -ml-6 ${isNotesAndTerms ? 'text-gray-800' : ''}`}>
          <span className={`inline-flex items-center justify-center w-7 h-7 ${isNotesAndTerms ? 'bg-gray-700 text-white' : 'bg-construction-orange text-white'} rounded-full mr-2 font-bold text-sm flex-shrink-0`}>
            {number}
          </span>
          <span className={isNotesAndTerms ? 'text-gray-800' : ''}>{text}</span>
        </li>
      );
    }
    
    // Regular bullet point with black text for Notes and Terms
    return (
      <li key={i} className={`my-2 ${isNotesAndTerms ? 'text-gray-800' : ''}`}>
        {item}
      </li>
    );
  });
  
  return (
    <>
      {header}
      <ul className="ml-6 list-disc space-y-2">
        {processedPoints}
      </ul>
    </>
  );
}
