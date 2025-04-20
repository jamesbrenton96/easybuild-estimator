
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper to format content into sections
const formatSections = (description: string) => {
  if (!description) return [];
  const sections = [];
  let currentTitle = "";
  let currentContent = "";
  description.split("\n").forEach((line) => {
    if (line.startsWith("# ")) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.trim() });
        currentContent = "";
      }
      currentTitle = line.replace("# ", "");
    } else if (line.trim()) {
      currentContent += line + "\n";
    }
  });
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentContent.trim() });
  }
  return sections;
};

export const PreviewCard = ({
  sections,
}: {
  sections: { title: string; content: string }[];
}) => (
  <Card className="mb-8 bg-white/5 border-white/20">
    <CardContent className="p-4">
      <h3 className="text-white font-medium mb-2">Project Details Preview</h3>
      <ScrollArea className="h-[400px] rounded-md border border-white/20 bg-white/10 p-4">
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="pb-4 border-b border-white/10 last:border-0">
              <h4 className="text-white font-medium mb-2">{section.title}</h4>
              <div className="text-white/90 whitespace-pre-wrap text-sm pl-3 border-l-2 border-white/20">
                {section.content}
              </div>
            </div>
          ))}
          {sections.length === 0 && (
            <p className="text-white/70 text-center italic">No project details provided</p>
          )}
        </div>
      </ScrollArea>
      <p className="text-white/70 text-xs mt-2">
        This is how your project details will be sent to our AI estimator. You can edit this content in the review step.
      </p>
    </CardContent>
  </Card>
);

PreviewCard.formatSections = formatSections;
