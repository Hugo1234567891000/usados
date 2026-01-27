import { v4 as uuidv4 } from "uuid";
import { RealEstateProject } from "../types/property";

// Generate 10 real estate projects for testing
export const generateProjects = (): RealEstateProject[] => {
  const projects: RealEstateProject[] = [
    {
      id: 'proj-1',
      code: 'VH001',
      name: 'Residencial Vista Verde',
      status: 'underConstruction',
      transactionType: 'sale',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Jardim América',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01000-000',
        coordinates: {
          latitude: -23.5505,
          longitude: -46.6333
        }
      },
      description: 'Empreendimento de alto padrão com vista privilegiada para o Parque Ibirapuera. Apartamentos espaçosos com acabamento premium, amplas áreas de lazer e localização privilegiada.',
      completionDate: '2025-12',
      totalUnits: 120,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'party-room', name: 'Salão de festas', category: 'leisure' },
        { id: 'playground', name: 'Playground', category: 'leisure' },
        { id: 'bbq', name: 'Churrasqueira', category: 'leisure' },
        { id: '24h-security', name: 'Portaria 24h', category: 'infrastructure' },
        { id: 'security-system', name: 'Sistema de segurança', category: 'infrastructure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água'],
        security: ['Portaria 24h', 'Câmeras de segurança', 'Cerca elétrica'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial']
      },
      pricing: {
        startingPrice: 850000,
        maxPrice: 1500000,
        pricePerSqft: 12000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 20,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-01-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z',
        version: 1
      },
      constructorId: 'VHGold-123'
    },
    {
      id: 'proj-2',
      code: 'VH002',
      name: 'Edifício Horizonte',
      status: 'preLaunch',
      transactionType: 'sale',
      address: {
        street: 'Alameda Santos',
        number: '500',
        neighborhood: 'Cerqueira César',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01419-000',
        coordinates: {
          latitude: -23.5695,
          longitude: -46.6523
        }
      },
      description: 'Empreendimento de luxo no coração de São Paulo, com apartamentos de alto padrão, design contemporâneo e tecnologia de ponta. Localização privilegiada próxima às principais avenidas da cidade.',
      completionDate: '2026-06',
      totalUnits: 80,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'spa', name: 'Spa', category: 'leisure' },
        { id: 'gourmet', name: 'Espaço gourmet', category: 'leisure' },
        { id: 'coworking', name: 'Coworking', category: 'leisure' },
        { id: 'elevator', name: 'Elevador', category: 'infrastructure' },
        { id: 'solar-energy', name: 'Energia solar', category: 'sustainability' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Iluminação LED'],
        security: ['Portaria 24h', 'Biometria', 'Monitoramento remoto'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Carregadores para carros elétricos']
      },
      pricing: {
        startingPrice: 1200000,
        maxPrice: 2500000,
        pricePerSqft: 15000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 25,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-06-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z',
        version: 1
      },
      constructorId: 'VHGold-123'
    },
    {
      id: 'proj-3',
      code: 'VH003',
      name: 'Parque das Flores',
      status: 'completed',
      transactionType: 'sale',
      address: {
        street: 'Avenida Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310-100',
        coordinates: {
          latitude: -23.5630,
          longitude: -46.6543
        }
      },
      description: 'Empreendimento entregue com todas as unidades vendidas. Localizado na icônica Avenida Paulista, oferece conforto, segurança e praticidade para seus moradores.',
      completionDate: '2023-10',
      totalUnits: 60,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'party-room', name: 'Salão de festas', category: 'leisure' },
        { id: 'green-area', name: 'Área verde', category: 'leisure' },
        { id: 'elevator', name: 'Elevador', category: 'infrastructure' },
        { id: 'covered-parking', name: 'Vagas de garagem cobertas', category: 'infrastructure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Coleta seletiva', 'Iluminação LED'],
        security: ['Portaria 24h', 'Câmeras de segurança'],
        technology: ['Wi-Fi nas áreas comuns']
      },
      pricing: {
        startingPrice: 950000,
        maxPrice: 1800000,
        pricePerSqft: 13000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 20,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2022-01-10T10:00:00Z',
        updatedAt: '2023-10-15T10:00:00Z',
        version: 1
      },
      constructorId: 'VHGold-123'
    },
    {
      id: 'proj-4',
      code: 'VH004',
      name: 'Vila Nova',
      status: 'underConstruction',
      transactionType: 'sale',
      address: {
        street: 'Rua Oscar Freire',
        number: '300',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01426-000',
        coordinates: {
          latitude: -23.5616,
          longitude: -46.6693
        }
      },
      description: 'Empreendimento exclusivo em localização privilegiada nos Jardins. Apartamentos com design contemporâneo, amplos espaços e acabamento de primeira linha.',
      completionDate: '2025-08',
      totalUnits: 40,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'spa', name: 'Spa', category: 'leisure' },
        { id: 'gourmet', name: 'Espaço gourmet', category: 'leisure' },
        { id: 'pet-place', name: 'Pet place', category: 'leisure' },
        { id: 'elevator', name: 'Elevador', category: 'infrastructure' },
        { id: 'bike-rack', name: 'Bicicletário', category: 'infrastructure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água'],
        security: ['Portaria 24h', 'Biometria', 'Cerca elétrica'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Carregadores para carros elétricos']
      },
      pricing: {
        startingPrice: 1500000,
        maxPrice: 3000000,
        pricePerSqft: 18000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 30,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-08-20T10:00:00Z',
        updatedAt: '2024-02-20T10:00:00Z',
        version: 1
      },
      constructorId: 'Horizonte-456'
    },
    {
      id: 'proj-5',
      code: 'VH005',
      name: 'Palazzo Verona',
      status: 'underConstruction',
      transactionType: 'sale',
      address: {
        street: 'Rua Groenlândia',
        number: '250',
        neighborhood: 'Jardim Europa',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01434-000',
        coordinates: {
          latitude: -23.5816,
          longitude: -46.6834
        }
      },
      description: 'Localizado no coração do Jardim Europa, o Palazzo Verona é um empreendimento que redefine o conceito de moradia de alto padrão. Com arquitetura contemporânea e acabamento premium, oferece apartamentos amplos e sofisticados.',
      completionDate: '2026-12',
      totalUnits: 160,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'spa', name: 'Spa', category: 'leisure' },
        { id: 'sports-court', name: 'Quadra poliesportiva', category: 'leisure' },
        { id: 'party-room', name: 'Salão de festas', category: 'leisure' },
        { id: 'playground', name: 'Playground', category: 'leisure' },
        { id: 'coworking', name: 'Coworking', category: 'leisure' },
        { id: 'pet-place', name: 'Pet place', category: 'leisure' },
        { id: 'green-area', name: 'Área verde', category: 'leisure' },
        { id: 'cinema', name: 'Cinema', category: 'leisure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água', 'Iluminação LED'],
        security: ['Portaria 24h', 'Biometria', 'Cerca elétrica', 'Monitoramento remoto'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Carregadores para carros elétricos']
      },
      pricing: {
        startingPrice: 1150000,
        maxPrice: 2200000,
        pricePerSqft: 12000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 20,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-12-15T10:00:00Z',
        updatedAt: '2024-03-10T10:00:00Z',
        version: 1
      },
      constructorId: 'Horizonte-456'
    },
    {
      id: 'proj-6',
      code: 'VH006',
      name: 'Infinity Tower',
      status: 'underConstruction',
      transactionType: 'sale',
      address: {
        street: 'Rua Joaquim Nabuco',
        number: '780',
        neighborhood: 'Brooklin',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '04621-002',
        coordinates: {
          latitude: -23.6207,
          longitude: -46.6889
        }
      },
      description: 'Torre comercial e residencial com vista privilegiada para a cidade. Projeto arquitetônico inovador, com fachada em vidro e estrutura moderna.',
      completionDate: '2026-07',
      totalUnits: 200,
      amenities: [
        { id: 'pool', name: 'Piscina infinity', category: 'leisure' },
        { id: 'gym', name: 'Academia premium', category: 'leisure' },
        { id: 'spa', name: 'Spa', category: 'leisure' },
        { id: 'restaurant', name: 'Restaurante', category: 'leisure' },
        { id: 'coworking', name: 'Coworking', category: 'leisure' },
        { id: 'concierge', name: 'Concierge 24h', category: 'infrastructure' },
        { id: 'helipad', name: 'Heliponto', category: 'infrastructure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água', 'Certificação LEED'],
        security: ['Portaria 24h', 'Biometria', 'Monitoramento remoto', 'Segurança privada'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Smart building']
      },
      pricing: {
        startingPrice: 1200000,
        maxPrice: 5000000,
        pricePerSqft: 15000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 30,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-07-10T10:00:00Z',
        updatedAt: '2024-02-15T10:00:00Z',
        version: 1
      },
      constructorId: 'CidadeJardim-789'
    },
    {
      id: 'proj-7',
      code: 'VH007',
      name: 'Parque Cidade Jardim',
      status: 'underConstruction',
      transactionType: 'sale',
      address: {
        street: 'Rua Cidade Jardim',
        number: '500',
        neighborhood: 'Morumbi',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '05675-010',
        coordinates: {
          latitude: -23.5907,
          longitude: -46.7007
        }
      },
      description: 'Complexo residencial com infraestrutura completa e vista para o Parque do Povo. Apartamentos de alto padrão com amplas varandas e acabamento premium.',
      completionDate: '2026-03',
      totalUnits: 150,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'spa', name: 'Spa', category: 'leisure' },
        { id: 'sports-court', name: 'Quadra poliesportiva', category: 'leisure' },
        { id: 'playground', name: 'Brinquedoteca', category: 'leisure' },
        { id: 'pet-place', name: 'Pet place', category: 'leisure' },
        { id: 'party-room', name: 'Salão de festas', category: 'leisure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água'],
        security: ['Portaria 24h', 'Câmeras de segurança', 'Cerca elétrica'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial']
      },
      pricing: {
        startingPrice: 1800000,
        maxPrice: 3500000,
        pricePerSqft: 14000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 25,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-03-15T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        version: 1
      },
      constructorId: 'CidadeJardim-789'
    },
    {
      id: 'proj-8',
      code: 'VH008',
      name: 'Residencial Jardins',
      status: 'preLaunch',
      transactionType: 'rent',
      address: {
        street: 'Rua dos Pinheiros',
        number: '1500',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '05422-001',
        coordinates: {
          latitude: -23.5667,
          longitude: -46.6907
        }
      },
      description: 'Luxuoso empreendimento em Pinheiros com vista panorâmica e acabamento premium. Projeto arquitetônico assinado por renomado escritório internacional.',
      completionDate: '2027-03',
      totalUnits: 90,
      amenities: [
        { id: 'pool', name: 'Piscina aquecida', category: 'leisure' },
        { id: 'gym', name: 'Academia completa', category: 'leisure' },
        { id: 'spa', name: 'Spa', category: 'leisure' },
        { id: 'sports-court', name: 'Quadra poliesportiva', category: 'leisure' },
        { id: 'gourmet', name: 'Salão gourmet', category: 'leisure' },
        { id: 'playground', name: 'Brinquedoteca', category: 'leisure' },
        { id: 'coworking', name: 'Coworking', category: 'leisure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água', 'Certificação AQUA'],
        security: ['Portaria 24h', 'Biometria', 'Cerca elétrica', 'Monitoramento remoto'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Carregadores para carros elétricos']
      },
      pricing: {
        startingPrice: 890000,
        maxPrice: 1800000,
        pricePerSqft: 13000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 20,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-03-01T10:00:00Z',
        version: 1
      },
      constructorId: 'VHGold-123'
    },
    {
      id: 'proj-9',
      code: 'VH009',
      name: 'Vila Verde - Alto de Pinheiros',
      status: 'underConstruction',
      transactionType: 'sale',
      address: {
        street: 'Rua Natingui',
        number: '1000',
        neighborhood: 'Alto de Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '05422-002',
        coordinates: {
          latitude: -23.5507,
          longitude: -46.7107
        }
      },
      description: 'Condomínio fechado com casas de luxo em meio à natureza. Projeto sustentável com amplas áreas verdes e privacidade para os moradores.',
      completionDate: '2025-12',
      totalUnits: 30,
      amenities: [
        { id: '24h-security', name: 'Segurança 24h', category: 'infrastructure' },
        { id: 'green-area', name: 'Área verde preservada', category: 'leisure' },
        { id: 'club', name: 'Clube privativo', category: 'leisure' },
        { id: 'sports-court', name: 'Quadra de tênis', category: 'leisure' },
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'playground', name: 'Playground', category: 'leisure' },
        { id: 'walking-area', name: 'Área de caminhada', category: 'leisure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Reuso de água', 'Preservação ambiental'],
        security: ['Segurança 24h', 'Câmeras de segurança', 'Cerca elétrica', 'Controle de acesso'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Fibra ótica']
      },
      pricing: {
        startingPrice: 2500000,
        maxPrice: 4500000,
        pricePerSqft: 10000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 30,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2023-06-10T10:00:00Z',
        updatedAt: '2024-02-10T10:00:00Z',
        version: 1
      },
      constructorId: 'VHGold-123'
    },
    {
      id: 'proj-10',
      code: 'VH010',
      name: 'Edifício Lumina',
      status: 'preLaunch',
      transactionType: 'sale',
      address: {
        street: 'Rua Haddock Lobo',
        number: '595',
        neighborhood: 'Cerqueira César',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01414-001',
        coordinates: {
          latitude: -23.5580,
          longitude: -46.6620
        }
      },
      description: 'Edifício residencial com conceito de iluminação natural e espaços integrados. Projeto inovador com foco em bem-estar e qualidade de vida.',
      completionDate: '2027-06',
      totalUnits: 70,
      amenities: [
        { id: 'pool', name: 'Piscina', category: 'leisure' },
        { id: 'gym', name: 'Academia', category: 'leisure' },
        { id: 'yoga', name: 'Sala de yoga', category: 'leisure' },
        { id: 'coworking', name: 'Coworking', category: 'leisure' },
        { id: 'gourmet', name: 'Espaço gourmet', category: 'leisure' },
        { id: 'garden', name: 'Jardim zen', category: 'leisure' },
        { id: 'bike-rack', name: 'Bicicletário', category: 'infrastructure' }
      ],
      units: [],
      media: [],
      features: {
        sustainability: ['Energia solar', 'Coleta seletiva', 'Iluminação natural', 'Ventilação cruzada'],
        security: ['Portaria 24h', 'Biometria', 'Câmeras de segurança'],
        technology: ['Wi-Fi nas áreas comuns', 'Automação residencial', 'Iluminação inteligente']
      },
      pricing: {
        startingPrice: 980000,
        maxPrice: 1800000,
        pricePerSqft: 14000
      },
      paymentOptions: {
        acceptsFinancing: true,
        minDownPayment: 25,
        maxInstallments: 180
      },
      metadata: {
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z',
        version: 1
      },
      constructorId: 'Horizonte-456'
    }
  ];
  
  return projects;
};

const projects = generateProjects();

export default projects;