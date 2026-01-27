import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, FileText, Shield, User, Globe, Check, Landmark, Percent, CreditCard } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

interface RegistrationData {
  financialInfo: {
    name: string;
    cnpj: string;
    website: string;
    responsibleName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  financingOptions: {
    minRate: number;
    maxRate: number;
    maxTerm: number;
    minDownPayment: number;
    hasPreApproval: boolean;
    hasFGTS: boolean;
    hasSubsidies: boolean;
  };
  documents: {
    registration: File | null;
    license: File | null;
    proof: File | null;
  };
  termsAccepted: boolean;
}

export default function FinancialRegistration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegistrationData>({
    financialInfo: {
      name: '',
      cnpj: '',
      website: '',
      responsibleName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: ''
    },
    financingOptions: {
      minRate: 6.0,
      maxRate: 12.0,
      maxTerm: 30,
      minDownPayment: 20,
      hasPreApproval: true,
      hasFGTS: true,
      hasSubsidies: true
    },
    documents: {
      registration: null,
      license: null,
      proof: null
    },
    termsAccepted: false
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          data.financialInfo.name.length > 0 &&
          data.financialInfo.cnpj.length === 14 &&
          data.financialInfo.email.length > 0 &&
          data.financialInfo.phone.length > 0
        );
      case 2:
        return true; // All fields have default values
      case 3:
        return data.documents.registration !== null && 
               data.documents.license !== null && 
               data.documents.proof !== null;
      case 4:
        return data.termsAccepted;
      default:
        return false;
    }
  };

  const handleFileUpload = (field: keyof typeof data.documents) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('O arquivo deve ter no máximo 5MB');
        return;
      }

      // Validate file type
      if (!['application/pdf', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('O arquivo deve estar no formato PDF ou JPG');
        return;
      }

      setData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or login
      navigate('/login');
    } catch (err) {
      setError('Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cadastro de Instituição Financeira</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Faça parte da VHGold Imóveis e ofereça financiamento para nossos clientes.
            Seu banco aparecerá nas simulações de financiamento para todos os usuários.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { number: 1, title: 'Informações Básicas' },
              { number: 2, title: 'Opções de Financiamento' },
              { number: 3, title: 'Documentação' },
              { number: 4, title: 'Revisão' }
            ].map(({ number, title }) => (
              <div key={number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {number}
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${
                    currentStep >= number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {title}
                  </p>
                </div>
                {number < 4 && (
                  <div className="w-12 h-1 mx-4 bg-gray-200">
                    <div className={`h-full ${
                      currentStep > number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} onRetry={() => setError(null)} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Dados da Instituição Financeira</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Instituição
                    </label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={data.financialInfo.name}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financialInfo: {
                            ...prev.financialInfo,
                            name: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Nome da instituição financeira"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={formatCNPJ(data.financialInfo.cnpj)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 14) {
                          setData(prev => ({
                            ...prev,
                            financialInfo: {
                              ...prev.financialInfo,
                              cnpj: value
                            }
                          }));
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        value={data.financialInfo.website}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financialInfo: {
                            ...prev.financialInfo,
                            website: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="https://www.exemplo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Responsável
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={data.financialInfo.responsibleName}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financialInfo: {
                            ...prev.financialInfo,
                            responsibleName: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Nome completo"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={data.financialInfo.email}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financialInfo: {
                            ...prev.financialInfo,
                            email: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="contato@exemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={formatPhone(data.financialInfo.phone)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 11) {
                            setData(prev => ({
                              ...prev,
                              financialInfo: {
                                ...prev.financialInfo,
                                phone: value
                              }
                            }));
                          }
                        }}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço Completo
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={data.financialInfo.address}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financialInfo: {
                            ...prev.financialInfo,
                            address: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Rua, número, bairro"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={data.financialInfo.city}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        financialInfo: {
                          ...prev.financialInfo,
                          city: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Cidade"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={data.financialInfo.state}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        financialInfo: {
                          ...prev.financialInfo,
                          state: e.target.value.toUpperCase()
                        }
                      }))}
                      maxLength={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="UF"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financing Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Opções de Financiamento</h2>
                <p className="text-gray-600 mb-6">
                  Informe as condições de financiamento oferecidas pela sua instituição.
                  Estas informações serão exibidas nas simulações para os clientes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa de Juros Mínima (% a.a.)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.financingOptions.minRate}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            minRate: parseFloat(e.target.value)
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa de Juros Máxima (% a.a.)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.financingOptions.maxRate}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            maxRate: parseFloat(e.target.value)
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo Máximo (anos)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={data.financingOptions.maxTerm}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            maxTerm: parseInt(e.target.value)
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entrada Mínima (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={data.financingOptions.minDownPayment}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            minDownPayment: parseInt(e.target.value)
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-md font-medium text-gray-700">Opções Adicionais</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.financingOptions.hasPreApproval}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            hasPreApproval: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Oferece pré-aprovação online</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.financingOptions.hasFGTS}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            hasFGTS: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Aceita FGTS como parte do pagamento</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.financingOptions.hasSubsidies}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          financingOptions: {
                            ...prev.financingOptions,
                            hasSubsidies: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Oferece subsídios para programas habitacionais</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documentation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Documentação</h2>
                <p className="text-gray-600 mb-6">
                  Para garantir a segurança de todos os envolvidos, precisamos de alguns documentos.
                  Todos os arquivos serão verificados por nossa equipe.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registro da Instituição
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload('registration')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Documentação de registro no Banco Central (PDF, JPG)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Licença de Operação
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload('license')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Licença ou autorização de funcionamento (PDF, JPG)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprovante de Regularidade
                    </label>
                    <div className="relative">
                      <Check className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload('proof')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Certidões negativas (PDF, JPG)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Revisão e Confirmação</h2>
                <p className="text-gray-600 mb-6">
                  Revise todas as informações antes de finalizar o cadastro.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Dados da Instituição</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Instituição:</span> {data.financialInfo.name}</p>
                        <p><span className="font-medium">CNPJ:</span> {formatCNPJ(data.financialInfo.cnpj)}</p>
                        <p><span className="font-medium">Website:</span> {data.financialInfo.website}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Contato</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Responsável:</span> {data.financialInfo.responsibleName}</p>
                        <p><span className="font-medium">E-mail:</span> {data.financialInfo.email}</p>
                        <p><span className="font-medium">Telefone:</span> {formatPhone(data.financialInfo.phone)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Endereço</h3>
                    <p className="mt-2">{data.financialInfo.address}, {data.financialInfo.city} - {data.financialInfo.state}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Opções de Financiamento</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Taxa de Juros:</span> {data.financingOptions.minRate}% a {data.financingOptions.maxRate}% a.a.</p>
                      <p><span className="font-medium">Prazo Máximo:</span> {data.financingOptions.maxTerm} anos</p>
                      <p><span className="font-medium">Entrada Mínima:</span> {data.financingOptions.minDownPayment}%</p>
                      <p><span className="font-medium">Pré-Aprovação Online:</span> {data.financingOptions.hasPreApproval ? 'Sim' : 'Não'}</p>
                      <p><span className="font-medium">Aceita FGTS:</span> {data.financingOptions.hasFGTS ? 'Sim' : 'Não'}</p>
                      <p><span className="font-medium">Oferece Subsídios:</span> {data.financingOptions.hasSubsidies ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Documentos Anexados</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{data.documents.registration?.name || 'Nenhum arquivo selecionado'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{data.documents.license?.name || 'Nenhum arquivo selecionado'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-gray-400" />
                        <span>{data.documents.proof?.name || 'Nenhum arquivo selecionado'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={data.termsAccepted}
                        onChange={(e) => setData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        Li e aceito os termos de uso e política de privacidade da VHGold Imóveis.
                        Confirmo que todas as informações fornecidas são verdadeiras e estou ciente
                        das responsabilidades legais.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep(currentStep)}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !validateStep(currentStep)}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Precisa de ajuda? Entre em contato com nosso suporte:</p>
          <p className="font-medium">suporte@vhgold.com.br</p>
        </div>
      </div>
    </div>
  );
}