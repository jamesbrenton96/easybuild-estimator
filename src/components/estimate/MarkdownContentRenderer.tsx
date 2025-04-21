
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownTableStyle from "./MarkdownTableStyle";
import { CustomSpan } from "./markdown/MarkdownCustomSpans";
import MarkdownSectionBulletList from "./markdown/MarkdownSectionBulletList";
import { MarkdownTableBlock } from "./markdown/MarkdownTableBlock";
import {
  isHeadingElement,
  isMatchingHeader,
  extractParagraphTexts,
  SectionHeaderTest,
  isNumberedSectionItem,
  hasNumberedSectionItems
} from "./markdown/utils/markdownSectionUtils";

/**
 * Render markdown content with professional table and content styling.
 * Used inside MarkdownEstimate.
 */
export default function MarkdownContentRenderer({ content }: { content: string }) {

  // Example header tests you can pass to the utilities
  const scopeOfWorkTest: SectionHeaderTest = val => /Scope of Work/i.test(val);
  const notesTest: SectionHeaderTest = val => /Notes & Terms|Notes|Terms/i.test(val);
  const correspondenceTest: SectionHeaderTest = val => /Correspondence|Client Details/i.test(val);

  // Custom section renderers (for bullet-list-like section transformation)
  function renderSection(children: React.ReactNode, headerTest: SectionHeaderTest) {
    const { headerIdx, bullets } = extractParagraphTexts(children);
    if (headerIdx !== -1 && bullets.length > 0) {
      const header = React.Children.toArray(children)[headerIdx];
      
      // Don't transform numbered section items into bullet points
      if (hasNumberedSectionItems(bullets)) {
        return children;
      }
      
      return <MarkdownSectionBulletList header={header} bulletPoints={bullets} />;
    }
    return children;
  }

  return (
    <div className="p-8 markdown-content text-gray-800">
      <MarkdownTableStyle />
      <ReactMarkdown
        className="prose max-w-none 
          prose-headings:font-semibold prose-headings:mb-4
          prose-h1:text-2xl prose-h1:font-bold prose-h1:border-b prose-h1:pb-2 prose-h1:border-gray-200
          prose-h2:text-xl prose-h2:text-construction-orange prose-h2:mt-6 
          prose-h3:text-lg prose-h3:text-construction-orange prose-h3:mt-5
          prose-h4:text-base prose-h4:mt-4  
          prose-p:my-2 prose-p:leading-relaxed
          prose-a:text-blue-600 
          prose-strong:text-construction-orange prose-strong:font-semibold
          prose-li:my-1
          prose-table:w-full prose-table:my-4 
          prose-th:bg-construction-orange prose-th:text-white prose-th:p-2 prose-th:text-left
          prose-td:p-2"
        remarkPlugins={[remarkGfm]}
        components={{
          span: CustomSpan,
          table: ({ ...props }) => (
            <table className="estimate-table w-full my-6 border-collapse" {...props} />
          ),
          thead: ({ ...props }) => (
            <thead className="estimate-table-head bg-construction-orange text-white" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="estimate-table-body" {...props} />
          ),
          th: ({ ...props }) => (
            <th className="estimate-table-header p-3 text-left font-bold" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="estimate-table-cell p-3 border border-gray-200" {...props} />
          ),
          p: ({ children, ...props }) => {
            // Custom subtotal table block rendering
            const childrenArray = React.Children.toArray(children);
            const hasNumberedSection = childrenArray.some(
              child => React.isValidElement(child) && child.props?.className === "section-number"
            );
            const hasSubtotalCells = childrenArray.some(
              child => React.isValidElement(child) && child.props?.className === "subtotal-cell"
            );

            if (hasNumberedSection) {
              return <p className="flex items-start mb-4" {...props}>{children}</p>;
            }

            if (hasSubtotalCells) {
              // Extract the content of the subtotal cells
              let description = '';
              let amount = '';
              childrenArray.forEach(child => {
                if (React.isValidElement(child) && child.props?.className === "subtotal-cell") {
                  const cellChildren = React.Children.toArray(child.props.children);
                  const content = cellChildren.map(item =>
                    typeof item === 'string' ? item : ''
                  ).join('').trim();

                  // Check if this cell contains a dollar sign (likely the amount)
                  if (content.includes('$')) {
                    amount = content;
                  } else {
                    description = content;
                  }
                }
              });
              if (description && amount) {
                return <MarkdownTableBlock rows={[[description, amount]]} />;
              }
            }

            return <p {...props}>{children}</p>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
