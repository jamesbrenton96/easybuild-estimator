import React, { createContext, useContext, useState } from "react";

export type ProjectType = 
  | "All Trades Included"
  | "House Extension"
  | "House Renovation"
  | "New Build"
  | "Deck / Landscaping"
  | "Electrical"
  | "Plumbing"
  | "Concreting"
  | "Carpentry / Framing"
  | "Roofing"
  | "Painting & Decorating"
  | "Tiling"
  | "Plastering / Gib Stopping"
  | "Bricklaying / Blockwork"
  | "Earthworks / Excavation"
  | "Drainage"
  | "HVAC"
  | "Insulation"
  | "Flooring"
  | "Windows & Glazing"
  | "Cabinetry / Joinery"
  | "Welding / Metalwork"
  | "Fencing / Gates"
  | "Demolition"
  | "Scaffolding"
  | "Waterproofing"
  | "Solar Installation"
  | "Smart Home / Automation"
  | "Site Prep & Cleanup";

export type SubcategoryOption = {
  value: string;
  label: string;
};

export type Subcategory = {
  name: string;
  options: SubcategoryOption[];
};

export const getSubcategoriesForProjectType = (projectType: ProjectType | null): Subcategory[] => {
  if (!projectType) return [];

  switch (projectType) {
    case "House Extension":
      return [
        {
          name: "Foundation Type",
          options: [
            { value: "concrete_slab", label: "Concrete Slab" },
            { value: "timber", label: "Timber" },
            { value: "pile", label: "Pile" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Wall Type",
          options: [
            { value: "brick", label: "Brick" },
            { value: "timber_framing", label: "Timber Framing" },
            { value: "steel_framing", label: "Steel Framing" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Roof Style",
          options: [
            { value: "flat", label: "Flat" },
            { value: "pitched", label: "Pitched" },
            { value: "skillion", label: "Skillion" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Insulation",
          options: [
            { value: "fiberglass", label: "Fiberglass" },
            { value: "spray_foam", label: "Spray Foam" },
            { value: "wool", label: "Wool" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "House Renovation":
      return [
        {
          name: "Room Type",
          options: [
            { value: "kitchen", label: "Kitchen" },
            { value: "bathroom", label: "Bathroom" },
            { value: "living_room", label: "Living Room" },
            { value: "bedroom", label: "Bedroom" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Flooring Type",
          options: [
            { value: "hardwood", label: "Hardwood" },
            { value: "tile", label: "Tile" },
            { value: "carpet", label: "Carpet" },
            { value: "vinyl", label: "Vinyl" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Structural Changes",
          options: [
            { value: "load_bearing_walls", label: "Load-bearing Walls" },
            { value: "partition_walls", label: "Partition Walls" },
            { value: "ceiling_height", label: "Ceiling Height" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Fixtures & Fittings",
          options: [
            { value: "lighting", label: "Lighting" },
            { value: "cabinetry", label: "Cabinetry" },
            { value: "plumbing", label: "Plumbing Fixtures" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "New Build":
      return [
        {
          name: "Foundation Type",
          options: [
            { value: "slab", label: "Slab" },
            { value: "pier_and_beam", label: "Pier and Beam" },
            { value: "crawlspace", label: "Crawlspace" },
            { value: "basement", label: "Basement" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Wall Material",
          options: [
            { value: "concrete", label: "Concrete" },
            { value: "timber", label: "Timber" },
            { value: "steel", label: "Steel" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Roofing Material",
          options: [
            { value: "tiles", label: "Tiles" },
            { value: "metal", label: "Metal" },
            { value: "asphalt_shingles", label: "Asphalt Shingles" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Exterior Finish",
          options: [
            { value: "brick", label: "Brick" },
            { value: "plaster", label: "Plaster" },
            { value: "wood_cladding", label: "Wood Cladding" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Deck / Landscaping":
      return [
        {
          name: "Deck Material",
          options: [
            { value: "composite", label: "Composite" },
            { value: "timber", label: "Timber" },
            { value: "pvc", label: "PVC" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Landscaping Type",
          options: [
            { value: "softscaping", label: "Softscaping" },
            { value: "hardscaping", label: "Hardscaping" },
            { value: "both", label: "Both" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Garden Features",
          options: [
            { value: "retaining_walls", label: "Retaining Walls" },
            { value: "water_features", label: "Water Features" },
            { value: "paving", label: "Paving" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Lighting",
          options: [
            { value: "ambient", label: "Ambient" },
            { value: "spotlights", label: "Spotlights" },
            { value: "motion_sensor", label: "Motion-sensor" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Electrical":
      return [
        {
          name: "Wiring Type",
          options: [
            { value: "standard", label: "Standard" },
            { value: "smart_home", label: "Smart Home" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Lighting Fixtures",
          options: [
            { value: "recessed", label: "Recessed" },
            { value: "pendant", label: "Pendant" },
            { value: "chandelier", label: "Chandelier" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Power Outlets",
          options: [
            { value: "standard", label: "Standard" },
            { value: "usb", label: "USB" },
            { value: "weatherproof", label: "Weatherproof" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Electrical Appliances",
          options: [
            { value: "dishwasher", label: "Dishwasher" },
            { value: "air_conditioner", label: "Air Conditioner" },
            { value: "heating", label: "Heating" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Plumbing":
      return [
        {
          name: "Pipe Material",
          options: [
            { value: "pvc", label: "PVC" },
            { value: "copper", label: "Copper" },
            { value: "pex", label: "PEX" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Fixtures",
          options: [
            { value: "sink", label: "Sink" },
            { value: "shower", label: "Shower" },
            { value: "toilet", label: "Toilet" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Water Heating",
          options: [
            { value: "tankless", label: "Tankless" },
            { value: "gas", label: "Gas" },
            { value: "electric", label: "Electric" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Drainage Systems",
          options: [
            { value: "french_drains", label: "French Drains" },
            { value: "sump_pumps", label: "Sump Pumps" },
            { value: "standard", label: "Standard" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Concreting":
      return [
        {
          name: "Concrete Mix Type",
          options: [
            { value: "reinforced", label: "Reinforced" },
            { value: "decorative", label: "Decorative" },
            { value: "standard", label: "Standard" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Application Area",
          options: [
            { value: "floor", label: "Floor" },
            { value: "driveway", label: "Driveway" },
            { value: "foundation", label: "Foundation" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Curing Method",
          options: [
            { value: "air_cured", label: "Air-cured" },
            { value: "water_cured", label: "Water-cured" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Surface Finish",
          options: [
            { value: "stamped", label: "Stamped" },
            { value: "polished", label: "Polished" },
            { value: "brushed", label: "Brushed" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Carpentry / Framing":
      return [
        {
          name: "Frame Material",
          options: [
            { value: "timber", label: "Timber" },
            { value: "steel", label: "Steel" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Wall Type",
          options: [
            { value: "load_bearing", label: "Load-bearing" },
            { value: "non_load_bearing", label: "Non-load-bearing" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Roofing Structure",
          options: [
            { value: "trusses", label: "Trusses" },
            { value: "rafters", label: "Rafters" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Window/door Frames",
          options: [
            { value: "timber", label: "Timber" },
            { value: "aluminum", label: "Aluminum" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Roofing":
      return [
        {
          name: "Type of Roof",
          options: [
            { value: "gable", label: "Gable" },
            { value: "hip", label: "Hip" },
            { value: "flat", label: "Flat" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Roof Pitch",
          options: [
            { value: "steep", label: "Steep" },
            { value: "low_slope", label: "Low Slope" },
            { value: "medium", label: "Medium" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Roofing Material",
          options: [
            { value: "shingles", label: "Shingles" },
            { value: "metal", label: "Metal" },
            { value: "tile", label: "Tile" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Insulation Type",
          options: [
            { value: "fiberglass", label: "Fiberglass" },
            { value: "spray_foam", label: "Spray Foam" },
            { value: "cellulose", label: "Cellulose" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Tiling":
      return [
        {
          name: "Tile Material",
          options: [
            { value: "ceramic", label: "Ceramic" },
            { value: "porcelain", label: "Porcelain" },
            { value: "stone", label: "Stone" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Tile Finish",
          options: [
            { value: "matte", label: "Matte" },
            { value: "glossy", label: "Glossy" },
            { value: "textured", label: "Textured" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Tile Size",
          options: [
            { value: "small", label: "Small" },
            { value: "large", label: "Large" },
            { value: "mosaic", label: "Mosaic" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Grouting Type",
          options: [
            { value: "epoxy", label: "Epoxy" },
            { value: "cement_based", label: "Cement-based" },
            { value: "sanded", label: "Sanded" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Plastering / Gib Stopping":
      return [
        {
          name: "Plaster Type",
          options: [
            { value: "skim_coat", label: "Skim Coat" },
            { value: "venetian_plaster", label: "Venetian Plaster" },
            { value: "lime", label: "Lime" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Wall Surface",
          options: [
            { value: "dry_wall", label: "Dry Wall" },
            { value: "masonry", label: "Masonry" },
            { value: "lath", label: "Lath" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish Type",
          options: [
            { value: "smooth", label: "Smooth" },
            { value: "textured", label: "Textured" },
            { value: "patterned", label: "Patterned" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Joint Compound",
          options: [
            { value: "lightweight", label: "Lightweight" },
            { value: "standard", label: "Standard" },
            { value: "quick_setting", label: "Quick-setting" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Bricklaying / Blockwork":
      return [
        {
          name: "Brick Type",
          options: [
            { value: "clay", label: "Clay" },
            { value: "concrete", label: "Concrete" },
            { value: "engineering", label: "Engineering" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Mortar Mix",
          options: [
            { value: "sand_cement", label: "Sand-Cement" },
            { value: "lime", label: "Lime" },
            { value: "polymer", label: "Polymer" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Wall Type",
          options: [
            { value: "single_skin", label: "Single Skin" },
            { value: "double_skin", label: "Double Skin" },
            { value: "cavity", label: "Cavity" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Pattern Type",
          options: [
            { value: "stretcher_bond", label: "Stretcher Bond" },
            { value: "herringbone", label: "Herringbone" },
            { value: "flemish_bond", label: "Flemish Bond" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Earthworks / Excavation":
      return [
        {
          name: "Excavation Type",
          options: [
            { value: "trench", label: "Trench" },
            { value: "foundation", label: "Foundation" },
            { value: "grading", label: "Grading" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Soil Type",
          options: [
            { value: "clay", label: "Clay" },
            { value: "sand", label: "Sand" },
            { value: "loam", label: "Loam" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Excavation Depth",
          options: [
            { value: "shallow", label: "Shallow" },
            { value: "deep", label: "Deep" },
            { value: "medium", label: "Medium" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Machinery Required",
          options: [
            { value: "backhoe", label: "Backhoe" },
            { value: "bulldozer", label: "Bulldozer" },
            { value: "excavator", label: "Excavator" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Drainage":
      return [
        {
          name: "Drain Type",
          options: [
            { value: "french_drain", label: "French Drain" },
            { value: "surface_drain", label: "Surface Drain" },
            { value: "channel_drain", label: "Channel Drain" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Material Type",
          options: [
            { value: "pvc", label: "PVC" },
            { value: "clay", label: "Clay" },
            { value: "concrete", label: "Concrete" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "System Layout",
          options: [
            { value: "gravity_fed", label: "Gravity-fed" },
            { value: "pump_assisted", label: "Pump-assisted" },
            { value: "combined", label: "Combined" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Slope / Angle",
          options: [
            { value: "steep", label: "Steep" },
            { value: "gradual", label: "Gradual" },
            { value: "moderate", label: "Moderate" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "HVAC":
      return [
        {
          name: "System Type",
          options: [
            { value: "central", label: "Central" },
            { value: "ductless", label: "Ductless" },
            { value: "split_system", label: "Split System" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Energy Source",
          options: [
            { value: "gas", label: "Gas" },
            { value: "electric", label: "Electric" },
            { value: "geothermal", label: "Geothermal" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Ventilation Type",
          options: [
            { value: "heat_recovery", label: "Heat Recovery" },
            { value: "exhaust", label: "Exhaust" },
            { value: "natural", label: "Natural" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Filter Type",
          options: [
            { value: "hepa", label: "HEPA" },
            { value: "charcoal", label: "Charcoal" },
            { value: "electrostatic", label: "Electrostatic" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Insulation":
      return [
        {
          name: "Insulation Material",
          options: [
            { value: "fiberglass", label: "Fiberglass" },
            { value: "foam_board", label: "Foam Board" },
            { value: "cellulose", label: "Cellulose" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Installation Type",
          options: [
            { value: "batt", label: "Batt" },
            { value: "spray_foam", label: "Spray Foam" },
            { value: "blown_in", label: "Blown-in" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Area Type",
          options: [
            { value: "attic", label: "Attic" },
            { value: "walls", label: "Walls" },
            { value: "floors", label: "Floors" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "R-value",
          options: [
            { value: "r_13", label: "R-13" },
            { value: "r_30", label: "R-30" },
            { value: "r_49", label: "R-49" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Windows & Glazing":
      return [
        {
          name: "Glass Type",
          options: [
            { value: "double_glazed", label: "Double-glazed" },
            { value: "tinted", label: "Tinted" },
            { value: "low_e", label: "Low-E" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Frame Material",
          options: [
            { value: "wood", label: "Wood" },
            { value: "aluminum", label: "Aluminum" },
            { value: "pvc", label: "PVC" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Opening Type",
          options: [
            { value: "casement", label: "Casement" },
            { value: "sliding", label: "Sliding" },
            { value: "awning", label: "Awning" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish Type",
          options: [
            { value: "clear", label: "Clear" },
            { value: "frosted", label: "Frosted" },
            { value: "patterned", label: "Patterned" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Cabinetry / Joinery":
      return [
        {
          name: "Cabinet Style",
          options: [
            { value: "shaker", label: "Shaker" },
            { value: "modern", label: "Modern" },
            { value: "traditional", label: "Traditional" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Material",
          options: [
            { value: "mdf", label: "MDF" },
            { value: "solid_wood", label: "Solid Wood" },
            { value: "plywood", label: "Plywood" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish",
          options: [
            { value: "lacquered", label: "Lacquered" },
            { value: "veneered", label: "Veneered" },
            { value: "painted", label: "Painted" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Storage Features",
          options: [
            { value: "pull_out_drawers", label: "Pull-out Drawers" },
            { value: "shelves", label: "Shelves" },
            { value: "custom_inserts", label: "Custom Inserts" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Welding / Metalwork":
      return [
        {
          name: "Metal Type",
          options: [
            { value: "steel", label: "Steel" },
            { value: "aluminum", label: "Aluminum" },
            { value: "wrought_iron", label: "Wrought Iron" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Welding Method",
          options: [
            { value: "mig", label: "MIG" },
            { value: "tig", label: "TIG" },
            { value: "stick", label: "Stick" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Fabrication Type",
          options: [
            { value: "structural", label: "Structural" },
            { value: "decorative", label: "Decorative" },
            { value: "mechanical", label: "Mechanical" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish Type",
          options: [
            { value: "powder_coated", label: "Powder-coated" },
            { value: "galvanized", label: "Galvanized" },
            { value: "painted", label: "Painted" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Fencing / Gates":
      return [
        {
          name: "Material Type",
          options: [
            { value: "timber", label: "Timber" },
            { value: "steel", label: "Steel" },
            { value: "aluminum", label: "Aluminum" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Gate Style",
          options: [
            { value: "swing", label: "Swing" },
            { value: "sliding", label: "Sliding" },
            { value: "bi_fold", label: "Bi-fold" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Fence Height",
          options: [
            { value: "standard", label: "Standard" },
            { value: "privacy", label: "Privacy" },
            { value: "security", label: "Security" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish Type",
          options: [
            { value: "treated_wood", label: "Treated Wood" },
            { value: "powder_coated", label: "Powder-coated" },
            { value: "painted", label: "Painted" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    default:
      return [];
  }
};

type FormDataType = {
  projectType: ProjectType | null;
  description: string;
  location: string;
  files: File[];
  subcategories: Record<string, string>;
};

type EstimatorContextProps = {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  estimationResults: any | null;
  setEstimationResults: (results: any) => void;
};

const defaultFormData: FormDataType = {
  projectType: null,
  description: "",
  location: "",
  files: [],
  subcategories: {},
};

const defaultContextValue: EstimatorContextProps = {
  currentStep: 1,
  nextStep: () => {},
  prevStep: () => {},
  setStep: () => {},
  formData: defaultFormData,
  updateFormData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  estimationResults: null,
  setEstimationResults: () => {},
};

const EstimatorContext = createContext<EstimatorContextProps>(defaultContextValue);

export const useEstimator = () => useContext(EstimatorContext);

export const EstimatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [estimationResults, setEstimationResults] = useState<any | null>(null);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const setStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const value = {
    currentStep,
    nextStep,
    prevStep,
    setStep,
    formData,
    updateFormData,
    isLoading,
    setIsLoading,
    estimationResults,
    setEstimationResults,
  };

  return <EstimatorContext.Provider value={value}>{children}</EstimatorContext.Provider>;
};
