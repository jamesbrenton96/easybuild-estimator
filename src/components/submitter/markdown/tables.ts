
interface MaterialRow {
  item: string;
  qty: number;
  unitPrice: number;
  total: number;
  source: string;
}

interface LabourRow {
  task: string;
  hours: number;
  rate: number;
  total: number;
}

interface TimelineRow {
  phase: string;
  duration: string;
}

export function createMaterialsTable(materials: MaterialRow[], showSources: boolean = true): string {
  if (!materials?.length) return '';
  
  if (showSources) {
    return `| Item | Qty | Unit Price (NZD) | Total (NZD) | Source |
|------|----:|----------------:|------------:|--------|
${materials.map(m => 
  `| ${m.item} | ${m.qty} | ${m.unitPrice} | ${m.total} | ${m.source} |`
).join('\n')}

`;
  } else {
    return `| Item | Qty | Unit Price (NZD) | Total (NZD) |
|------|----:|----------------:|------------:|
${materials.map(m => 
  `| ${m.item} | ${m.qty} | ${m.unitPrice} | ${m.total} |`
).join('\n')}

`;
  }
}

export function createLabourTable(labour: LabourRow[]): string {
  if (!labour?.length) return '';
  
  return `| Task | Hours | Rate (NZD/hr) | Total (NZD) |
|------|------:|-------------:|------------:|
${labour.map(l => 
  `| ${l.task} | ${l.hours} | ${l.rate} | ${l.total} |`
).join('\n')}

`;
}

export function createTimelineTable(timeline: TimelineRow[]): string {
  if (!timeline?.length) return '';
  
  return `| Phase | Duration |
|-------|----------|
${timeline.map(t => 
  `| ${t.phase} | ${t.duration} |`
).join('\n')}

`;
}

export function createTotalSummaryTable(totals: {
  materialsGrandTotal: number;
  labourGrandTotal: number;
  grandTotal: number;
}): string {
  return `| Category | Amount (NZD) |
|----------|-------------:|
| Materials (incl GST & margin) | $${totals.materialsGrandTotal} |
| Labour (incl GST) | $${totals.labourGrandTotal} |
| **Total Project Cost** | **$${totals.grandTotal}** |

`;
}
