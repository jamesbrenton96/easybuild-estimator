
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
  
  // Process bullet points - if already has numbered items, don't add bullets
  const processedPoints = bulletPoints.map((item, i) => {
    // Check for numbered list items like "1. Text"
    const numberMatch = item.match(/^(\d+)[\.\)]\s*(.*)/);
    if (numberMatch) {
      const number = numberMatch[1];
      const text = numberMatch[2];
      
      return (
        <li key={i} className="flex items-start mb-8 list-none -ml-6">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-construction-orange text-white rounded-full mr-2 font-bold text-sm flex-shrink-0">
            {number}
          </span>
          <span>{text}</span>
        </li>
      );
    }
    
    // Regular bullet point - ensure dash format
    const cleanedItem = item.replace(/^[\*•]\s*/, "");
    const formattedItem = item.startsWith("-") ? item : `- ${cleanedItem}`;
    
    return (
      <li key={i} className="my-2 mb-8 relative">
        {formattedItem}
      </li>
    );
  });
  
  return (
    <>
      {header}
      <ul className="ml-6 list-disc space-y-6">
        {processedPoints}
      </ul>
    </>
  );
}
