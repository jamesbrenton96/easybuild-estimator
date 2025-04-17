
import { ProjectType } from "@/context/EstimatorContext";

export interface ConstructionType {
  id: string;
  name: ProjectType;
  description: string;
}

export const CONSTRUCTION_TYPES: Record<string, ConstructionType> = {
  allTrades: {
    id: "allTrades",
    name: "All Trades Included",
    description: "Comprehensive construction services covering multiple trades and specialties"
  },
  houseExtension: {
    id: "houseExtension",
    name: "House Extension",
    description: "Extend existing residential spaces with additional rooms or areas"
  },
  houseRenovation: {
    id: "houseRenovation", 
    name: "House Renovation",
    description: "Renew and update existing residential spaces with modern features"
  },
  newBuild: {
    id: "newBuild",
    name: "New Build",
    description: "Complete construction of new residential or commercial buildings"
  },
  deckLandscaping: {
    id: "deckLandscaping",
    name: "Deck / Landscaping",
    description: "Outdoor living spaces and garden design and implementation"
  },
  electrical: {
    id: "electrical",
    name: "Electrical",
    description: "Electrical wiring, fixtures, and system installation or repair"
  },
  plumbing: {
    id: "plumbing",
    name: "Plumbing",
    description: "Water, drainage and gas system installation or repair"
  },
  concreting: {
    id: "concreting",
    name: "Concreting",
    description: "Concrete pouring, finishing, and decorative concrete work"
  },
  carpentry: {
    id: "carpentry",
    name: "Carpentry / Framing",
    description: "Structural wood framing and finish carpentry work"
  },
  roofing: {
    id: "roofing",
    name: "Roofing",
    description: "Roof installation, replacement, or repair services"
  },
  painting: {
    id: "painting",
    name: "Painting & Decorating",
    description: "Interior and exterior painting and decorative finishes"
  },
  tiling: {
    id: "tiling",
    name: "Tiling",
    description: "Ceramic, porcelain, and stone tile installation for floors and walls"
  },
  plastering: {
    id: "plastering",
    name: "Plastering / Gib Stopping",
    description: "Wall and ceiling finishing with plaster or drywall compounds"
  },
  bricklaying: {
    id: "bricklaying",
    name: "Bricklaying / Blockwork",
    description: "Construction with brick, block, and stone masonry"
  },
  earthworks: {
    id: "earthworks",
    name: "Earthworks / Excavation",
    description: "Site preparation, digging, and ground moving services"
  },
  drainage: {
    id: "drainage",
    name: "Drainage",
    description: "Installation and repair of water drainage systems"
  },
  hvac: {
    id: "hvac",
    name: "HVAC",
    description: "Heating, ventilation, and air conditioning system services"
  },
  insulation: {
    id: "insulation",
    name: "Insulation",
    description: "Thermal and acoustic insulation installation"
  },
  flooring: {
    id: "flooring",
    name: "Flooring",
    description: "Installation of various flooring materials and finishes"
  },
  windowsGlazing: {
    id: "windowsGlazing",
    name: "Windows & Glazing",
    description: "Window installation, replacement, and glass services"
  },
  cabinetry: {
    id: "cabinetry",
    name: "Cabinetry / Joinery",
    description: "Custom cabinet and built-in furniture construction"
  },
  welding: {
    id: "welding",
    name: "Welding / Metalwork",
    description: "Metal fabrication, welding, and installation services"
  },
  fencing: {
    id: "fencing",
    name: "Fencing / Gates",
    description: "Installation of fences, gates, and related structures"
  },
  demolition: {
    id: "demolition",
    name: "Demolition",
    description: "Controlled demolition and removal of structures"
  },
  scaffolding: {
    id: "scaffolding",
    name: "Scaffolding",
    description: "Temporary platforms and support structures for construction"
  },
  waterproofing: {
    id: "waterproofing",
    name: "Waterproofing",
    description: "Water sealing and protection services for buildings"
  },
  solarInstallation: {
    id: "solarInstallation",
    name: "Solar Installation",
    description: "Solar panel and related system installation services"
  },
  smartHome: {
    id: "smartHome",
    name: "Smart Home / Automation",
    description: "Home automation and smart technology installation"
  },
  sitePrepCleanup: {
    id: "sitePrepCleanup",
    name: "Site Prep & Cleanup",
    description: "Preparation and cleanup services for construction sites"
  }
};
