
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
  
  // Process bullet points - if already has section-number spans, don't add bullets
  const processedPoints = bulletPoints.map((item, i) => {
    const hasNumberedSection = item.includes('<span class="section-number">');
    return (
      <li key={i} className={`my-2 ${hasNumberedSection ? 'list-none -ml-6 flex items-start' : ''}`}>
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
