
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
  return (
    <>
      {header}
      <ul className="ml-6 list-disc">
        {bulletPoints.map((item, i) => (
          <li key={i} className="my-1">{item}</li>
        ))}
      </ul>
    </>
  );
}
