import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Percent, Calendar, Building2, Save, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RatesConfiguration() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    logo: '',
    apr: 6.058,
    rate: 6.000,
    payment: 2830,
    fees: 2950,
    points: 0.625,
    pointsCost: 2950,
    term: '30-Year Fixed',
    minDownPayment: 20,
    processingTime: 30,
    preApprovalRequired: true,
    acceptedPropertyTypes: ['residential', 'commercial'],
    specialPrograms: {
      firstTimeBuyer: true,
      lowIncome: false,
      ruralAreas: false
    },
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    }
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      // Save to localStorage for demo purposes
      localStorage.setItem('bankFinancingRates', JSON.stringify(formData));
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuração de Taxas de Financiamento</h1>
              <p className="text-gray-600">Configure as taxas e condições de financiamento da sua instituição</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> As informações configuradas aqui serão exibidas para os clientes na página de simulação de financiamento.
                  Certifique-se de que todas as taxas e condições estejam atualizadas.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Bank Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Informações do Banco</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Banco
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Ex: Banco Exemplo"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL do Logo
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="https://exemplo.com/logo.png"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Forneça uma URL para o logo do seu banco (formato recomendado: PNG ou SVG, tamanho: 200x100px)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, email: e.target.value } 
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="contato@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, phone: e.target.value } 
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contactInfo.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, website: e.target.value } 
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="https://www.exemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Financing Rates */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Taxas de Financiamento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa APR (% a.a.)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.apr}
                      onChange={(e) => setFormData(prev => ({ ...prev, apr: parseFloat(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de Juros (% a.a.)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pagamento Mensal (para R$ 500.000)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      value={formData.payment}
                      onChange={(e) => setFormData(prev => ({ ...prev, payment: parseInt(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Valor estimado da parcela mensal para um financiamento de R$ 500.000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxas (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      value={formData.fees}
                      onChange={(e) => setFormData(prev => ({ ...prev, fees: parseInt(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pontos (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.points}
                      onChange={(e) => setFormData(prev => ({ ...prev, points: parseFloat(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Pontos são taxas pagas antecipadamente para reduzir a taxa de juros
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo dos Pontos (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="0"
                      value={formData.pointsCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, pointsCost: parseInt(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prazo
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  >
                    <option value="30-Year Fixed">30 Anos Fixo</option>
                    <option value="20-Year Fixed">20 Anos Fixo</option>
                    <option value="15-Year Fixed">15 Anos Fixo</option>
                    <option value="10-Year Fixed">10 Anos Fixo</option>
                    <option value="5-Year ARM">5 Anos Ajustável</option>
                  </select>
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
                      value={formData.minDownPayment}
                      onChange={(e) => setFormData(prev => ({ ...prev, minDownPayment: parseInt(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Configurações Adicionais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo de Processamento (dias)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="1"
                      value={formData.processingTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, processingTime: parseInt(e.target.value) }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tempo médio para aprovação do financiamento
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pré-aprovação Necessária
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.preApprovalRequired}
                        onChange={() => setFormData(prev => ({ ...prev, preApprovalRequired: true }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!formData.preApprovalRequired}
                        onChange={() => setFormData(prev => ({ ...prev, preApprovalRequired: false }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>Não</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipos de Imóveis Aceitos
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptedPropertyTypes.includes('residential')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.acceptedPropertyTypes, 'residential']
                            : formData.acceptedPropertyTypes.filter(t => t !== 'residential');
                          setFormData(prev => ({ ...prev, acceptedPropertyTypes: newTypes }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Residencial</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptedPropertyTypes.includes('commercial')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.acceptedPropertyTypes, 'commercial']
                            : formData.acceptedPropertyTypes.filter(t => t !== 'commercial');
                          setFormData(prev => ({ ...prev, acceptedPropertyTypes: newTypes }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Comercial</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptedPropertyTypes.includes('rural')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.acceptedPropertyTypes, 'rural']
                            : formData.acceptedPropertyTypes.filter(t => t !== 'rural');
                          setFormData(prev => ({ ...prev, acceptedPropertyTypes: newTypes }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Rural</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.acceptedPropertyTypes.includes('industrial')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...formData.acceptedPropertyTypes, 'industrial']
                            : formData.acceptedPropertyTypes.filter(t => t !== 'industrial');
                          setFormData(prev => ({ ...prev, acceptedPropertyTypes: newTypes }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Industrial</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programas Especiais
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specialPrograms.firstTimeBuyer}
                        onChange={(e) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialPrograms: { 
                              ...prev.specialPrograms, 
                              firstTimeBuyer: e.target.checked 
                            } 
                          }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Primeiro Imóvel</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specialPrograms.lowIncome}
                        onChange={(e) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialPrograms: { 
                              ...prev.specialPrograms, 
                              lowIncome: e.target.checked 
                            } 
                          }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Baixa Renda</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specialPrograms.ruralAreas}
                        onChange={(e) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            specialPrograms: { 
                              ...prev.specialPrograms, 
                              ruralAreas: e.target.checked 
                            } 
                          }));
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Áreas Rurais</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}