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

  // Utility to detect if we are in the Notes & Terms section
  function isNotesTermsSection(nodeProps) {
    // nodeProps is the props passed to the heading element
    const val = nodeProps?.children?.[0]?.props?.value || "";
    return /Notes & Terms|NOTES & TERMS/i.test(val);
  }

  // Track if we are inside "Notes & Terms" section
  let currentSection = null;

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
          h3: ({ node, ...props }) => {
            // Track if we are in Notes & Terms
            const isNotes = /Notes & Terms|NOTES & TERMS/i.test(
              (typeof props.children?.[0] === "string" && props.children?.[0]) || ""
            );
            currentSection = isNotes ? "notes-terms" : null;
            return <h3 {...props}>{props.children}</h3>;
          },
          p: ({ children, ...props }) => {
            // Determine if this is within "Notes & Terms" section
            const isInNotesTerms = currentSection === "notes-terms";
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(child =>
              typeof child === 'string' ? child : ''
            ).join('');
            
            // Check if this is a numbered item (e.g., "1. This is a note")
            const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
            if (numberMatch) {
              const number = numberMatch[1];
              const text = numberMatch[2];
              return isInNotesTerms ? (
                // In Notes & Terms: number marker but NORMAL body text (not colored/bold)
                <p className="flex items-start mb-4 text-gray-800 font-normal" {...props}>
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-[#e58c33] text-white rounded-full mr-2 font-bold text-sm flex-shrink-0">
                    {number}
                  </span>
                  {text}
                </p>
              ) : (
                <p className="flex items-start mb-4" {...props}>
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-construction-orange text-white rounded-full mr-2 font-bold text-sm flex-shrink-0">
                    {number}
                  </span>
                  {text}
                </p>
              );
            }

            // Handle subtotal cells
            const hasSubtotalCells = childrenArray.some(
              child => React.isValidElement(child) && child.props?.className === "subtotal-cell"
            );
            
            if (hasSubtotalCells) {
              let description = '';
              let amount = '';
              childrenArray.forEach(child => {
                if (React.isValidElement(child) && child.props?.className === "subtotal-cell") {
                  const cellChildren = React.Children.toArray(child.props.children);
                  const content = cellChildren.map(item =>
                    typeof item === 'string' ? item : ''
                  ).join('').trim();
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

            // Regular paragraphs (within Notes & Terms shouldn't be bold/orange, just normal text)
            return <p className={isInNotesTerms ? "text-gray-800 font-normal" : ""} {...props}>{children}</p>;
          },
          li: ({ children, ...props }) => {
            const isInNotesTerms = currentSection === "notes-terms";
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(child =>
              typeof child === 'string' ? child : ''
            ).join('');
            
            const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
            if (numberMatch) {
              const number = numberMatch[1];
              const text = numberMatch[2];
              return isInNotesTerms ? (
                <li className="flex items-start mb-4 text-gray-800 font-normal" {...props}>
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-[#e58c33] text-white rounded-full mr-2 font-bold text-sm flex-shrink-0">
                    {number}
                  </span>
                  {text}
                </li>
              ) : (
                <li className="flex items-start mb-4" {...props}>
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-construction-orange text-white rounded-full mr-2 font-bold text-sm flex-shrink-0">
                    {number}
                  </span>
                  {text}
                </li>
              );
            }

            // Bullet items in Notes & Terms: body text, not bold/orange
            return <li className={isInNotesTerms ? "text-gray-800 font-normal" : ""} {...props}>{children}</li>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
