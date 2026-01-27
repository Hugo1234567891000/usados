import { Property } from '../types/property';

// Define properties array with only the fields that constructors actually fill in their forms
const properties: Property[] = [
  // Apartamento - Based on NewProject.tsx component
  {
    id: 1,
    title: "Residencial Vista Verde",
    price: "R$ 850.000",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    details: `Apartamentos de ${4} dormitórios`,
    description: `Empreendimento de alto padrão com vista privilegiada para o Parque Ibirapuera. Apartamentos espaçosos com acabamento premium, amplas áreas de lazer e localização privilegiada.

O projeto conta com 2 torres de 20 andares cada, totalizando 120 unidades distribuídas em plantas que variam de 65m² a 150m². Cada detalhe foi pensado para criar ambientes que unem funcionalidade e elegância, com pé direito alto de 2,80m e esquadrias piso-teto que garantem iluminação natural abundante.`,
    location: {
      address: "Rua das Flores, 123 - Jardim América, São Paulo",
      lat: -23.5505,
      lng: -46.6333
    },
    area: {
      total: 150,
      built: 120
    },
    rooms: {
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2
    },
    status: "available",
    type: "apartment",
    constructionStatus: "underConstruction",
    code: "VH001",
    transactionType: "sale",
    totalUnits: 120,
    pricePerSqft: 12000,
    developer: "VHGold Incorporadora",
    virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
        title: "Fachada",
        type: "render",
        category: "exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800",
        title: "Piscina",
        type: "render",
        category: "amenity"
      },
      {
        url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=800",
        title: "Living",
        type: "photo",
        category: "interior"
      }
    ],
    selectedAmenities: [
      "pool",
      "gym", 
      "party-room",
      "playground",
      "pet-place",
      "24h-security",
      "elevator",
      "solar-energy"
    ],
    condominiumAmenities: [
      "Piscina adulto e infantil",
      "Academia completa",
      "Salão de festas",
      "Playground",
      "Espaço gourmet",
      "Pet place",
      "Portaria 24h",
      "Sistema de segurança"
    ],
    views: [
      "Vista para o parque",
      "Vista panorâmica da cidade",
      "Vista para área verde"
    ],
    parking: {
      coveredSpaces: 2,
      visitorSpaces: 10,
      electricCarCharging: true,
      bikeRack: true
    },
    architecturalStyle: "Contemporâneo",
    exterior: {
      facade: "Fachada em vidro e concreto",
      landscaping: "Paisagismo assinado",
      lighting: "Iluminação LED externa",
      security: "Cerca elétrica e câmeras"
    },
    interiorFeatures: {
      flooring: "Porcelanato de alta qualidade",
      kitchen: "Cozinha planejada",
      bathrooms: "Acabamento premium",
      airConditioning: "Pré-instalação para ar condicionado",
      lighting: "Iluminação LED",
      storage: "Armários embutidos"
    },
    roomDetails: {
      masterBedroom: {
        size: "15m²",
        features: ["Suíte com closet", "Varanda privativa", "Banheiro com banheira"]
      },
      secondBedroom: {
        size: "12m²", 
        features: ["Armário embutido", "Janela ampla"]
      },
      livingRoom: {
        size: "25m²",
        features: ["Pé direito alto", "Varanda integrada", "Preparação para home theater"]
      },
      kitchen: {
        size: "10m²",
        features: ["Bancada em granito", "Área de serviço integrada", "Despensa"]
      }
    },
    propertyState: "new-construction", // Estado do Imóvel
    propertySituation: "available", // Situação do Imóvel
    sustainabilityFeatures: [
      "Energia solar",
      "Coleta seletiva",
      "Reuso de água da chuva",
      "Iluminação LED",
      "Certificação AQUA"
    ],
    securityFeatures: [
      "Portaria 24h",
      "Sistema de câmeras",
      "Cerca elétrica",
      "Controle de acesso biométrico",
      "Monitoramento remoto"
    ],
    technologyFeatures: [
      "Wi-Fi nas áreas comuns",
      "Automação residencial",
      "Carregadores para carros elétricos",
      "Fibra ótica",
      "Sistema de som ambiente"
    ]
  },

  // Casa - Based on Houses.tsx component
  {
    id: 2,
    title: "Vila Verde - Condomínio Fechado",
    price: "R$ 2.500.000",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
    details: `Casas de Alto Padrão - ${5} dormitórios`,
    description: `Condomínio fechado com casas de luxo em meio à natureza. Projeto sustentável com amplas áreas verdes e privacidade para os moradores. Cada casa possui arquitetura contemporânea com materiais nobres e acabamento de primeira linha.

As residências contam com amplos jardins privativos, piscina individual, área gourmet completa e garagem para 4 carros. O condomínio oferece segurança 24h, clube privativo e extensa área verde preservada.`,
    location: {
      address: "Rua Natingui, 1000 - Alto de Pinheiros, São Paulo",
      lat: -23.5507,
      lng: -46.7107
    },
    area: {
      total: 800,
      built: 450
    },
    rooms: {
      bedrooms: 5,
      bathrooms: 6,
      parkingSpaces: 4
    },
    status: "available",
    type: "house",
    constructionStatus: "ready",
    code: "VH002",
    transactionType: "sale",
    totalUnits: 30,
    pricePerSqft: 5556,
    developer: "VHGold Incorporadora",
    virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
        title: "Fachada da Casa",
        type: "render",
        category: "exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        title: "Área de Lazer",
        type: "render",
        category: "amenity"
      }
    ],
    pricing: {
      startingPrice: 2500000,
      maxPrice: 4500000,
      pricePerSqft: 5556
    },
    propertySituation: "available", // Disponível, sem qualquer restrição
    propertyState: "new-construction", // Nova construção
    interiorFeatures: {
      flooring: "Porcelanato de alta qualidade e madeira maciça",
      kitchen: "Cozinha gourmet planejada com ilha central",
      bathrooms: "Mármore Carrara e metais dourados",
      airConditioning: "Ar condicionado central em todos os ambientes",
      lighting: "Iluminação LED com automação",
      storage: "Closets planejados e despensa"
    },
    exterior: {
      facade: "Concreto aparente e vidro temperado",
      landscaping: "Paisagismo assinado por Roberto Burle Marx",
      lighting: "Iluminação LED externa com sensores",
      security: "Cerca elétrica, câmeras e sensores de movimento"
    },
    ceilingType: "Pé direito duplo na sala e gesso acartonado nos quartos",
    views: [
      "Vista para área verde preservada",
      "Vista panorâmica da cidade",
      "Vista para o clube privativo",
      "Vista para as montanhas"
    ],
    parking: {
      coveredSpaces: 4,
      visitorSpaces: 2,
      electricCarCharging: true,
      bikeRack: true
    },
    architecturalStyle: "Contemporâneo Minimalista",
    roomDetails: {
      masterBedroom: {
        size: "25m²",
        features: ["Suíte master com closet", "Varanda privativa", "Banheiro com banheira de hidromassagem", "Lareira"]
      },
      secondBedroom: {
        size: "18m²",
        features: ["Suíte com closet", "Varanda", "Banheiro privativo"]
      },
      livingRoom: {
        size: "45m²",
        features: ["Pé direito duplo", "Lareira", "Varanda integrada", "Home theater"]
      },
      kitchen: {
        size: "20m²",
        features: ["Ilha central", "Adega climatizada", "Despensa", "Área de café"]
      }
    },
    appliances: [
      "Fogão cooktop de indução",
      "Forno elétrico embutido",
      "Micro-ondas embutido",
      "Geladeira side by side",
      "Lava-louças",
      "Máquina de lavar roupa",
      "Secadora de roupa"
    ],
    coolingType: "Ar condicionado central com controle individual por ambiente",
    heatingType: "Aquecimento central a gás com radiadores",
    heatingFuel: "Gás natural",
    floorCovering: {
      livingAreas: "Porcelanato 80x80cm",
      bedrooms: "Madeira maciça de demolição",
      bathrooms: "Mármore Carrara",
      kitchen: "Porcelanato antiderrapante",
      serviceAreas: "Cerâmica antiderrapante"
    },
    basement: {
      hasBasement: true,
      basementType: "Porão seco com pé direito alto",
      basementArea: 80,
      basementUse: "Adega, sala de jogos e depósito"
    },
    bedroomDetails: {
      totalBedrooms: 5,
      suites: 3,
      masterSuite: true,
      guestRoom: true,
      serviceRoom: true
    },
    selectedAmenities: [
      "pool",
      "gym",
      "party-room",
      "playground",
      "bbq",
      "sports-court",
      "gourmet",
      "pet-place",
      "green-area",
      "24h-security",
      "security-system",
      "elevator",
      "covered-parking",
      "visitor-parking",
      "bike-rack",
      "solar-energy",
      "generator",
      "recycling",
      "wifi",
      "accessibility"
    ],
    houseFeatures: {
      lotSize: 800,
      builtArea: 450,
      floors: 2,
      suites: 3,
      balconies: 2,
      privateGarden: true,
      privatePool: true,
      gourmetArea: true,
      serviceArea: true
    },
    condominiumFeatures: {
      totalHouses: 30,
      preservedArea: 15000,
      clubhouse: true,
      sportsComplex: true,
      walkingTrails: true,
      security24h: true,
      controlledAccess: true
    },
    architecturalDetails: {
      style: "Contemporâneo",
      facade: "Concreto e vidro",
      roofing: "Telha cerâmica",
      landscaping: "Paisagismo assinado",
      sustainability: ["Energia solar", "Reuso de água", "Materiais sustentáveis"]
    },
    detailedFeatures: {
      sustainability: [
        "Energia solar",
        "Reuso de água da chuva",
        "Materiais sustentáveis",
        "Coleta seletiva",
        "Iluminação LED",
        "Paisagismo com plantas nativas"
      ],
      security: [
        "Segurança 24h",
        "Acesso controlado",
        "Câmeras de segurança",
        "Cerca elétrica",
        "Portão eletrônico",
        "Monitoramento remoto"
      ],
      technology: [
        "Wi-Fi nas áreas comuns",
        "Automação residencial",
        "Fibra ótica",
        "Sistema de som ambiente",
        "Carregadores para carros elétricos"
      ]
    },
    condominiumMedia: {
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
      ],
      virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
      floorPlans: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"
      ]
    },
    sustainabilityFeatures: [
      "Energia solar",
      "Reuso de água da chuva", 
      "Materiais sustentáveis",
      "Coleta seletiva",
      "Iluminação LED",
      "Paisagismo com plantas nativas"
    ],
    securityFeatures: [
      "Segurança 24h",
      "Acesso controlado",
      "Câmeras de segurança",
      "Cerca elétrica",
      "Portão eletrônico",
      "Monitoramento remoto"
    ],
    technologyFeatures: [
      "Wi-Fi nas áreas comuns",
      "Automação residencial",
      "Fibra ótica",
      "Sistema de som ambiente",
      "Carregadores para carros elétricos"
    ]
  },

  // Empresarial - Based on Rooms.tsx component
  {
    id: 3,
    title: "Centro Empresarial Paulista",
    price: "R$ 450.000",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    details: `Salas comerciais de ${75}m²`,
    description: `Moderno centro empresarial classe A+ localizado no coração financeiro de São Paulo. Edifício inteligente com 25 pavimentos, oferecendo salas comerciais com infraestrutura completa, tecnologia de ponta e serviços diferenciados para empresas de todos os portes.

O edifício conta com certificação LEED Gold, ar condicionado central VRF, cabeamento estruturado Cat 6A, fibra ótica dedicada e gerador de emergência. Oferece diferentes configurações de salas, desde espaços compactos para startups até amplos conjuntos para grandes empresas. Todas as unidades possuem pé direito de 2,80m, forro de gesso acartonado e vista privilegiada da cidade.`,
    location: {
      address: "Av. Brigadeiro Faria Lima, 2000 - Itaim Bibi, São Paulo",
      lat: -23.5816,
      lng: -46.6834
    },
    area: {
      total: 85,
      built: 75
    },
    rooms: {
      bedrooms: 0, // Commercial doesn't have bedrooms
      bathrooms: 2,
      parkingSpaces: 2
    },
    status: "available",
    type: "commercial",
    constructionStatus: "underConstruction",
    code: "VH003",
    transactionType: "sale",
    totalUnits: 120,
    pricePerSqft: 8500,
    developer: "VHGold Incorporadora",
    virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        title: "Fachada do Edifício",
        type: "render",
        category: "exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        title: "Sala Modelo",
        type: "photo",
        category: "interior"
      }
    ],
    pricing: {
      startingPrice: 450000,
      maxPrice: 1500000,
      pricePerSqft: 8500
    },
    commercialSpecifications: {
      buildingClass: "A+",
      totalFloors: 25,
      unitsPerFloor: 4,
      ceilingHeight: 2.80,
      totalUnits: 120,
      parkingSpaces: 200,
      loadingDocks: 2,
      elevators: 6,
      emergencyStairs: 4
    },
    commercialPropertySituation: "available", // Disponível, sem qualquer restrição
    commercialSpaceConfiguration: {
      openFloorPlan: true,
      privateOffices: true,
      meetingRooms: true,
      receptionArea: true,
      kitchenette: true,
      storageRoom: true,
      serverRoom: true,
      breakRoom: true
    },
    commercialPropertyState: "new-construction", // Nova construção
    commercialInteriorFeatures: {
      flooring: "Porcelanato de alta qualidade e carpete corporativo",
      kitchen: "Copa corporativa com bancada em granito",
      bathrooms: "Acabamento premium com metais cromados",
      airConditioning: "Ar condicionado central VRF com controle individual",
      lighting: "Iluminação LED com automação e sensores",
      storage: "Armários corporativos e arquivos modulares"
    },
    commercialCeilingType: "Forro de gesso acartonado com sistema modular removível",
    commercialViews: [
      "Vista panorâmica da cidade",
      "Vista para o centro financeiro",
      "Vista para área verde urbana",
      "Vista para avenidas principais"
    ],
    commercialParking: {
      coveredSpaces: 200,
      visitorSpaces: 20,
      electricCarCharging: true,
      bikeRack: true,
      loadingDocks: 2
    },
    commercialArchitecturalStyle: "Contemporâneo Corporativo",
    commercialExterior: {
      facade: "Fachada em vidro temperado e alumínio composto",
      landscaping: "Paisagismo corporativo com jardins suspensos",
      lighting: "Iluminação LED externa com destaque arquitetônico",
      security: "Cerca elétrica, câmeras HD e sensores perimetrais"
    },
    commercialInternalFeatures: {
      ceilingHeight: "Pé direito de 2,80m em todos os ambientes",
      floorLoad: "Sobrecarga de 300kg/m² para equipamentos",
      hvacSystem: "Sistema VRF com controle individual por zona",
      electricalSystem: "Cabeamento estruturado Cat 6A e fibra ótica",
      plumbingSystem: "Sistema hidráulico com pressurização",
      fireSystem: "Sistema de sprinklers e detecção de fumaça"
    },
    commercialAppliances: [
      "Micro-ondas corporativo",
      "Geladeira duplex",
      "Máquina de café expresso",
      "Purificador de água",
      "Forno elétrico compacto"
    ],
    commercialCoolingType: "Ar condicionado central VRF com controle individual por sala",
    commercialHeatingType: "Sistema de aquecimento central com radiadores",
    commercialHeatingFuel: "Energia elétrica",
    commercialFloorCovering: {
      officeAreas: "Porcelanato 60x60cm antiderrapante",
      meetingRooms: "Carpete corporativo de alta qualidade",
      bathrooms: "Porcelanato antiderrapante",
      commonAreas: "Mármore Carrara",
      serviceAreas: "Cerâmica industrial antiderrapante"
    },
    commercialBasement: {
      hasBasement: true,
      basementType: "Subsolo técnico com pé direito alto",
      basementArea: 500,
      basementUse: "Estacionamento, depósito e área técnica"
    },
    commercialRoomDetails: {
      totalRooms: 120, // Total de salas
      executiveSuites: 30, // Salas executivas
      standardOffices: 60, // Salas padrão
      openSpaces: 20, // Espaços abertos
      meetingRooms: 10 // Salas de reunião
    },
    commercialProjectMedia: {
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"
      ],
      virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
      floorPlans: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"
      ],
      technicalDrawings: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"
      ]
    },
    selectedAmenities: [
      "pool",
      "gym",
      "party-room",
      "gourmet",
      "24h-security",
      "security-system", 
      "elevator",
      "covered-parking",
      "visitor-parking",
      "bike-rack",
      "solar-energy",
      "generator",
      "wifi",
      "accessibility"
    ],
    detailedFeatures: {
      sustainability: [
        "Energia solar",
        "Certificação LEED Gold",
        "Coleta seletiva",
        "Reuso de água da chuva",
        "Iluminação LED",
        "Sistema de automação predial"
      ],
      security: [
        "Portaria 24h",
        "Sistema de câmeras HD",
        "Controle de acesso biométrico",
        "Cerca elétrica",
        "Monitoramento remoto",
        "Segurança privada"
      ],
      technology: [
        "Wi-Fi nas áreas comuns",
        "Fibra ótica dedicada",
        "Cabeamento estruturado Cat 6A",
        "Sistema de automação predial",
        "Carregadores para carros elétricos",
        "Sistema de som ambiente"
      ]
    },
    sustainabilityFeatures: [
      "Energia solar",
      "Certificação LEED Gold",
      "Coleta seletiva",
      "Reuso de água da chuva",
      "Iluminação LED",
      "Sistema de automação predial"
    ],
    securityFeatures: [
      "Portaria 24h",
      "Sistema de câmeras HD",
      "Controle de acesso biométrico",
      "Cerca elétrica",
      "Monitoramento remoto",
      "Segurança privada"
    ],
    technologyFeatures: [
      "Wi-Fi nas áreas comuns",
      "Fibra ótica dedicada",
      "Cabeamento estruturado Cat 6A",
      "Sistema de automação predial",
      "Carregadores para carros elétricos",
      "Sistema de som ambiente"
    ]
  },

  // Lote - Based on Lots.tsx component
  {
    id: 4,
    title: "Residencial Campos Verdes",
    price: "R$ 180.000",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    details: `Lotes de 300m² a 800m²`,
    description: `Loteamento residencial em área nobre com infraestrutura completa e pronto para construir. Localizado em região de alto crescimento, oferece tranquilidade e qualidade de vida para sua família.

Todos os lotes possuem escritura registrada, infraestrutura de água, luz e esgoto instalada. O loteamento conta com ruas asfaltadas, iluminação pública e paisagismo completo. Ideal para construção de residências de alto padrão.`,
    location: {
      address: "Estrada Municipal, KM 15 - Zona Rural, Cotia",
      lat: -23.6204,
      lng: -46.9188
    },
    area: {
      total: 600,
      built: 0 // Lots don't have built area
    },
    rooms: {
      bedrooms: 0, // Lots don't have rooms
      bathrooms: 0,
      parkingSpaces: 0
    },
    status: "available",
    type: "land",
    constructionStatus: "ready",
    code: "VH004",
    transactionType: "sale",
    pricePerSqft: 300,
    propertyState: "ready-to-build",
    propertySituation: "available",
    developer: "VHGold Incorporadora",
    virtualTour: "https://my.matterport.com/show/?m=ZGucwQyQdRL",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
        title: "Vista Geral do Loteamento",
        type: "photo",
        category: "exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
        title: "Área Verde",
        type: "photo",
        category: "amenity"
      }
    ],
    selectedAmenities: [
      "24h-security",
      "green-area",
      "playground", 
      "sports-court",
      "accessibility"
    ],
    lotFeatures: {
      minLotSize: 300,
      maxLotSize: 800,
      hasWater: true,
      hasElectricity: true,
      hasSewage: true,
      hasAsphalt: true,
      allowsConstruction: true,
      maxBuildingHeight: 2,
      setbackRequirements: {
        front: 5,
        side: 3,
        back: 3
      }
    },
    lotTypes: [
      {
        name: "Lote Padrão",
        minSize: 300,
        maxSize: 500,
        price: 180000,
        features: ["Esquina disponível", "Vista para área verde"]
      },
      {
        name: "Lote Premium",
        minSize: 600,
        maxSize: 800,
        price: 280000,
        features: ["Lote de esquina", "Vista privilegiada", "Próximo à área de lazer"]
      }
    ],
    developmentFeatures: {
      totalArea: 50000,
      preservedArea: 15000,
      streetLighting: true,
      pavedStreets: true,
      stormDrainage: true,
      landscaping: true,
      gatedCommunity: true
    },
    sustainabilityFeatures: [
      "Energia solar",
      "Coleta seletiva",
      "Área verde preservada"
    ],
    securityFeatures: [
      "Segurança 24h",
      "Sistema de segurança"
    ],
    technologyFeatures: [
      "Wi-Fi nas áreas comuns",
      "Acessibilidade"
    ]
  },
  // Apartamento com Tour Virtual 3D - Exemplo Demo
  {
    id: 999,
    title: "Residencial Vista Mar Premium",
    price: "R$ 1.250.000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    details: "Apartamento de alto padrão com vista para o mar",
    description: "Apartamento de alto padrão com vista panorâmica para o mar. Acabamento de primeira linha, com pé direito de 3 metros, janelas do piso ao teto e ampla varanda gourmet. Localizado em um dos bairros mais nobres da cidade.",
    location: {
      address: "Avenida Beira Mar, 2500 - Praia do Forte, Florianópolis",
      lat: -27.5935,
      lng: -48.5501
    },
    area: {
      total: 185,
      built: 165
    },
    rooms: {
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 3
    },
    status: "available",
    type: "apartment",
    constructionStatus: "ready",
    code: "PROP-DEMO-001",
    transactionType: "sale",
    totalUnits: 1,
    pricePerSqft: 6756,
    developer: "VHGold Incorporadora",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
        title: "Sala de Estar",
        type: "photo",
        category: "interior"
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
        title: "Cozinha Gourmet",
        type: "photo",
        category: "interior"
      },
      {
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200",
        title: "Suíte Master",
        type: "photo",
        category: "interior"
      },
      {
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
        title: "Varanda",
        type: "photo",
        category: "exterior"
      }
    ],
    amenities: [
      "Piscina",
      "Academia",
      "Sauna",
      "Salão de Festas",
      "Churrasqueira",
      "Playground",
      "Quadra de Tênis",
      "Segurança 24h",
      "Portaria"
    ],
    condominiumAmenities: [
      "Piscina adulto e infantil",
      "Academia completa",
      "Sauna seca e úmida",
      "Salão de festas",
      "Espaço gourmet",
      "Playground",
      "Quadra poliesportiva",
      "Quadra de tênis",
      "Segurança 24h",
      "Portaria eletrônica"
    ],
    views: [
      "Vista para o mar",
      "Vista panorâmica",
      "Nascer do sol"
    ],
    parking: {
      coveredSpaces: 3,
      visitorSpaces: 20,
      electricCarCharging: true,
      bikeRack: true
    },
    interiorFeatures: {
      flooring: "Porcelanato de alta qualidade",
      kitchen: "Cozinha gourmet integrada com ilha",
      bathrooms: "Mármore e metais importados",
      airConditioning: "Ar condicionado split em todos os ambientes"
    },
    roomDetails: {
      masterBedroom: {
        size: "25m²",
        features: [
          "Closet amplo",
          "Banheiro privativo com banheira",
          "Varanda privativa com vista mar",
          "Ar condicionado"
        ]
      },
      livingRoom: {
        size: "45m²",
        features: [
          "Pé direito de 3 metros",
          "Janelas do piso ao teto",
          "Integração com varanda gourmet",
          "Vista panorâmica para o mar"
        ]
      },
      kitchen: {
        size: "20m²",
        features: [
          "Ilha central",
          "Armários planejados",
          "Eletrodomésticos de alta linha",
          "Despensa"
        ]
      }
    }
  }
];

export default properties;