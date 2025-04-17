
export interface ConstructionType {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const CONSTRUCTION_TYPES: Record<string, ConstructionType> = {
  houseExtension: {
    id: "houseExtension",
    name: "House Extension",
    description: "Adding additional living space to an existing home.",
  },
  houseRenovation: {
    id: "houseRenovation",
    name: "House Renovation",
    description: "Updating or improving existing spaces within a home.",
  },
  newBuild: {
    id: "newBuild",
    name: "New Build",
    description: "Construction of a new building from the ground up.",
  },
  deckLandscaping: {
    id: "deckLandscaping",
    name: "Deck / Landscaping",
    description: "Outdoor structures and garden design/implementation.",
  },
  electrical: {
    id: "electrical",
    name: "Electrical",
    description: "Electrical wiring, fixtures, and system installations.",
  },
  plumbing: {
    id: "plumbing",
    name: "Plumbing",
    description: "Water supply, drainage systems, and fixture installations.",
  },
  concreting: {
    id: "concreting",
    name: "Concreting",
    description: "Concrete work for foundations, floors, and more.",
  },
  carpentryFraming: {
    id: "carpentryFraming",
    name: "Carpentry / Framing",
    description: "Wooden structures, frames, and detailed woodwork.",
  },
  roofing: {
    id: "roofing",
    name: "Roofing",
    description: "Roof installation, repair, and related structures.",
  },
  paintingDecorating: {
    id: "paintingDecorating",
    name: "Painting & Decorating",
    description: "Surface preparation, painting, and finishing work.",
  },
  tiling: {
    id: "tiling",
    name: "Tiling",
    description: "Installation of tiles on floors, walls, and other surfaces.",
  },
  plasteringGib: {
    id: "plasteringGib",
    name: "Plastering / Gib Stopping",
    description: "Wall and ceiling finishing and preparation.",
  },
  bricklayingBlockwork: {
    id: "bricklayingBlockwork",
    name: "Bricklaying / Blockwork",
    description: "Construction with bricks, blocks, and similar materials.",
  },
  earthworksExcavation: {
    id: "earthworksExcavation",
    name: "Earthworks / Excavation",
    description: "Ground preparation, digging, and site clearance.",
  },
  drainage: {
    id: "drainage",
    name: "Drainage",
    description: "Water management and drainage system installation.",
  },
  hvac: {
    id: "hvac",
    name: "HVAC",
    description: "Heating, ventilation, and air conditioning systems.",
  },
  insulation: {
    id: "insulation",
    name: "Insulation",
    description: "Thermal and acoustic insulation for buildings.",
  },
  flooring: {
    id: "flooring",
    name: "Flooring",
    description: "Various flooring materials and installation.",
  },
  windowsGlazing: {
    id: "windowsGlazing",
    name: "Windows & Glazing",
    description: "Window installation, glass work, and related services.",
  },
  cabinetryJoinery: {
    id: "cabinetryJoinery",
    name: "Cabinetry / Joinery",
    description: "Custom-built cabinets, furniture, and detailed woodwork.",
  },
  weldingMetalwork: {
    id: "weldingMetalwork",
    name: "Welding / Metalwork",
    description: "Metal fabrication, welding, and structural steel work.",
  },
  fencingGates: {
    id: "fencingGates",
    name: "Fencing / Gates",
    description: "Boundary fencing, gates, and related security features.",
  },
  demolition: {
    id: "demolition",
    name: "Demolition",
    description: "Safe removal of structures and materials.",
  },
  scaffolding: {
    id: "scaffolding",
    name: "Scaffolding",
    description: "Temporary structures for construction access.",
  },
  waterproofing: {
    id: "waterproofing",
    name: "Waterproofing",
    description: "Protection against water penetration and damage.",
  },
  solarInstallation: {
    id: "solarInstallation",
    name: "Solar Installation",
    description: "Solar panel and related renewable energy systems.",
  },
  smartHomeAutomation: {
    id: "smartHomeAutomation",
    name: "Smart Home / Automation",
    description: "Intelligent home systems and automation technology.",
  },
  sitePrepCleanup: {
    id: "sitePrepCleanup",
    name: "Site Prep & Cleanup",
    description: "Preparation and final cleaning of construction sites.",
  },
  allTrades: {
    id: "allTrades",
    name: "All Trades Included",
    description: "A comprehensive project requiring multiple trade disciplines.",
  }
};
