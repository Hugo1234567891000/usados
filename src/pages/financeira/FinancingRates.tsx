import React, { useState, useEffect } from 'react';
import { Percent, DollarSign, Calendar, Save, Edit, AlertTriangle, CreditCard, Building2, Home, Check, X } from 'lucide-react';

interface FinancingRate {
  id: string;
  propertyType: 'residential' | 'commercial' | 'land';
  minValue: number;
  maxValue: number;
  externalLink?: string;
  baseRate: number;
  creditScoreRates: {
    score: string;
    rate: number;
  }[];
  minTerm: number;
  maxTerm: number;
  minDownPayment: number;
  active: boolean;
}

export default function FinancingRates() {
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Initialize rates from localStorage or use default data
  const getInitialRates = (): FinancingRate[] => {
    const savedRates = localStorage.getItem('financingRates');
    if (savedRates) {
      try {
        return JSON.parse(savedRates);
      } catch (error) {
        console.error('Error loading saved rates:', error);
      }
    }
    // Return default rates if no saved data or parsing fails
    return [
      {
        id: '1',
        propertyType: 'residential',
        minValue: 200000,
        maxValue: 1000000,
        baseRate: 7.5,
        creditScoreRates: [
          { score: '760-850', rate: 6.5 },
          { score: '700-759', rate: 7.0 },
          { score: '660-699', rate: 7.5 },
          { score: '620-659', rate: 8.0 },
          { score: '580-619', rate: 8.5 },
          { score: '500-579', rate: 9.0 }
        ],
        minTerm: 5,
        maxTerm: 30,
        minDownPayment: 20,
        externalLink: 'https://www.banco.com/financiamento-residencial',
        active: true
      },
      {
        id: '2',
        propertyType: 'commercial',
        minValue: 500000,
        maxValue: 5000000,
        baseRate: 10.0,
        creditScoreRates: [
          { score: '760-850', rate: 8.0 },
          { score: '700-759', rate: 9.0 },
          { score: '660-699', rate: 10.0 },
          { score: '620-659', rate: 11.0 },
          { score: '580-619', rate: 12.0 },
          { score: '500-579', rate: 13.0 }
        ],
        minTerm: 5,
        maxTerm: 20,
        minDownPayment: 30,
        externalLink: 'https://www.banco.com/financiamento-comercial',
        active: true
      },
      {
        id: '3',
        propertyType: 'land',
        minValue: 100000,
        maxValue: 800000,
        baseRate: 11.5,
        creditScoreRates: [
          { score: '760-850', rate: 9.0 },
          { score: '700-759', rate: 10.0 },
          { score: '660-699', rate: 11.5 },
          { score: '620-659', rate: 12.5 },
          { score: '580-619', rate: 13.5 },
          { score: '500-579', rate: 14.5 }
        ],
        minTerm: 2,
        maxTerm: 15,
        minDownPayment: 40,
        externalLink: 'https://www.banco.com/financiamento-terrenos',
        active: false
      }
    ];
  };

  const [rates, setRates] = useState<FinancingRate[]>(getInitialRates());
  
  // Save rates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('financingRates', JSON.stringify(rates));
  }, [rates]);

  const [newRate, setNewRate] = useState<Omit<FinancingRate, 'id'>>({
    propertyType: 'residential',
    minValue: 0,
    maxValue: 0,
    externalLink: '',
    baseRate: 0,
    creditScoreRates: [
      { score: '760-850', rate: 0 },
      { score: '700-759', rate: 0 },
      { score: '660-699', rate: 0 },
      { score: '620-659', rate: 0 },
      { score: '580-619', rate: 0 },
      { score: '500-579', rate: 0 }
    ],
    minTerm: 0,
    maxTerm: 0,
    minDownPayment: 0,
    active: true
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getPropertyTypeIcon = (type: FinancingRate['propertyType']) => {
    switch (type) {
      case 'residential':
        return <Home className="w-5 h-5" />;
      case 'commercial':
        return <Building2 className="w-5 h-5" />;
      case 'land':
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getPropertyTypeText = (type: FinancingRate['propertyType']) => {
    switch (type) {
      case 'residential':
        return 'Residencial';
      case 'commercial':
        return 'Comercial';
      case 'land':
        return 'Terreno';
    }
  };

  const handleEditRate = (id: string) => {
    setEditingRateId(id);
  };

  const handleSaveRate = (id: string) => {
    // Find the rate being edited
    const editedRate = rates.find(rate => rate.id === id);
    
    // Validate that external link is provided
    if (!editedRate?.externalLink) {
      alert('O campo "Link Externo" é obrigatório. Por favor, forneça um link válido.');
      return;
    }
    
    setEditingRateId(null);
    
    // Save to localStorage
    localStorage.setItem('financingRates', JSON.stringify(rates));
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleToggleActive = (id: string) => {
    setRates(prev => 
      prev.map(rate => 
        rate.id === id ? { ...rate, active: !rate.active } : rate
      )
    );
    
    // Save to localStorage after toggling
    setTimeout(() => {
      localStorage.setItem('financingRates', JSON.stringify(
        rates.map(rate => rate.id === id ? { ...rate, active: !rate.active } : rate)
      ));
    }, 0);
  };

  const handleAddRate = () => {
    // Validate that external link is provided
    if (!newRate.externalLink) {
      alert('O campo "Link Externo" é obrigatório. Por favor, forneça um link válido.');
      return;
    }
    
    const newId = `${Date.now()}`;
    setRates(prev => [...prev, { ...newRate, id: newId }]);
    setShowAddModal(false);

    // Save to localStorage
    setTimeout(() => {
      localStorage.setItem('financingRates', JSON.stringify([...rates, { ...newRate, id: newId }]));
    }, 0);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Taxas e Condições</h1>
            <p className="text-gray-600">Gerencie as taxas e condições de financiamento oferecidas</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Percent className="w-5 h-5" />
            <span>Nova Taxa</span>
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2 shadow-lg">
            <Check className="w-5 h-5" />
            <span>Taxas atualizadas com sucesso!</span>
          </div>
        )}

        {/* Rates Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Financiável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Juros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrada Mínima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link Externo
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
              {rates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getPropertyTypeIcon(rate.propertyType)}
                      <span className="font-medium">{getPropertyTypeText(rate.propertyType)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRateId === rate.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={rate.minValue}
                          onChange={(e) => setRates(prev => 
                            prev.map(r => r.id === rate.id ? { ...r, minValue: parseInt(e.target.value) } : r)
                          )}
                          className="w-24 px-2 py-1 border rounded"
                        />
                        <span>a</span>
                        <input
                          type="number"
                          value={rate.maxValue}
                          onChange={(e) => setRates(prev => 
                            prev.map(r => r.id === rate.id ? { ...r, maxValue: parseInt(e.target.value) } : r)
                          )}
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </div>
                    ) : (
                      <span>
                        {formatCurrency(rate.minValue)} a {formatCurrency(rate.maxValue)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRateId === rate.id ? (
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Taxa Base:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={rate.baseRate}
                              onChange={(e) => setRates(prev => 
                                prev.map(r => r.id === rate.id ? { ...r, baseRate: parseFloat(e.target.value) } : r)
                              )}
                              className="w-16 px-2 py-1 border rounded"
                            />
                            <span>% a.a.</span>
                          </div>
                          <div className="text-sm font-medium mt-1">Por Score:</div>
                          {rate.creditScoreRates.map((scoreRate, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <span>{scoreRate.score}:</span>
                              <input
                                type="number"
                                step="0.1"
                                value={scoreRate.rate}
                                onChange={(e) => {
                                  const newRates = [...rate.creditScoreRates];
                                  newRates[idx].rate = parseFloat(e.target.value);
                                  setRates(prev => 
                                    prev.map(r => r.id === rate.id ? { ...r, creditScoreRates: newRates } : r)
                                  );
                                }}
                                className="w-16 px-2 py-1 border rounded"
                              />
                              <span>%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{rate.baseRate}% a.a. (base)</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {rate.creditScoreRates[0].rate}% a {rate.creditScoreRates[rate.creditScoreRates.length-1].rate}% por score
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRateId === rate.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={rate.minTerm}
                          onChange={(e) => setRates(prev => 
                            prev.map(r => r.id === rate.id ? { ...r, minTerm: parseInt(e.target.value) } : r)
                          )}
                          className="w-16 px-2 py-1 border rounded"
                        />
                        <span>a</span>
                        <input
                          type="number"
                          value={rate.maxTerm}
                          onChange={(e) => setRates(prev => 
                            prev.map(r => r.id === rate.id ? { ...r, maxTerm: parseInt(e.target.value) } : r)
                          )}
                          className="w-16 px-2 py-1 border rounded"
                        />
                        <span>anos</span>
                      </div>
                    ) : (
                      <span>
                        {rate.minTerm} a {rate.maxTerm} anos
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRateId === rate.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={rate.minDownPayment}
                          onChange={(e) => setRates(prev => 
                            prev.map(r => r.id === rate.id ? { ...r, minDownPayment: parseInt(e.target.value) } : r)
                          )}
                          className="w-16 px-2 py-1 border rounded"
                        />
                        <span>%</span>
                      </div>
                    ) : (
                      <span>
                        {rate.minDownPayment}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRateId === rate.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={rate.externalLink || ''}
                          onChange={(e) => setRates(prev => 
                            prev.map(r => r.id === rate.id ? { ...r, externalLink: e.target.value } : r)
                          )}
                          className="w-full px-2 py-1 border rounded"
                          placeholder="https://www.exemplo.com/financiamento"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 truncate max-w-xs block">
                        {rate.externalLink || 'Não definido'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rate.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {editingRateId === rate.id ? (
                        <button
                          onClick={() => handleSaveRate(rate.id)}
                          className="p-1 text-green-600 hover:text-green-900"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditRate(rate.id)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleActive(rate.id)}
                        className={`p-1 ${
                          rate.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {rate.active ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Rate Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Nova Taxa de Financiamento</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={newRate.propertyType}
                    onChange={(e) => setNewRate(prev => ({ 
                      ...prev, 
                      propertyType: e.target.value as FinancingRate['propertyType'] 
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="residential">Residencial</option>
                    <option value="commercial">Comercial</option>
                    <option value="land">Terreno</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Mínimo Financiável
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={newRate.minValue}
                        onChange={(e) => setNewRate(prev => ({ ...prev, minValue: parseInt(e.target.value) }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Máximo Financiável
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={newRate.maxValue}
                        onChange={(e) => setNewRate(prev => ({ ...prev, maxValue: parseInt(e.target.value) }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxa de Juros Base (% a.a.)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        step="0.1"
                        value={newRate.baseRate}
                        onChange={(e) => setNewRate(prev => ({ ...prev, baseRate: parseFloat(e.target.value) }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taxas por Score de Crédito (% a.a.)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {newRate.creditScoreRates.map((creditScore, idx) => (
                        <div key={idx}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Score {creditScore.score}
                          </label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="number"
                              step="0.1"
                              value={creditScore.rate}
                              onChange={(e) => {
                                const newRates = [...newRate.creditScoreRates];
                                newRates[idx].rate = parseFloat(e.target.value);
                                setNewRate(prev => ({ ...prev, creditScoreRates: newRates }));
                              }}
                              className="pl-8 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo Mínimo (anos)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={newRate.minTerm}
                        onChange={(e) => setNewRate(prev => ({ ...prev, minTerm: parseInt(e.target.value) }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo Máximo (anos)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={newRate.maxTerm}
                        onChange={(e) => setNewRate(prev => ({ ...prev, maxTerm: parseInt(e.target.value) }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                        value={newRate.minDownPayment}
                        onChange={(e) => setNewRate(prev => ({ ...prev, minDownPayment: parseInt(e.target.value) }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Externo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={newRate.externalLink || ''}
                      onChange={(e) => setNewRate(prev => ({ ...prev, externalLink: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="https://www.exemplo.com/financiamento"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      URL para onde o cliente será redirecionado ao clicar em "Ver Detalhes"
                    </p>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newRate.active}
                        onChange={(e) => setNewRate(prev => ({ ...prev, active: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Ativar imediatamente</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Importante:</strong> As taxas e condições definidas aqui serão exibidas nas simulações de financiamento para os clientes. 
                        As taxas por score de crédito permitem oferecer condições personalizadas com base no perfil financeiro do cliente.
                        Certifique-se de que todas as informações estão corretas e atualizadas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t flex-shrink-0">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddRate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar Taxa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// MapPin component for land icon
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}