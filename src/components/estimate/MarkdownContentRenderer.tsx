
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
 * This version uses the Brenton Building template formatting.
 */
export default function MarkdownContentRenderer({ content }: { content: string }) {

  // Example header tests you can pass to the utilities
  const scopeOfWorkTest: SectionHeaderTest = val => /Scope of Work|SCOPE OF WORKS/i.test(val);
  const notesTest: SectionHeaderTest = val => /Notes & Terms|Notes|Terms|NOTES AND TERMS/i.test(val);
  const correspondenceTest: SectionHeaderTest = val => /Correspondence|Client Details|CORRESPONDENCE/i.test(val);

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

  // Track section we are in
  let currentSection = null;

  // Helper function to create section headers in Brenton format
  function createSectionHeader(title: string, sectionNumber?: number) {
    const sectionPrefix = sectionNumber ? `SECTION ${sectionNumber}: ` : '';
    return (
      <h2 className="section-title text-construction-orange uppercase font-bold border-b border-construction-orange pb-1 mb-4 mt-6">
        {sectionPrefix}{title}
      </h2>
    );
  }

  // Utility: Determine if a heading is for specific sections
  function isSectionHeading(props: any, pattern: RegExp) {
    if (typeof props?.children?.[0] === "string") {
      return pattern.test(props?.children?.[0]);
    }
    return false;
  }

  // Format section headings in the Brenton building style
  function formatSectionHeading(props: any) {
    const text = props?.children?.[0];
    if (typeof text !== 'string') return null;
    
    // Match section numbers and titles
    const sectionMatch = text.match(/^(?:SECTION\s+)?(\d+)(?::|\.|\s*[-–—])?\s*(.+)$/i);
    if (sectionMatch) {
      const [_, sectionNum, title] = sectionMatch;
      return createSectionHeader(title.toUpperCase(), parseInt(sectionNum));
    }
    
    // For known section titles without numbers
    const knownSections = {
      "CORRESPONDENCE": 1,
      "PROJECT OVERVIEW": 2, 
      "SCOPE OF WORKS": 3,
      "DIMENSIONS": 4,
      "MATERIALS AND COST BREAKDOWN": 5,
      "LABOR HOURS BREAKDOWN": 6,
      "TOTAL SUMMARY OF COSTS": 7,
      "PROJECT TIMELINE": 8,
      "NOTES AND TERMS": 9
    };
    
    const normalizedText = text.toUpperCase().trim();
    
    for (const [sectionName, sectionNum] of Object.entries(knownSections)) {
      if (normalizedText.includes(sectionName)) {
        return createSectionHeader(sectionName, sectionNum);
      }
    }
    
    // Default case - just create section header without number
    return createSectionHeader(text.toUpperCase());
  }

  return (
    <div className="p-8 markdown-content text-gray-800">
      <MarkdownTableStyle />
      <ReactMarkdown
        className="prose max-w-none"
        remarkPlugins={[remarkGfm]}
        components={{
          span: CustomSpan,
          table: ({ ...props }) => (
            <table className="estimate-table w-full my-4 border-collapse" {...props} />
          ),
          thead: ({ ...props }) => (
            <thead className="estimate-table-head bg-gray-100" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="estimate-table-body" {...props} />
          ),
          th: ({ ...props }) => (
            <th className="estimate-table-header p-2 text-left font-bold border border-gray-200" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="estimate-table-cell p-2 border border-gray-200" {...props} />
          ),
          h1: ({ children, ...props }) => {
            // Main title formatting
            return (
              <h1 className="project-title text-xl text-construction-orange text-center font-bold my-4">
                {children}
              </h1>
            );
          },
          h2: ({ node, ...props }) => {
            // Format section headers like "SECTION 1: CORRESPONDENCE"
            const formattedHeading = formatSectionHeading(props);
            if (formattedHeading) {
              // Track section
              const headingText = props?.children?.[0]?.toString()?.toUpperCase() || '';
              if (headingText.includes('NOTES') && headingText.includes('TERMS')) {
                currentSection = 'notes-terms';
              } else {
                currentSection = headingText;
              }
              return formattedHeading;
            }
            return <h2 className="text-xl text-construction-orange font-semibold mt-4 mb-2" {...props}>{props.children}</h2>;
          },
          h3: ({ node, ...props }) => {
            // Check if this is actually a section header
            const formattedHeading = formatSectionHeading(props);
            if (formattedHeading) {
              const headingText = props?.children?.[0]?.toString()?.toUpperCase() || '';
              if (headingText.includes('NOTES') && headingText.includes('TERMS')) {
                currentSection = 'notes-terms';
              } else {
                currentSection = headingText;
              }
              return formattedHeading;
            }
            
            // Regular h3 - subsection header
            return <h3 className="font-semibold text-lg mb-2" {...props}>{props.children}</h3>;
          },
          p: ({ children, ...props }) => {
            // Handle correspondence section items
            const isInNotesTerms = currentSection === 'notes-terms';
            const isInCorrespondence = currentSection?.includes('CORRESPONDENCE');
            
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(child =>
              typeof child === 'string' ? child : ''
            ).join('');
            
            // Handle correspondence items (Client Name:, Project Address:, etc.)
            if (isInCorrespondence) {
              const match = textContent.match(/^([^:]+):(.+)/);
              if (match) {
                const [_, label, value] = match;
                return (
                  <div className="correspondence-item flex mb-2">
                    <div className="correspondence-label font-semibold w-32">{label.trim()}:</div>
                    <div>{value.trim()}</div>
                  </div>
                );
              }
            }
            
            // Format notes and terms as bullet points with orange markers
            if (isInNotesTerms) {
              // If this is a bullet point in Notes & Terms
              if (textContent.trim().startsWith('•')) {
                return (
                  <p className="flex items-start ml-1 mb-2">
                    <span className="text-construction-orange mr-2">•</span>
                    <span>{textContent.replace(/^•\s*/, '')}</span>
                  </p>
                );
              }
              
              // If this is a numbered item in Notes & Terms
              const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
              if (numberMatch) {
                return (
                  <p className="flex items-start ml-1 mb-2">
                    <span className="mr-2 font-semibold">{numberMatch[1]}.</span>
                    <span>{numberMatch[2]}</span>
                  </p>
                );
              }
            }
            
            // Handle subtotal cells for tables
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
            
            // Regular paragraphs
            return (
              <p className="mb-3" {...props}>
                {children}
              </p>
            );
          },
          li: ({ children, ...props }) => {
            const isInNotesTerms = currentSection === 'notes-terms';
            
            // Format list items to match template
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(child =>
              typeof child === 'string' ? child : ''
            ).join('');
            
            // Check if it's a numbered item
            const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
            if (numberMatch) {
              return (
                <li className="ml-1 mb-2 flex items-start" {...props}>
                  <span className="mr-2 font-semibold">{numberMatch[1]}.</span>
                  <span>{numberMatch[2]}</span>
                </li>
              );
            }
            
            // Format scope of work bullet points to match template
            const isScopeOfWork = currentSection?.includes('SCOPE');
            if (isScopeOfWork) {
              return (
                <li className="ml-1 mb-2 flex items-start" {...props}>
                  <span className="text-construction-orange mr-2">•</span>
                  <span>{textContent}</span>
                </li>
              );
            }
            
            // Default list item
            return <li className="ml-5 mb-2" {...props}>{children}</li>;
          },
          strong: ({ children, ...props }) => {
            const isInNotesTerms = currentSection === 'notes-terms';
            
            // Standard bold text in notes and terms
            if (isInNotesTerms) {
              return <span className="font-semibold" {...props}>{children}</span>;
            }
            
            // Use bold for total rows 
            const text = React.Children.toArray(children).join('').toString();
            if (text.includes('TOTAL') || text.includes('Total')) {
              return <span className="font-bold" {...props}>{children}</span>;
            }
            
            // Default case
            return <strong {...props}>{children}</strong>;
          },
          ul: ({ children, ...props }) => {
            const isScopeOfWork = currentSection?.includes('SCOPE');
            
            return (
              <ul className={`${isScopeOfWork ? 'list-none pl-0' : 'pl-6 list-disc'} space-y-1`} {...props}>
                {children}
              </ul>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* Add document footer */}
      <div className="document-footer text-center text-xs text-gray-500 mt-8 pt-2">
        <p>Brenton Building | Phone: 021 XXX XXXX | Email: info@brentonbuilding.co.nz</p>
        <p>Quote prepared on April 26, 2025 | Quote Reference: BB-2025-0426</p>
      </div>
    </div>
  );
}
