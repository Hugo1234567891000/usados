import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, Check, X, ArrowRight, Clock, Download, Wallet, Shield, AlertTriangle, RefreshCw } from 'lucide-react';

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

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  brand: string;
  isDefault: boolean;
}

export default function BrokerSubscription() {
  // Current subscription data
  const [currentSubscription, setCurrentSubscription] = useState({
    plan: 'monthly' as 'monthly' | 'quarterly' | 'annual',
    status: 'active' as 'active' | 'canceled' | 'past_due',
    currentPeriodStart: new Date('2024-03-01').toISOString(),
    currentPeriodEnd: new Date('2024-04-01').toISOString(),
    cancelAtPeriodEnd: false,
    paymentMethod: {
      id: 'card_1',
      last4: '4242',
      brand: 'visa',
      expMonth: '12',
      expYear: '25'
    }
  });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card_1',
      cardNumber: '•••• •••• •••• 4242',
      cardName: 'JOAO SILVA',
      expiryDate: '12/25',
      brand: 'visa',
      isDefault: true
    }
  ]);

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

  // UI states
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Invoice history
  const invoices = [
    {
      id: 'inv_001',
      date: '2024-03-01',
      amount: 99.90,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      date: '2024-02-01',
      amount: 99.90,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      date: '2024-01-01',
      amount: 99.90,
      status: 'paid',
      downloadUrl: '#'
    }
  ];

  const handleChangePlan = () => {
    if (!selectedPlan) return;
    
    // Update subscription plan
    setCurrentSubscription(prev => ({
      ...prev,
      plan: selectedPlan as 'monthly' | 'quarterly' | 'annual'
    }));
    
    setShowChangePlanModal(false);
    setSelectedPlan(null);
  };

  const handleAddCard = () => {
    // Validate card details
    if (
      newCard.cardNumber.replace(/\s/g, '').length !== 16 ||
      newCard.cardName.length < 3 ||
      newCard.expiryDate.length !== 5 ||
      newCard.cvv.length < 3
    ) {
      return;
    }
    
    // Add new card
    const newPaymentMethod: PaymentMethod = {
      id: `card_${Date.now()}`,
      cardNumber: `•••• •••• •••• ${newCard.cardNumber.slice(-4)}`,
      cardName: newCard.cardName.toUpperCase(),
      expiryDate: newCard.expiryDate,
      brand: 'visa', // In a real app, this would be determined by the card number
      isDefault: false
    };
    
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    setNewCard({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    });
    setShowAddCardModal(false);
  };

  const handleSetDefaultCard = (cardId: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
  };

  const handleRemoveCard = (cardId: string) => {
    // Don't remove if it's the only card or if it's the default card
    if (paymentMethods.length === 1 || paymentMethods.find(card => card.id === cardId)?.isDefault) {
      return;
    }
    
    setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
  };

  const handleCancelSubscription = () => {
    setCurrentSubscription(prev => ({
      ...prev,
      cancelAtPeriodEnd: true
    }));
    setShowCancelModal(false);
  };

  const handleReactivateSubscription = () => {
    setCurrentSubscription(prev => ({
      ...prev,
      cancelAtPeriodEnd: false
    }));
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
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Assinatura</h2>
        <p className="text-gray-600">Gerencie seu plano de assinatura e métodos de pagamento</p>
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold">Seu Plano Atual</h3>
            <p className="text-gray-600">Gerencie seu plano e ciclo de faturamento</p>
          </div>
          {currentSubscription.status === 'active' && !currentSubscription.cancelAtPeriodEnd && (
            <button
              onClick={() => setShowChangePlanModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Alterar Plano
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Plano</h4>
            </div>
            <p className="text-lg font-semibold">
              {subscriptionPlans.find(p => p.id === currentSubscription.plan)?.title}
            </p>
            <p className="text-sm text-gray-600">
              R$ {subscriptionPlans.find(p => p.id === currentSubscription.plan)?.price.toFixed(2).replace('.', ',')} {subscriptionPlans.find(p => p.id === currentSubscription.plan)?.billingCycle}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Período Atual</h4>
            </div>
            <p className="text-lg font-semibold">
              {new Date(currentSubscription.currentPeriodStart).toLocaleDateString('pt-BR')} - {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-sm text-gray-600">
              Próxima cobrança em {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Status</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentSubscription.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : currentSubscription.status === 'past_due'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentSubscription.status === 'active' ? 'Ativo' : 
                 currentSubscription.status === 'past_due' ? 'Pagamento Pendente' : 'Cancelado'}
              </span>
            </div>
            {currentSubscription.cancelAtPeriodEnd && (
              <div className="mt-2">
                <p className="text-sm text-red-600">
                  Assinatura será cancelada em {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                </p>
                <button
                  onClick={handleReactivateSubscription}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Reativar assinatura
                </button>
              </div>
            )}
          </div>
        </div>

        {currentSubscription.status === 'active' && !currentSubscription.cancelAtPeriodEnd && (
          <div className="mt-6 pt-6 border-t flex justify-end">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 hover:text-red-800"
            >
              Cancelar assinatura
            </button>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold">Métodos de Pagamento</h3>
            <p className="text-gray-600">Gerencie seus cartões de crédito</p>
          </div>
          <button
            onClick={() => setShowAddCardModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar Cartão
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((card) => (
            <div 
              key={card.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                  {card.brand === 'visa' ? 'VISA' : 
                   card.brand === 'mastercard' ? 'MC' : 
                   card.brand === 'amex' ? 'AMEX' : 'CARD'}
                </div>
                <div>
                  <p className="font-medium">{card.cardNumber}</p>
                  <p className="text-sm text-gray-500">Expira em {card.expiryDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {card.isDefault ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Padrão
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefaultCard(card.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Tornar padrão
                  </button>
                )}
                {!card.isDefault && (
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Histórico de Faturamento</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {invoice.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={invoice.downloadUrl}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Alterar Plano</h3>
              <button
                onClick={() => {
                  setShowChangePlanModal(false);
                  setSelectedPlan(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {subscriptionPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-blue-600 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 shadow-md'
                  } ${currentSubscription.plan === plan.id ? 'bg-blue-50' : ''}`}
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
                      onClick={() => setSelectedPlan(plan.id)}
                      disabled={currentSubscription.plan === plan.id}
                      className={`w-full py-2 rounded-lg transition-colors ${
                        currentSubscription.plan === plan.id
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : selectedPlan === plan.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {currentSubscription.plan === plan.id ? 'Plano Atual' : 
                       selectedPlan === plan.id ? 'Selecionado' : 'Selecionar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedPlan && selectedPlan !== currentSubscription.plan && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Alteração de Plano</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Ao confirmar, seu plano será alterado para {subscriptionPlans.find(p => p.id === selectedPlan)?.title}.
                      A mudança entrará em vigor imediatamente e você será cobrado proporcionalmente pela diferença.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowChangePlanModal(false);
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePlan}
                disabled={!selectedPlan || selectedPlan === currentSubscription.plan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Alteração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Adicionar Cartão</h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formatCardNumber(newCard.cardNumber)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 16) {
                        setNewCard(prev => ({
                          ...prev,
                          cardNumber: value
                        }));
                      }
                    }}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  value={newCard.cardName}
                  onChange={(e) => setNewCard(prev => ({
                    ...prev,
                    cardName: e.target.value
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Nome como aparece no cartão"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Validade
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formatExpiryDate(newCard.expiryDate)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setNewCard(prev => ({
                            ...prev,
                            expiryDate: value
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
                      value={newCard.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setNewCard(prev => ({
                            ...prev,
                            cvv: value
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

              <div className="pt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    Definir como método de pagamento padrão
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar Cartão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Cancelar Assinatura</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Tem certeza que deseja cancelar?</p>
                    <p className="text-sm text-red-700 mt-1">
                      Ao cancelar sua assinatura, você perderá acesso a todos os recursos premium ao final do período atual.
                      Sua assinatura permanecerá ativa até {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('pt-BR')}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Motivo do cancelamento</h4>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="">Selecione um motivo</option>
                  <option value="price">Preço muito alto</option>
                  <option value="features">Não estou usando todos os recursos</option>
                  <option value="competitor">Mudei para outro serviço</option>
                  <option value="temporary">Cancelamento temporário</option>
                  <option value="other">Outro motivo</option>
                </select>
              </div>

              <textarea
                rows={3}
                placeholder="Conte-nos mais sobre o motivo do cancelamento..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}