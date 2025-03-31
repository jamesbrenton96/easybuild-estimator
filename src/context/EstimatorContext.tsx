
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
    // Add all other project types with their subcategories
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
    // Add remaining project types with subcategories here...
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
