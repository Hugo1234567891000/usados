import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, FileText, Shield, User, CreditCard, Calendar, Lock, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

interface RegistrationData {
  personalInfo: {
    fullName: string;
    creci: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  documents: {
    creceDocument: File | null;
    identificationDocument: File | null;
    proofOfAddress: File | null;
  };
  subscription: {
    plan: 'monthly' | 'quarterly' | 'annual';
    paymentMethod: {
      cardNumber: string;
      cardName: string;
      expiryDate: string;
      cvv: string;
    };
    acceptTerms: boolean;
  };
}

interface SubscriptionPlan {
  id: 'monthly' | 'quarterly' | 'annual';
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  billingCycle: string;
  features: string[];
  recommended?: boolean;
}

export default function BrokerRegistration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegistrationData>({
    personalInfo: {
      fullName: '',
      creci: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: ''
    },
    documents: {
      creceDocument: null,
      identificationDocument: null,
      proofOfAddress: null
    },
    subscription: {
      plan: 'monthly',
      paymentMethod: {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      },
      acceptTerms: false
    }
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      title: 'Mensal',
      price: 99.90,
      billingCycle: 'por mês',
      features: [
        'Acesso a todas as funcionalidades',
        'Listagem de imóveis ilimitada',
        'Suporte por e-mail',
        'Notificações de clientes interessados'
      ]
    },
    {
      id: 'quarterly',
      title: 'Trimestral',
      price: 269.70,
      originalPrice: 299.70,
      discount: 10,
      billingCycle: 'a cada 3 meses',
      features: [
        'Todos os benefícios do plano Mensal',
        'Economia de 10%',
        'Destaque nos resultados de busca',
        'Suporte prioritário'
      ],
      recommended: true
    },
    {
      id: 'annual',
      title: 'Anual',
      price: 958.80,
      originalPrice: 1198.80,
      discount: 20,
      billingCycle: 'por ano',
      features: [
        'Todos os benefícios do plano Trimestral',
        'Economia de 20%',
        'Relatórios avançados',
        'Suporte VIP por telefone',
        'Acesso antecipado a novos recursos'
      ]
    }
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          data.personalInfo.fullName.length > 0 &&
          data.personalInfo.creci.length > 0 &&
          data.personalInfo.email.length > 0 &&
          data.personalInfo.phone.length > 0
        );
      case 2:
        return data.documents.creceDocument !== null && 
               data.documents.identificationDocument !== null && 
               data.documents.proofOfAddress !== null;
      case 3:
        return data.subscription.plan !== undefined &&
               data.subscription.paymentMethod.cardNumber.length > 0 &&
               data.subscription.paymentMethod.cardName.length > 0 &&
               data.subscription.paymentMethod.expiryDate.length > 0 &&
               data.subscription.paymentMethod.cvv.length > 0 &&
               data.subscription.acceptTerms;
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
      if (!['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('O arquivo deve estar no formato PDF, JPG ou PNG');
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
      navigate('/corretor/dashboard');
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

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cadastro de Corretor</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Faça parte da VHGold Imóveis e tenha acesso a empreendimentos exclusivos para oferecer aos seus clientes.
            Nosso processo de cadastro é simples e seguro.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { number: 1, title: 'Informações Básicas' },
              { number: 2, title: 'Documentação' },
              { number: 3, title: 'Plano de Assinatura' }
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
                {number < 3 && (
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
                <h2 className="text-xl font-semibold">Dados do Corretor</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={data.personalInfo.fullName}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            fullName: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CRECI
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.creci}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          creci: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Seu número CRECI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={data.personalInfo.email}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            email: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="seu@email.com"
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
                        value={formatPhone(data.personalInfo.phone)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 11) {
                            setData(prev => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                phone: value
                              }
                            }));
                          }
                        }}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="(00) 00000-0000"
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
                        value={data.personalInfo.address}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            address: e.target.value
                          }
                        }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Rua, número, bairro"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.city}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          city: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.state}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          state: e.target.value.toUpperCase()
                        }
                      }))}
                      maxLength={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="UF"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documentation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Documentação</h2>
                <p className="text-gray-600 mb-6">
                  Para garantir a segurança de todos os envolvidos, precisamos de alguns documentos.
                  Todos os arquivos serão verificados por nossa equipe.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carteira CRECI
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload('creceDocument')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Carteira de registro no CRECI (PDF, JPG ou PNG, máx. 5MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de Identificação
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload('identificationDocument')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      RG, CNH ou passaporte (PDF, JPG ou PNG, máx. 5MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprovante de Residência
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileUpload('proofOfAddress')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Conta de água, luz ou gás (últimos 90 dias, PDF, JPG ou PNG, máx. 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Subscription Plan */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Escolha seu Plano</h2>
                <p className="text-gray-600 mb-6">
                  Selecione o plano que melhor atende às suas necessidades. Você pode alterar seu plano a qualquer momento.
                </p>

                {/* Subscription Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {subscriptionPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all ${
                        data.subscription.plan === plan.id 
                          ? 'border-blue-600 shadow-lg transform scale-105' 
                          : 'border-gray-200 hover:border-gray-300 shadow-md'
                      }`}
                    >
                      {plan.recommended && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                          Recomendado
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                          <span className="text-gray-600 ml-1">{plan.billingCycle}</span>
                          {plan.originalPrice && (
                            <div className="mt-1">
                              <span className="text-sm text-gray-500 line-through">R$ {plan.originalPrice.toFixed(2).replace('.', ',')}</span>
                              <span className="ml-2 text-sm text-green-600">Economia de {plan.discount}%</span>
                            </div>
                          )}
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button
                          type="button"
                          onClick={() => setData(prev => ({
                            ...prev,
                            subscription: {
                              ...prev.subscription,
                              plan: plan.id
                            }
                          }))}
                          className={`w-full py-2 rounded-lg transition-colors ${
                            data.subscription.plan === plan.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {data.subscription.plan === plan.id ? 'Selecionado' : 'Selecionar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações de Pagamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Cartão
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formatCardNumber(data.subscription.paymentMethod.cardNumber)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 16) {
                              setData(prev => ({
                                ...prev,
                                subscription: {
                                  ...prev.subscription,
                                  paymentMethod: {
                                    ...prev.subscription.paymentMethod,
                                    cardNumber: value
                                  }
                                }
                              }));
                            }
                          }}
                          className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        value={data.subscription.paymentMethod.cardName}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          subscription: {
                            ...prev.subscription,
                            paymentMethod: {
                              ...prev.subscription.paymentMethod,
                              cardName: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Nome como aparece no cartão"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Validade
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formatExpiryDate(data.subscription.paymentMethod.expiryDate)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setData(prev => ({
                                ...prev,
                                subscription: {
                                  ...prev.subscription,
                                  paymentMethod: {
                                    ...prev.subscription.paymentMethod,
                                    expiryDate: value
                                  }
                                }
                              }));
                            }
                          }}
                          className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="MM/AA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de Segurança (CVV)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={data.subscription.paymentMethod.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setData(prev => ({
                                ...prev,
                                subscription: {
                                  ...prev.subscription,
                                  paymentMethod: {
                                    ...prev.subscription.paymentMethod,
                                    cvv: value
                                  }
                                }
                              }));
                            }
                          }}
                          className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="pt-4 border-t">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={data.subscription.acceptTerms}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        subscription: {
                          ...prev.subscription,
                          acceptTerms: e.target.checked
                        }
                      }))}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      Li e aceito os <a href="#" className="text-blue-600 hover:underline">termos de uso</a> e <a href="#" className="text-blue-600 hover:underline">política de privacidade</a> da VHGold Imóveis.
                      Autorizo a cobrança recorrente em meu cartão de crédito de acordo com o plano selecionado.
                      Estou ciente que posso cancelar a assinatura a qualquer momento.
                    </span>
                  </label>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plano {subscriptionPlans.find(p => p.id === data.subscription.plan)?.title}</span>
                      <span>R$ {subscriptionPlans.find(p => p.id === data.subscription.plan)?.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {subscriptionPlans.find(p => p.id === data.subscription.plan)?.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto</span>
                        <span>-{subscriptionPlans.find(p => p.id === data.subscription.plan)?.discount}%</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>R$ {subscriptionPlans.find(p => p.id === data.subscription.plan)?.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="text-sm text-gray-500 pt-2">
                      Próxima cobrança em {new Date(Date.now() + (
                        data.subscription.plan === 'monthly' ? 30 : 
                        data.subscription.plan === 'quarterly' ? 90 : 365
                      ) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar</span>
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep(currentStep)}
                  className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !validateStep(currentStep)}
                  className="ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span>Finalizar Cadastro</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
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