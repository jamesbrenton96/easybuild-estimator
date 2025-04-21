
import React from "react";

export function CustomSpan({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { className?: string }) {
  if (className === "total-project-cost-block") {
    return <div className="total-project-cost-block">{children}</div>;
  }
  if (className === "subtotal-cell") {
    return <strong className="subtotal-cell">{children}</strong>;
  }
  if (className === "section-number") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 bg-construction-orange text-white rounded-full mr-2 font-bold text-sm">
        {children}
      </span>
    );
  }
  return <span {...props}>{children}</span>;
}
