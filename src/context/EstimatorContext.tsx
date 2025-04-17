
import React, { createContext, useContext, useState } from "react";

export type ProjectType = string;

export type SubcategoryOption = {
  value: string;
  label: string;
};

export type Subcategory = {
  name: string;
  options: SubcategoryOption[];
};

export interface CorrespondenceData {
  type?: string;
  clientName?: string;
  date?: string;
}

export interface ContentData {
  content: string;
}

export interface SubcategoryData {
  correspondence: CorrespondenceData;
  projectName: ContentData;
  overview: ContentData;
  dimensions: ContentData;
  materials: ContentData;
  finish: ContentData;
  locationDetails: ContentData;
  timeframe: ContentData;
  additionalWork: ContentData;
  rates: ContentData;
  margin: ContentData;
  notes: ContentData;
}

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
    case "Painting & Decorating":
      return [
        {
          name: "Surface Preparation",
          options: [
            { value: "sanding", label: "Sanding" },
            { value: "patching", label: "Patching" },
            { value: "priming", label: "Priming" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Painting Techniques",
          options: [
            { value: "brush", label: "Brush" },
            { value: "roller", label: "Roller" },
            { value: "spray", label: "Spray" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Paint Types",
          options: [
            { value: "water_based", label: "Water-based" },
            { value: "oil_based", label: "Oil-based" },
            { value: "epoxy", label: "Epoxy" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Interior vs Exterior",
          options: [
            { value: "walls", label: "Walls" },
            { value: "ceilings", label: "Ceilings" },
            { value: "trim", label: "Trim" },
            { value: "exterior_cladding", label: "Exterior Cladding" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish Type",
          options: [
            { value: "matte", label: "Matte" },
            { value: "satin", label: "Satin" },
            { value: "semi_gloss", label: "Semi-gloss" },
            { value: "gloss", label: "Gloss" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Specialty Coatings",
          options: [
            { value: "anti_mould", label: "Anti-mould" },
            { value: "heat_resistant", label: "Heat-resistant" },
            { value: "anti_graffiti", label: "Anti-graffiti" },
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
    case "Flooring":
      return [
        {
          name: "Material Type",
          options: [
            { value: "hardwood", label: "Hardwood" },
            { value: "engineered_timber", label: "Engineered Timber" },
            { value: "vinyl", label: "Vinyl" },
            { value: "laminate", label: "Laminate" },
            { value: "tile", label: "Tile" },
            { value: "carpet", label: "Carpet" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Subfloor Preparation",
          options: [
            { value: "concrete_slab", label: "Concrete Slab" },
            { value: "timber_subfloor", label: "Timber Subfloor" },
            { value: "underlay_installation", label: "Underlay Installation" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Flooring Installation",
          options: [
            { value: "glue_down", label: "Glue-down" },
            { value: "floating", label: "Floating" },
            { value: "nail_down", label: "Nail-down" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Finish Type",
          options: [
            { value: "polished", label: "Polished" },
            { value: "matte", label: "Matte" },
            { value: "glossy", label: "Glossy" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Underfloor Heating",
          options: [
            { value: "electric", label: "Electric" },
            { value: "hydronic", label: "Hydronic" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Eco-friendly Options",
          options: [
            { value: "bamboo", label: "Bamboo" },
            { value: "cork", label: "Cork" },
            { value: "recycled_materials", label: "Recycled Materials" },
            { value: "none", label: "None" },
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
    case "Demolition":
      return [
        {
          name: "Type of Demolition",
          options: [
            { value: "partial", label: "Partial" },
            { value: "full", label: "Full" },
            { value: "interior", label: "Interior" },
            { value: "exterior", label: "Exterior" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Materials Removal",
          options: [
            { value: "asbestos", label: "Asbestos" },
            { value: "hazardous_materials", label: "Hazardous Materials" },
            { value: "general_waste", label: "General Waste" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Disposal Method",
          options: [
            { value: "recycling", label: "Recycling" },
            { value: "landfill", label: "Landfill" },
            { value: "salvage", label: "Salvage" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Demolition Method",
          options: [
            { value: "manual", label: "Manual" },
            { value: "mechanical", label: "Mechanical" },
            { value: "explosive", label: "Explosive" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Site Safety",
          options: [
            { value: "scaffolding", label: "Scaffolding" },
            { value: "barriers", label: "Barriers" },
            { value: "dust_control", label: "Dust Control" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Permits & Compliance",
          options: [
            { value: "environmental_permits", label: "Environmental Permits" },
            { value: "demolition_permits", label: "Demolition Permits" },
            { value: "none", label: "None Required" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Scaffolding":
      return [
        {
          name: "Scaffolding Type",
          options: [
            { value: "frame_scaffolding", label: "Frame Scaffolding" },
            { value: "tube_and_clamp", label: "Tube and Clamp" },
            { value: "mobile_scaffolding", label: "Mobile Scaffolding" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Purpose",
          options: [
            { value: "access", label: "Access" },
            { value: "containment", label: "Containment" },
            { value: "support_for_roofing", label: "Support for Roofing" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Height Range",
          options: [
            { value: "low_level", label: "Low-level" },
            { value: "medium_level", label: "Medium-level" },
            { value: "high_level", label: "High-level" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Load Capacity",
          options: [
            { value: "light", label: "Light" },
            { value: "medium", label: "Medium" },
            { value: "heavy_duty", label: "Heavy-duty" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Safety Features",
          options: [
            { value: "guardrails", label: "Guardrails" },
            { value: "access_ladders", label: "Access Ladders" },
            { value: "fall_protection", label: "Fall Protection" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Modular Components",
          options: [
            { value: "planks", label: "Planks" },
            { value: "braces", label: "Braces" },
            { value: "platforms", label: "Platforms" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Waterproofing":
      return [
        {
          name: "Material Type",
          options: [
            { value: "liquid_membranes", label: "Liquid Membranes" },
            { value: "sheet_membranes", label: "Sheet Membranes" },
            { value: "bitumen_based", label: "Bitumen-based" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Application Areas",
          options: [
            { value: "roofs", label: "Roofs" },
            { value: "foundations", label: "Foundations" },
            { value: "balconies", label: "Balconies" },
            { value: "wet_areas", label: "Wet Areas" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Method of Application",
          options: [
            { value: "spray", label: "Spray" },
            { value: "roll_on", label: "Roll-on" },
            { value: "trowel_applied", label: "Trowel-applied" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Waterproofing for Wet Areas",
          options: [
            { value: "bathrooms", label: "Bathrooms" },
            { value: "kitchens", label: "Kitchens" },
            { value: "laundries", label: "Laundries" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Sealing Systems",
          options: [
            { value: "joints", label: "Joints" },
            { value: "penetrations", label: "Penetrations" },
            { value: "windows_doors", label: "Windows/Doors" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Sustainable Waterproofing",
          options: [
            { value: "eco_friendly_materials", label: "Eco-friendly Materials" },
            { value: "voc_free", label: "VOC-free" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Solar Installation":
      return [
        {
          name: "Solar Panel Type",
          options: [
            { value: "monocrystalline", label: "Monocrystalline" },
            { value: "polycrystalline", label: "Polycrystalline" },
            { value: "thin_film", label: "Thin-film" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "System Type",
          options: [
            { value: "grid_tied", label: "Grid-tied" },
            { value: "off_grid", label: "Off-grid" },
            { value: "hybrid", label: "Hybrid" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Inverter Type",
          options: [
            { value: "string_inverters", label: "String Inverters" },
            { value: "micro_inverters", label: "Micro-inverters" },
            { value: "power_optimizers", label: "Power Optimizers" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Battery Storage",
          options: [
            { value: "lithium_ion", label: "Lithium-ion" },
            { value: "lead_acid", label: "Lead-acid" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Roof Mounting Type",
          options: [
            { value: "fixed", label: "Fixed" },
            { value: "adjustable", label: "Adjustable" },
            { value: "ground_mounted", label: "Ground-mounted" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Performance Monitoring",
          options: [
            { value: "cloud_based", label: "Cloud-based" },
            { value: "smartphone_app", label: "Smartphone App Integration" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Smart Home / Automation":
      return [
        {
          name: "System Type",
          options: [
            { value: "lighting_control", label: "Lighting Control" },
            { value: "hvac_control", label: "HVAC Control" },
            { value: "security_systems", label: "Security Systems" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Integration with Other Systems",
          options: [
            { value: "home_theatre", label: "Home Theatre" },
            { value: "audio", label: "Audio" },
            { value: "intercom_systems", label: "Intercom Systems" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Connectivity",
          options: [
            { value: "wifi", label: "Wi-Fi" },
            { value: "zigbee", label: "Zigbee" },
            { value: "z_wave", label: "Z-Wave" },
            { value: "bluetooth", label: "Bluetooth" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Home Security",
          options: [
            { value: "motion_detectors", label: "Motion Detectors" },
            { value: "door_window_sensors", label: "Door/Window Sensors" },
            { value: "cameras", label: "Cameras" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Energy Management",
          options: [
            { value: "smart_thermostats", label: "Smart Thermostats" },
            { value: "energy_meters", label: "Energy Meters" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Voice Control",
          options: [
            { value: "amazon_alexa", label: "Amazon Alexa" },
            { value: "google_assistant", label: "Google Assistant" },
            { value: "apple_homekit", label: "Apple HomeKit" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        }
      ];
    case "Site Prep & Cleanup":
      return [
        {
          name: "Site Clearing",
          options: [
            { value: "trees", label: "Removal of Trees" },
            { value: "brush", label: "Brush" },
            { value: "old_structures", label: "Old Structures" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Excavation",
          options: [
            { value: "trenching", label: "Trenching" },
            { value: "grading", label: "Grading" },
            { value: "leveling", label: "Leveling" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Waste Removal",
          options: [
            { value: "construction_debris", label: "Construction Debris" },
            { value: "hazardous_materials", label: "Hazardous Materials" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Dust Control",
          options: [
            { value: "water_spraying", label: "Water Spraying" },
            { value: "tarping", label: "Tarping" },
            { value: "none", label: "None" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Final Site Clean",
          options: [
            { value: "sweeping", label: "Sweeping" },
            { value: "power_washing", label: "Power Washing" },
            { value: "window_cleaning", label: "Window Cleaning" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "Environmental Considerations",
          options: [
            { value: "erosion_control", label: "Erosion Control" },
            { value: "sediment_fencing", label: "Sediment Fencing" },
            { value: "none", label: "None" },
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
  subcategories: SubcategoryData;
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

const defaultSubcategoryData: SubcategoryData = {
  correspondence: {},
  projectName: { content: "" },
  overview: { content: "" },
  dimensions: { content: "" },
  materials: { content: "" },
  finish: { content: "" },
  locationDetails: { content: "" },
  timeframe: { content: "" },
  additionalWork: { content: "" },
  rates: { content: "" },
  margin: { content: "" },
  notes: { content: "" }
};

const defaultFormData: FormDataType = {
  projectType: null,
  description: "",
  location: "",
  files: [],
  subcategories: defaultSubcategoryData,
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
