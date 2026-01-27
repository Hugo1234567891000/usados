// Property Types
export interface GalleryImage {
  url: string;
  title: string;
  type: 'photo' | 'render' | '3d';
  category?: 'exterior' | 'interior' | 'amenity';
}

export interface RealEstateProject {
  id: string;
  code: string;
  name: string;
  status: 'preLaunch' | 'underConstruction' | 'completed';
  transactionType: 'sale' | 'rent';
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  completionDate: string;
  totalUnits: number;
  amenities: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  units: any[];
  media: any[];
  features: {
    sustainability: string[];
    security: string[];
    technology: string[];
  };
  pricing: {
    startingPrice: number;
    maxPrice: number;
    pricePerSqft: number;
  };
  paymentOptions: {
    acceptsFinancing: boolean;
    minDownPayment: number;
    maxInstallments: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
  constructorId: string;
}

export interface Property {
  id: number;
  title: string;
  price: string;
  image: string;
  details?: string;
  description?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  area: {
    total: number;
    built?: number;
  };
  rooms: {
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
  };
  status: 'available' | 'reserved' | 'sold';
  type: 'house' | 'apartment' | 'commercial' | 'land' | 'building';
  constructionStatus?: 'launched' | 'underConstruction' | 'ready' | 'delivered';
  deliveryDate?: string;
  developer?: string;
  virtualTour?: string;
  gallery?: GalleryImage[];
  selectedAmenities?: string[]; // IDs das amenidades selecionadas pela construtora no AmenitiesSelection
  constructionAllowed?: boolean;
  priceChanges?: Array<{
    date: string;
    oldPrice: string;
    newPrice: string;
  }>;

  // Campos adicionados para refletir o preenchimento da construtora
  code?: string; // Código do empreendimento
  transactionType?: 'sale' | 'rent'; // Tipo de transação
  totalUnits?: number; // Número total de unidades
  deliveryDate?: string; // Data de entrega (corresponde ao completionDate)
  
  // Campos específicos para Lotes
  propertyState?: string; // Estado do terreno (ex: 'ready-to-build', 'needs-preparation')
  propertySituation?: string; // Situação do imóvel (ex: 'available', 'bare-ownership')
  lotFeatures?: {
    minLotSize?: number;
    maxLotSize?: number;
    hasWater?: boolean;
    hasElectricity?: boolean;
    hasSewage?: boolean;
    hasAsphalt?: boolean;
    allowsConstruction?: boolean;
    maxBuildingHeight?: number;
    setbackRequirements?: {
      front: number;
      side: number;
      back: number;
    };
  };
  
  pricePerSqft?: number; // Preço por m² (numérico)
  
  // Características detalhadas (sustentabilidade, segurança, tecnologia)
  detailedFeatures?: {
    sustainability: string[];
    security: string[];
    technology: string[];
  };

  // Campos específicos do formulário de Apartamentos
  condominiumAmenities?: string[];
  views?: string[];
  parking?: {
    coveredSpaces: number;
    visitorSpaces: number;
    electricCarCharging: boolean;
    bikeRack: boolean;
  };
  architecturalStyle?: string;
  exterior?: {
    facade: string;
    landscaping: string;
    lighting: string;
    security: string;
  };
  interiorFeatures?: {
    flooring: string;
    kitchen: string;
    bathrooms: string;
    airConditioning: string;
    lighting: string;
    storage: string;
  };
  roomDetails?: {
    masterBedroom?: {
      size: string;
      features: string[];
    };
    secondBedroom?: {
      size: string;
      features: string[];
    };
    livingRoom?: {
      size: string;
      features: string[];
    };
    kitchen?: {
      size: string;
      features: string[];
    };
  };
  
  // Campos específicos do formulário Houses.tsx (Casas)
  houseFeatures?: {
    lotSize: number;
    builtArea: number;
    floors: number;
    suites: number;
    balconies: number;
    privateGarden: boolean;
    privatePool: boolean;
    gourmetArea: boolean;
    serviceArea: boolean;
  };
  condominiumFeatures?: {
    totalHouses: number;
    preservedArea: number;
    clubhouse: boolean;
    sportsComplex: boolean;
    walkingTrails: boolean;
    security24h: boolean;
    controlledAccess: boolean;
  };
  architecturalDetails?: {
    style: string;
    facade: string;
    roofing: string;
    landscaping: string;
    sustainability: string[];
  };
  
