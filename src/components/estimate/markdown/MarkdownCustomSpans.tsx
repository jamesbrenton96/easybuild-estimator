
import React from "react";

export function CustomSpan({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { className?: string }) {
  if (className === "total-project-cost-block") {
    return <div className="total-project-cost-block font-bold">{children}</div>;
  }
  if (className === "subtotal-cell") {
    return <strong className="subtotal-cell font-bold">{children}</strong>;
  }
  return <span className={className} {...props}>{children}</span>;
}
