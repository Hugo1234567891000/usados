import { v4 as uuidv4 } from "uuid";

export interface Broker {
  id: string;
  name: string;
  email: string;
  phone: string;
  creci: string;
  cpf: string;
  photo?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  status: 'active' | 'pending' | 'suspended';
  registrationDate: string;
  specialties: string[];
  commissionRates: {
    default: number;
    special?: {
      constructorId: string;
      projectId?: string;
      rate: number;
    }[];
  };
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
    accountType: 'checking' | 'savings';
    accountHolder: string;
    document: string;
  };
  taxInfo: {
    taxId: string;
    taxRegime: 'simple' | 'presumed' | 'real';
    municipalRegistration?: string;
    isExempt: boolean;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    expiryDate?: string;
    status: 'valid' | 'expired' | 'pending';
  }[];
  statistics: {
    totalSales: number;
    totalCommissions: number;
    pendingCommissions: number;
    averageCommissionRate: number;
    salesLastMonth: number;
    commissionsLastMonth: number;
  };
}

// Generate brokers data
export const generateBrokers = (): Broker[] => {
  const brokers: Broker[] = [
    {
      id: 'broker-1',
      name: 'Ana Santos',
      email: 'ana.santos@vhgold.com.br',
      phone: '(11) 98765-4321',
      creci: '123456',
      cpf: '123.456.789-00',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Rua Augusta',
        number: '1000',
        complement: 'Apto 123',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01304-001'
      },
      status: 'active',
      registrationDate: new Date('2020-03-15').toISOString(),
      specialties: ['Apartamentos de Alto Padrão', 'Imóveis na Planta', 'Financiamento'],
      commissionRates: {
        default: 3.0,
        special: [
          { constructorId: 'VHGold-123', rate: 3.5 },
          { constructorId: 'Horizonte-456', projectId: 'proj-4', rate: 4.0 }
        ]
      },
      bankInfo: {
        bank: 'Banco do Brasil',
        agency: '1234-5',
        account: '12345-6',
        accountType: 'checking',
        accountHolder: 'Ana Santos',
        document: '123.456.789-00'
      },
      taxInfo: {
        taxId: '123.456.789-00',
        taxRegime: 'simple',
        municipalRegistration: '1234567',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-ana.pdf',
          uploadDate: new Date('2020-03-15').toISOString(),
          expiryDate: new Date('2025-03-15').toISOString(),
          status: 'valid'
        },
        {
          id: uuidv4(),
          name: 'CPF.pdf',
          type: 'application/pdf',
          url: 'https://example.com/cpf-ana.pdf',
          uploadDate: new Date('2020-03-15').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 25,
        totalCommissions: 750000,
        pendingCommissions: 50000,
        averageCommissionRate: 3.2,
        salesLastMonth: 3,
        commissionsLastMonth: 90000
      }
    },
    {
      id: 'broker-2',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@vhgold.com.br',
      phone: '(11) 97654-3210',
      creci: '234567',
      cpf: '234.567.890-01',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Av. Paulista',
        number: '1500',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310-200'
      },
      status: 'active',
      registrationDate: new Date('2019-06-10').toISOString(),
      specialties: ['Imóveis Comerciais', 'Salas Corporativas', 'Galpões Industriais'],
      commissionRates: {
        default: 2.5
      },
      bankInfo: {
        bank: 'Itaú',
        agency: '2345-6',
        account: '23456-7',
        accountType: 'checking',
        accountHolder: 'Carlos Oliveira',
        document: '234.567.890-01'
      },
      taxInfo: {
        taxId: '234.567.890-01',
        taxRegime: 'presumed',
        municipalRegistration: '2345678',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-carlos.pdf',
          uploadDate: new Date('2019-06-10').toISOString(),
          expiryDate: new Date('2024-06-10').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 18,
        totalCommissions: 520000,
        pendingCommissions: 35000,
        averageCommissionRate: 2.5,
        salesLastMonth: 2,
        commissionsLastMonth: 60000
      }
    },
    {
      id: 'broker-3',
      name: 'Mariana Costa',
      email: 'mariana.costa@vhgold.com.br',
      phone: '(11) 96543-2109',
      creci: '345678',
      cpf: '345.678.901-02',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Rua Oscar Freire',
        number: '500',
        complement: 'Apto 45',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01426-001'
      },
      status: 'active',
      registrationDate: new Date('2021-01-20').toISOString(),
      specialties: ['Apartamentos de Luxo', 'Coberturas', 'Casas de Alto Padrão'],
      commissionRates: {
        default: 3.0,
        special: [
          { constructorId: 'CidadeJardim-789', rate: 3.2 }
        ]
      },
      bankInfo: {
        bank: 'Santander',
        agency: '3456-7',
        account: '34567-8',
        accountType: 'checking',
        accountHolder: 'Mariana Costa',
        document: '345.678.901-02'
      },
      taxInfo: {
        taxId: '345.678.901-02',
        taxRegime: 'simple',
        municipalRegistration: '3456789',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-mariana.pdf',
          uploadDate: new Date('2021-01-20').toISOString(),
          expiryDate: new Date('2026-01-20').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 15,
        totalCommissions: 620000,
        pendingCommissions: 45000,
        averageCommissionRate: 3.1,
        salesLastMonth: 1,
        commissionsLastMonth: 40000
      }
    },
    {
      id: 'broker-4',
      name: 'Paulo Souza',
      email: 'paulo.souza@vhgold.com.br',
      phone: '(11) 95432-1098',
      creci: '456789',
      cpf: '456.789.012-03',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Av. Brigadeiro Faria Lima',
        number: '2000',
        complement: 'Sala 301',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01451-001'
      },
      status: 'active',
      registrationDate: new Date('2018-09-05').toISOString(),
      specialties: ['Lançamentos', 'Investimentos Imobiliários', 'Consultoria'],
      commissionRates: {
        default: 3.5
      },
      bankInfo: {
        bank: 'Bradesco',
        agency: '4567-8',
        account: '45678-9',
        accountType: 'checking',
        accountHolder: 'Paulo Souza',
        document: '456.789.012-03'
      },
      taxInfo: {
        taxId: '456.789.012-03',
        taxRegime: 'real',
        municipalRegistration: '4567890',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-paulo.pdf',
          uploadDate: new Date('2018-09-05').toISOString(),
          expiryDate: new Date('2023-09-05').toISOString(),
          status: 'expired'
        }
      ],
      statistics: {
        totalSales: 32,
        totalCommissions: 980000,
        pendingCommissions: 120000,
        averageCommissionRate: 3.5,
        salesLastMonth: 4,
        commissionsLastMonth: 150000
      }
    },
    {
      id: 'broker-5',
      name: 'Juliana Lima',
      email: 'juliana.lima@vhgold.com.br',
      phone: '(11) 94321-0987',
      creci: '567890',
      cpf: '567.890.123-04',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Rua Pamplona',
        number: '1000',
        complement: 'Apto 87',
        neighborhood: 'Jardim Paulista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01405-001'
      },
      status: 'active',
      registrationDate: new Date('2022-02-15').toISOString(),
      specialties: ['Apartamentos', 'Casas', 'Financiamento Imobiliário'],
      commissionRates: {
        default: 3.0
      },
      bankInfo: {
        bank: 'Caixa Econômica',
        agency: '5678-9',
        account: '56789-0',
        accountType: 'savings',
        accountHolder: 'Juliana Lima',
        document: '567.890.123-04'
      },
      taxInfo: {
        taxId: '567.890.123-04',
        taxRegime: 'simple',
        municipalRegistration: '5678901',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-juliana.pdf',
          uploadDate: new Date('2022-02-15').toISOString(),
          expiryDate: new Date('2027-02-15').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 10,
        totalCommissions: 380000,
        pendingCommissions: 25000,
        averageCommissionRate: 3.0,
        salesLastMonth: 2,
        commissionsLastMonth: 70000
      }
    },
    {
      id: 'broker-6',
      name: 'Roberto Alves',
      email: 'roberto.alves@vhgold.com.br',
      phone: '(11) 93210-9876',
      creci: '678901',
      cpf: '678.901.234-05',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Av. Rebouças',
        number: '1500',
        complement: 'Sala 45',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '05401-200'
      },
      status: 'active',
      registrationDate: new Date('2020-07-10').toISOString(),
      specialties: ['Imóveis Comerciais', 'Salas Corporativas', 'Lajes Corporativas'],
      commissionRates: {
        default: 2.8,
        special: [
          { constructorId: 'CidadeJardim-789', projectId: 'proj-6', rate: 3.0 }
        ]
      },
      bankInfo: {
        bank: 'Banco Inter',
        agency: '0001',
        account: '67890-1',
        accountType: 'checking',
        accountHolder: 'Roberto Alves',
        document: '678.901.234-05'
      },
      taxInfo: {
        taxId: '678.901.234-05',
        taxRegime: 'presumed',
        municipalRegistration: '6789012',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-roberto.pdf',
          uploadDate: new Date('2020-07-10').toISOString(),
          expiryDate: new Date('2025-07-10').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 14,
        totalCommissions: 420000,
        pendingCommissions: 30000,
        averageCommissionRate: 2.9,
        salesLastMonth: 1,
        commissionsLastMonth: 35000
      }
    },
    {
      id: 'broker-7',
      name: 'Fernanda Gomes',
      email: 'fernanda.gomes@vhgold.com.br',
      phone: '(11) 92109-8765',
      creci: '789012',
      cpf: '789.012.345-06',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Rua dos Pinheiros',
        number: '500',
        complement: 'Apto 65',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '05422-001'
      },
      status: 'active',
      registrationDate: new Date('2021-05-20').toISOString(),
      specialties: ['Apartamentos de Luxo', 'Coberturas', 'Imóveis na Planta'],
      commissionRates: {
        default: 3.2
      },
      bankInfo: {
        bank: 'Nubank',
        agency: '0001',
        account: '78901-2',
        accountType: 'checking',
        accountHolder: 'Fernanda Gomes',
        document: '789.012.345-06'
      },
      taxInfo: {
        taxId: '789.012.345-06',
        taxRegime: 'simple',
        municipalRegistration: '7890123',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-fernanda.pdf',
          uploadDate: new Date('2021-05-20').toISOString(),
          expiryDate: new Date('2026-05-20').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 12,
        totalCommissions: 480000,
        pendingCommissions: 40000,
        averageCommissionRate: 3.2,
        salesLastMonth: 2,
        commissionsLastMonth: 80000
      }
    },
    {
      id: 'broker-8',
      name: 'Eduardo Martins',
      email: 'eduardo.martins@vhgold.com.br',
      phone: '(11) 91098-7654',
      creci: '890123',
      cpf: '890.123.456-07',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Rua Joaquim Floriano',
        number: '800',
        complement: 'Sala 123',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '04534-003'
      },
      status: 'active',
      registrationDate: new Date('2019-11-15').toISOString(),
      specialties: ['Imóveis de Alto Padrão', 'Casas', 'Terrenos'],
      commissionRates: {
        default: 3.0,
        special: [
          { constructorId: 'VHGold-123', projectId: 'proj-1', rate: 3.5 }
        ]
      },
      bankInfo: {
        bank: 'Banco Original',
        agency: '0001',
        account: '89012-3',
        accountType: 'checking',
        accountHolder: 'Eduardo Martins',
        document: '890.123.456-07'
      },
      taxInfo: {
        taxId: '890.123.456-07',
        taxRegime: 'simple',
        municipalRegistration: '8901234',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-eduardo.pdf',
          uploadDate: new Date('2019-11-15').toISOString(),
          expiryDate: new Date('2024-11-15').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 20,
        totalCommissions: 650000,
        pendingCommissions: 55000,
        averageCommissionRate: 3.1,
        salesLastMonth: 3,
        commissionsLastMonth: 95000
      }
    },
    {
      id: 'broker-9',
      name: 'Camila Ferreira',
      email: 'camila.ferreira@vhgold.com.br',
      phone: '(11) 90987-6543',
      creci: '901234',
      cpf: '901.234.567-08',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Av. Cidade Jardim',
        number: '400',
        complement: 'Apto 56',
        neighborhood: 'Jardim Europa',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01453-000'
      },
      status: 'active',
      registrationDate: new Date('2022-03-10').toISOString(),
      specialties: ['Apartamentos', 'Lançamentos', 'Financiamento'],
      commissionRates: {
        default: 2.7
      },
      bankInfo: {
        bank: 'C6 Bank',
        agency: '0001',
        account: '90123-4',
        accountType: 'checking',
        accountHolder: 'Camila Ferreira',
        document: '901.234.567-08'
      },
      taxInfo: {
        taxId: '901.234.567-08',
        taxRegime: 'simple',
        municipalRegistration: '9012345',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-camila.pdf',
          uploadDate: new Date('2022-03-10').toISOString(),
          expiryDate: new Date('2027-03-10').toISOString(),
          status: 'valid'
        }
      ],
      statistics: {
        totalSales: 8,
        totalCommissions: 280000,
        pendingCommissions: 20000,
        averageCommissionRate: 2.7,
        salesLastMonth: 1,
        commissionsLastMonth: 35000
      }
    },
    {
      id: 'broker-10',
      name: 'Gustavo Pereira',
      email: 'gustavo.pereira@vhgold.com.br',
      phone: '(11) 90876-5432',
      creci: '012345',
      cpf: '012.345.678-09',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      address: {
        street: 'Rua Bela Cintra',
        number: '1200',
        complement: 'Apto 78',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01415-001'
      },
      status: 'pending',
      registrationDate: new Date('2024-02-25').toISOString(),
      specialties: ['Apartamentos', 'Casas', 'Terrenos'],
      commissionRates: {
        default: 3.3
      },
      bankInfo: {
        bank: 'Itaú',
        agency: '1234-5',
        account: '01234-5',
        accountType: 'checking',
        accountHolder: 'Gustavo Pereira',
        document: '012.345.678-09'
      },
      taxInfo: {
        taxId: '012.345.678-09',
        taxRegime: 'simple',
        municipalRegistration: '0123456',
        isExempt: false
      },
      documents: [
        {
          id: uuidv4(),
          name: 'CRECI.pdf',
          type: 'application/pdf',
          url: 'https://example.com/creci-gustavo.pdf',
          uploadDate: new Date('2024-02-25').toISOString(),
          status: 'pending'
        }
      ],
      statistics: {
        totalSales: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        averageCommissionRate: 3.3,
        salesLastMonth: 0,
        commissionsLastMonth: 0
      }
    }
  ];
  
  return brokers;
};

const brokers = generateBrokers();

export default brokers;