import { v4 as uuidv4 } from "uuid";

export interface Constructor {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  logo?: string;
  website?: string;
  status: 'active' | 'pending' | 'suspended';
  registrationDate: string;
  projects: string[];
  commissionRates: {
    default: number;
    special?: {
      projectId?: string;
      brokerId?: string;
      rate: number;
    }[];
  };
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
    accountType: 'checking' | 'savings';
  };
  contacts: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    expiryDate?: string;
    status: 'valid' | 'expired' | 'pending';
  }[];
}

// Generate constructors data
export const generateConstructors = (): Constructor[] => {
  const constructors: Constructor[] = [
    {
      id: 'VHGold-123',
      name: 'VHGold Construtora',
      cnpj: '12.345.678/0001-90',
      email: 'contato@vhgold.com.br',
      phone: '(11) 3456-7890',
      address: 'Av. Paulista, 1000, 10º andar',
      city: 'São Paulo',
      state: 'SP',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
      website: 'https://www.vhgold.com.br',
      status: 'active',
      registrationDate: new Date('2020-01-15').toISOString(),
      projects: ['proj-1', 'proj-2', 'proj-3', 'proj-8', 'proj-9'],
      commissionRates: {
        default: 3.0,
        special: [
          { projectId: 'proj-1', rate: 3.5 },
          { projectId: 'proj-3', rate: 2.8 },
          { brokerId: 'broker-1', rate: 3.5 }
        ]
      },
      bankInfo: {
        bank: 'Banco do Brasil',
        agency: '1234-5',
        account: '12345-6',
        accountType: 'checking'
      },
      contacts: [
        {
          id: uuidv4(),
          name: 'João Silva',
          role: 'Diretor Comercial',
          email: 'joao.silva@vhgold.com.br',
          phone: '(11) 98765-4321',
          isPrimary: true
        },
        {
          id: uuidv4(),
          name: 'Maria Santos',
          role: 'Gerente Financeiro',
          email: 'maria.santos@vhgold.com.br',
          phone: '(11) 91234-5678',
          isPrimary: false
        }
      ],
      documents: [
        {
          id: uuidv4(),
          name: 'Contrato Social',
          type: 'application/pdf',
          url: 'https://example.com/contrato-social.pdf',
          uploadDate: new Date('2020-01-15').toISOString(),
          status: 'valid'
        },
        {
          id: uuidv4(),
          name: 'Certidão Negativa de Débitos',
          type: 'application/pdf',
          url: 'https://example.com/certidao.pdf',
          uploadDate: new Date('2023-10-15').toISOString(),
          expiryDate: new Date('2024-10-15').toISOString(),
          status: 'valid'
        }
      ]
    },
    {
      id: 'Horizonte-456',
      name: 'Construtora Horizonte',
      cnpj: '98.765.432/0001-10',
      email: 'contato@horizonteconstrutora.com.br',
      phone: '(11) 2345-6789',
      address: 'Rua Augusta, 500, 5º andar',
      city: 'São Paulo',
      state: 'SP',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
      website: 'https://www.horizonteconstrutora.com.br',
      status: 'active',
      registrationDate: new Date('2019-05-20').toISOString(),
      projects: ['proj-4', 'proj-5', 'proj-10'],
      commissionRates: {
        default: 2.5,
        special: [
          { brokerId: 'broker-4', rate: 3.0 }
        ]
      },
      bankInfo: {
        bank: 'Itaú',
        agency: '5678-9',
        account: '98765-4',
        accountType: 'checking'
      },
      contacts: [
        {
          id: uuidv4(),
          name: 'Carlos Oliveira',
          role: 'Diretor Geral',
          email: 'carlos.oliveira@horizonte.com.br',
          phone: '(11) 97654-3210',
          isPrimary: true
        }
      ],
      documents: [
        {
          id: uuidv4(),
          name: 'Contrato Social',
          type: 'application/pdf',
          url: 'https://example.com/contrato-social-horizonte.pdf',
          uploadDate: new Date('2019-05-20').toISOString(),
          status: 'valid'
        }
      ]
    },
    {
      id: 'CidadeJardim-789',
      name: 'Incorporadora Cidade Jardim',
      cnpj: '45.678.901/0001-23',
      email: 'contato@cidadejardim.com.br',
      phone: '(11) 3456-7891',
      address: 'Av. Brigadeiro Faria Lima, 2000, 15º andar',
      city: 'São Paulo',
      state: 'SP',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
      website: 'https://www.cidadejardim.com.br',
      status: 'active',
      registrationDate: new Date('2018-08-10').toISOString(),
      projects: ['proj-6', 'proj-7'],
      commissionRates: {
        default: 3.0,
        special: [
          { projectId: 'proj-7', rate: 3.5 },
          { brokerId: 'broker-7', rate: 3.2 }
        ]
      },
      bankInfo: {
        bank: 'Santander',
        agency: '1357-9',
        account: '13579-0',
        accountType: 'checking'
      },
      contacts: [
        {
          id: uuidv4(),
          name: 'Ana Pereira',
          role: 'Diretora Comercial',
          email: 'ana.pereira@cidadejardim.com.br',
          phone: '(11) 96543-2109',
          isPrimary: true
        },
        {
          id: uuidv4(),
          name: 'Roberto Alves',
          role: 'Gerente de Vendas',
          email: 'roberto.alves@cidadejardim.com.br',
          phone: '(11) 95432-1098',
          isPrimary: false
        }
      ],
      documents: [
        {
          id: uuidv4(),
          name: 'Contrato Social',
          type: 'application/pdf',
          url: 'https://example.com/contrato-social-cidadejardim.pdf',
          uploadDate: new Date('2018-08-10').toISOString(),
          status: 'valid'
        },
        {
          id: uuidv4(),
          name: 'Certidão Negativa de Débitos',
          type: 'application/pdf',
          url: 'https://example.com/certidao-cidadejardim.pdf',
          uploadDate: new Date('2023-11-20').toISOString(),
          expiryDate: new Date('2024-11-20').toISOString(),
          status: 'valid'
        }
      ]
    },
    {
      id: 'NovaEra-101',
      name: 'Construtora Nova Era',
      cnpj: '56.789.012/0001-34',
      email: 'contato@novaera.com.br',
      phone: '(11) 4567-8901',
      address: 'Rua Haddock Lobo, 300, 8º andar',
      city: 'São Paulo',
      state: 'SP',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
      website: 'https://www.novaera.com.br',
      status: 'pending',
      registrationDate: new Date('2024-03-01').toISOString(),
      projects: [],
      commissionRates: {
        default: 2.8
      },
      bankInfo: {
        bank: 'Bradesco',
        agency: '2468-0',
        account: '24680-1',
        accountType: 'checking'
      },
      contacts: [
        {
          id: uuidv4(),
          name: 'Fernanda Gomes',
          role: 'CEO',
          email: 'fernanda.gomes@novaera.com.br',
          phone: '(11) 94321-0987',
          isPrimary: true
        }
      ],
      documents: [
        {
          id: uuidv4(),
          name: 'Contrato Social',
          type: 'application/pdf',
          url: 'https://example.com/contrato-social-novaera.pdf',
          uploadDate: new Date('2024-03-01').toISOString(),
          status: 'pending'
        }
      ]
    },
    {
      id: 'Visao-202',
      name: 'Incorporadora Visão',
      cnpj: '67.890.123/0001-45',
      email: 'contato@visao.com.br',
      phone: '(11) 5678-9012',
      address: 'Av. Rebouças, 1500, 12º andar',
      city: 'São Paulo',
      state: 'SP',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
      website: 'https://www.visao.com.br',
      status: 'suspended',
      registrationDate: new Date('2021-06-15').toISOString(),
      projects: [],
      commissionRates: {
        default: 3.2
      },
      bankInfo: {
        bank: 'Caixa Econômica',
        agency: '3579-1',
        account: '35791-2',
        accountType: 'checking'
      },
      contacts: [
        {
          id: uuidv4(),
          name: 'Eduardo Martins',
          role: 'Diretor',
          email: 'eduardo.martins@visao.com.br',
          phone: '(11) 93210-9876',
          isPrimary: true
        }
      ],
      documents: [
        {
          id: uuidv4(),
          name: 'Contrato Social',
          type: 'application/pdf',
          url: 'https://example.com/contrato-social-visao.pdf',
          uploadDate: new Date('2021-06-15').toISOString(),
          status: 'valid'
        },
        {
          id: uuidv4(),
          name: 'Certidão Negativa de Débitos',
          type: 'application/pdf',
          url: 'https://example.com/certidao-visao.pdf',
          uploadDate: new Date('2023-05-10').toISOString(),
          expiryDate: new Date('2024-05-10').toISOString(),
          status: 'expired'
        }
      ]
    }
  ];
  
  return constructors;
};

const constructors = generateConstructors();

export default constructors;