  // Campos adicionais do formulário Houses.tsx
  ceilingType?: string;
  appliances?: string[];
  coolingType?: string;
  heatingType?: string;
  heatingFuel?: string;
  floorCovering?: {
    livingAreas: string;
    bedrooms: string;
    bathrooms: string;
    kitchen: string;
    serviceAreas: string;
  };
  basement?: {
    hasBasement: boolean;
    basementType?: string;
    basementArea?: number;
    basementUse?: string;
  };
  bedroomDetails?: {
    totalBedrooms: number;
    suites: number;
    masterSuite: boolean;
    guestRoom: boolean;
    serviceRoom: boolean;
  };
  condominiumMedia?: {
    images: string[];
    virtualTour?: string;
    floorPlans: string[];
  };

  // Campos específicos do formulário Rooms.tsx (Empresarial)
  commercialFeatures?: {
    buildingClass: string;
    floors: number;
    unitsPerFloor: number;
    ceilingHeight: number;
    airConditioning: string;
    structuredCabling: boolean;
    fiberOptic: boolean;
    generator: boolean;
    loadingDock: boolean;
  };
  commercialSpecifications?: {
    buildingClass: string;
    totalFloors: number;
    unitsPerFloor: number;
    ceilingHeight: number;
    totalUnits: number;
    parkingSpaces: number;
    loadingDocks: number;
    elevators: number;
    emergencyStairs: number;
  };
  commercialPropertySituation?: string; // Situação do Imóvel
  commercialPropertyState?: string; // Estado do Imóvel
  spaceConfiguration?: {
    openFloorPlan: boolean;
    privateOffices: boolean;
    meetingRooms: boolean;
    receptionArea: boolean;
    kitchenette: boolean;
    storageRoom: boolean;
    serverRoom: boolean;
    breakRoom: boolean;
  };
  commercialSpaceConfiguration?: {
    openFloorPlan: boolean;
    privateOffices: boolean;
    meetingRooms: boolean;
    receptionArea: boolean;
    kitchenette: boolean;
    storageRoom: boolean;
    serverRoom: boolean;
    breakRoom: boolean;
  };
  commercialInteriorFeatures?: {
    flooring: string;
    kitchen: string;
    bathrooms: string;
    airConditioning: string;
    lighting: string;
    storage: string;
  };
  commercialCeilingType?: string; // Teto
  commercialViews?: string[]; // Vista
  commercialParking?: {
    coveredSpaces: number;
    visitorSpaces: number;
    electricCarCharging: boolean;
    bikeRack: boolean;
    loadingDocks: number;
  };
  commercialArchitecturalStyle?: string; // Estilo Arquitetônico
  commercialExterior?: {
    facade: string;
    landscaping: string;
    lighting: string;
    security: string;
  };
  commercialInternalFeatures?: {
    ceilingHeight: string;
    floorLoad: string;
    hvacSystem: string;
    electricalSystem: string;
    plumbingSystem: string;
    fireSystem: string;
  };
  commercialAppliances?: string[]; // Eletrodomésticos
  commercialCoolingType?: string; // Tipo de Resfriamento
  commercialHeatingType?: string; // Tipo de Aquecimento
  commercialHeatingFuel?: string; // Combustível de Aquecimento
  commercialFloorCovering?: {
    officeAreas: string;
    meetingRooms: string;
    bathrooms: string;
    commonAreas: string;
    serviceAreas: string;
  };
  commercialBasement?: {
    hasBasement: boolean;
    basementType?: string;
    basementArea?: number;
    basementUse?: string;
  };
  commercialRoomDetails?: {
    totalRooms: number;
    executiveSuites: number;
    standardOffices: number;
    openSpaces: number;
    meetingRooms: number;
  };
  commercialProjectMedia?: {
    images: string[];
    virtualTour?: string;
    floorPlans: string[];
    technicalDrawings?: string[];
  };
  officeLayouts?: {
    name: string;
    area: number;
    capacity: string;
    features: string[];
  }[];
  buildingServices?: {
    reception24h: boolean;
    concierge: boolean;
    cleaning: boolean;
    maintenance: boolean;
    security: boolean;
    valet: boolean;
  };
  officeDetails?: {
    totalOffices: number;
    executiveSuites: number;
    standardOffices: number;
    openSpaces: number;
    meetingRooms: number;
  };
  projectMedia?: {
    images: string[];
    virtualTour?: string;
    floorPlans: string[];
    technicalDrawings?: string[];
  };

  // Campos específicos do formulário Lots.tsx (Lotes)
  lotTypes?: {
    name: string;
    minSize: number;
    maxSize: number;
    price: number;
    features: string[];
  }[];
  developmentFeatures?: {
    totalArea: number;
    preservedArea: number;
    streetLighting: boolean;
    pavedStreets: boolean;
    stormDrainage: boolean;
    landscaping: boolean;
    gatedCommunity: boolean;
  };

  // Campos adicionais
  sustainabilityFeatures?: string[];
  securityFeatures?: string[];
  technologyFeatures?: string[];
}