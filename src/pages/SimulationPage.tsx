import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, Building2, MapPin, Percent, Calendar, ArrowRight, FileText, Download, ExternalLink, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface FinancingRate {
  id: string;
  propertyType: 'residential' | 'commercial' | 'land';
  minValue: number;
  maxValue: number;
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

interface Bank {
  id: string;
  name: string;
  logo: string;
  apr: number;
  rate: number;
  payment: number;
  externalLink?: string;
  fees: number;
  points: number;
  pointsCost: number;
  term: string;
}

export default function SimulationPage() {
  const { isAuthenticated, setShowAuthModal, setRedirectAfterLogin } = useAuth();
  const location = useLocation();
  const [loanAmount, setLoanAmount] = useState('590000');
  const [downPayment, setDownPayment] = useState('118000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [term, setTerm] = useState('30 Year Fixed');
  const [propertyLocation, setPropertyLocation] = useState('33168, São Paulo, SP');
  const [creditScore, setCreditScore] = useState('760-779');
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'land'>('residential');
  const [sortBy, setSortBy] = useState<'APR' | 'Monthly Payment' | 'Rate' | 'Fees'>('APR');
  const [isVeteran, setIsVeteran] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if there's property type information in the location state
    if (location.state) {
      const { propertyType } = location.state;
      if (propertyType === 'apartment' || propertyType === 'house') {
        setPropertyType('residential');
      } else if (propertyType === 'commercial') {
        setPropertyType('commercial');
      } else if (propertyType === 'land') {
        setPropertyType('land');
      }
      
      // If there's a property value, set it
      if (location.state.propertyValue) {
        setLoanAmount(location.state.propertyValue.toString());
        // Calculate default down payment (20%)
        const downPaymentValue = Math.round(location.state.propertyValue * 0.2);
        setDownPayment(downPaymentValue.toString());
        setDownPaymentPercent('20');
      }
    }
  }, []);

  // Load financing rates from localStorage
  useEffect(() => {
    const loadRates = () => {
      const savedRates = localStorage.getItem('financingRates');
      if (savedRates) {
        try {
          const rates = JSON.parse(savedRates) as FinancingRate[];
          
          // Filter active rates
          const activeRates = rates.filter(rate => rate.active && rate.propertyType === propertyType);
          
          // Convert rates to banks format
          const banksFromRates = activeRates.map(rate => {
            // Get rate based on credit score
            const scoreRange = creditScore.split('-');
            const score = parseInt(scoreRange[0]);
            
            // Find the appropriate rate for the credit score
            let applicableRate = rate.baseRate;
            for (const scoreRate of rate.creditScoreRates) {
              const [min, max] = scoreRate.score.split('-').map(s => parseInt(s));
              if (score >= min && score <= max) {
                applicableRate = scoreRate.rate;
                break;
              }
            }
            
            // Calculate monthly payment
            const loanVal = parseFloat(loanAmount.replace(/,/g, ''));
            const downPaymentVal = parseFloat(downPayment.replace(/,/g, ''));
            const financingAmount = loanVal - downPaymentVal;
            
            // Convert annual rate to monthly rate
            const monthlyRate = applicableRate / 100 / 12;
            
            // Get term in months
            const termYears = parseInt(term.split(' ')[0]);
            const termMonths = termYears * 12;
            
            // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
            // Where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
            const monthlyPayment = financingAmount * 
              (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
              (Math.pow(1 + monthlyRate, termMonths) - 1);
            
            // Calculate fees (0.5% of loan amount)
            const fees = financingAmount * 0.005;
            
            // Calculate points (0.5% of loan amount)
            const points = 0.5;
            const pointsCost = financingAmount * (points / 100);
            
            // Calculate APR (slightly higher than the interest rate)
            const apr = applicableRate + 0.1;
            
            return {
              id: rate.id,
              name: `Financeira ${rate.propertyType === 'residential' ? 'Residencial' : 
                     rate.propertyType === 'commercial' ? 'Comercial' : 'Terrenos'}`,
              logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
              apr: apr,
              rate: applicableRate,
              payment: Math.round(monthlyPayment),
              externalLink: rate.externalLink,
              fees: Math.round(fees),
              points: points,
              pointsCost: Math.round(pointsCost),
              term: `${termYears}-Year Fixed`
            };
          });
          
          // If no rates found, use default banks
          if (banksFromRates.length === 0) {
            setBanks([
              createDefaultBank('1', 'Financeira Residencial', propertyType),
              createDefaultBank('2', 'Crédito Imobiliário', propertyType),
              createDefaultBank('3', 'Financeira Nacional', propertyType)
            ]);
          } else {
            setBanks(banksFromRates);
          }
        } catch (error) {
          console.error('Error parsing saved rates:', error);
          // Use default banks if there's an error
          setBanks([
            createDefaultBank('1', 'Financeira Residencial', propertyType),
            createDefaultBank('2', 'Crédito Imobiliário', propertyType),
            createDefaultBank('3', 'Financeira Nacional', propertyType)
          ]);
        }
      }
    };
    
    loadRates();
  }, [loanAmount, downPayment, term, creditScore, propertyType]);

  // Function to create default bank based on property type
  const createDefaultBank = (id: string, name: string, type: 'residential' | 'commercial' | 'land'): Bank => {
    // Adjust rates based on property type
    let baseRate = 6.0;
    let apr = 6.058;
    
    if (type === 'commercial') {
      baseRate = 8.5;
      apr = 8.65;
    } else if (type === 'land') {
      baseRate = 9.5;
      apr = 9.75;
    }
    
    // Calculate payment based on loan amount and rate
    const loanVal = parseFloat(loanAmount.replace(/,/g, ''));
    const downPaymentVal = parseFloat(downPayment.replace(/,/g, ''));
    const financingAmount = loanVal - downPaymentVal;
    
    // Convert annual rate to monthly rate
    const monthlyRate = baseRate / 100 / 12;
    
    // Get term in months
    const termYears = parseInt(term.split(' ')[0]);
    const termMonths = termYears * 12;
    
    // Calculate monthly payment
    const monthlyPayment = financingAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    // Calculate fees (0.5% of loan amount)
    const fees = financingAmount * 0.005;
    
    // Calculate points (0.5% of loan amount)
    const points = 0.5;
    const pointsCost = financingAmount * (points / 100);
    
    return {
      id,
      name: `${name} ${type === 'residential' ? 'Residencial' : type === 'commercial' ? 'Comercial' : 'Terrenos'}`,
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100',
      apr,
      rate: baseRate,
      payment: Math.round(monthlyPayment),
      externalLink: 'https://www.example.com',
      fees: Math.round(fees),
      points,
      pointsCost: Math.round(pointsCost),
      term: `${termYears}-Year Fixed`
    };
  };

  const handleDownPaymentChange = (value: string, isPercent: boolean) => {
    const loanVal = parseFloat(loanAmount.replace(/,/g, ''));
    if (isPercent) {
      const percent = parseFloat(value) || 0;
      setDownPaymentPercent(percent.toString());
      const amount = (loanVal * percent) / 100;
      setDownPayment(amount.toFixed(0));
    } else {
      const amount = parseFloat(value.replace(/,/g, '')) || 0;
      setDownPayment(amount.toString());
      const percent = (amount / loanVal) * 100;
      setDownPaymentPercent(percent.toFixed(0));
    }
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    return numValue.toLocaleString('pt-BR');
  };

  const handleViewDetails = (bankId: string) => {
    // Find the selected bank
    const selectedBank = banks.find(bank => bank.id === bankId);
    
    // If the bank has an external link, redirect to it
    if (selectedBank?.externalLink) {
      window.open(selectedBank.externalLink, '_blank');
      return;
    }

    // This code should never be reached since all banks should have external links
    console.error('Bank is missing external link:', selectedBank);
    alert('Erro: Link externo não encontrado para esta instituição financeira.');
  };
  
  // Update rates when inputs change
  const handleUpdateRates = () => {
    // This will trigger the useEffect to recalculate rates
    const event = new Event('change');
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simulação de Financiamento</h1>
        <p className="text-gray-600">Compare taxas e condições dos principais bancos</p>
      </div>

      {/* Loan Calculator */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Imóvel
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as 'residential' | 'commercial' | 'land')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="residential">Residencial (Apartamento/Casa)</option>
              <option value="commercial">Comercial</option>
              <option value="land">Terreno</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor do Imóvel
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formatCurrency(loanAmount)}
                onChange={(e) => setLoanAmount(e.target.value.replace(/\D/g, ''))}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entrada
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formatCurrency(downPayment)}
                  onChange={(e) => handleDownPaymentChange(e.target.value.replace(/\D/g, ''), false)}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => handleDownPaymentChange(e.target.value, true)}
                  min="0"
                  max="100"
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prazo
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option>30 anos</option>
              <option>20 anos</option>
              <option>15 anos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score de Crédito
            </label>
            <select
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option>760-779</option>
              <option>740-759</option>
              <option>720-739</option>
              <option>700-719</option>
              <option>680-699</option>
              <option>660-679</option>
              <option>640-659</option>
              <option>620-639</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleUpdateRates}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Atualizar Taxas</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex gap-2">
          {(['APR', 'Monthly Payment', 'Rate', 'Fees'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Banks List */}
      <div className="space-y-4">
        {banks.map((bank) => (
          <div key={bank.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
              <div className="flex items-center gap-4">
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="w-12 h-12 object-contain rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{bank.name}</h3>
                  <p className="text-sm text-gray-500">{bank.term}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">APR</p>
                <p className="text-xl font-semibold">{bank.apr}%</p>
                <p className="text-sm text-gray-500">Taxa: {bank.rate}%</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Pagamento Mensal</p>
                <p className="text-xl font-semibold">R$ {formatCurrency(bank.payment)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Taxas</p>
                <p className="text-xl font-semibold">R$ {formatCurrency(bank.fees)}</p>
                <p className="text-sm text-gray-500">
                  Inclui {bank.points} pontos (R$ {formatCurrency(bank.pointsCost)})
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleViewDetails(bank.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Calculadora de Custos</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Use nossa calculadora para estimar todos os custos envolvidos no financiamento.
          </p>
          <button className="mt-4 text-blue-600 hover:text-blue-800">
            Calcular Custos
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Documentos Necessários</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Veja a lista completa de documentos necessários para o financiamento.
          </p>
          <button className="mt-4 text-blue-600 hover:text-blue-800">
            Ver Lista
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Baixar Simulação</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Baixe um relatório completo com todas as opções de financiamento.
          </p>
          <button className="mt-4 text-blue-600 hover:text-blue-800">
            Baixar PDF
          </button>
        </div>
      </div>

      {/* Financial Institutions Banner */}
      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">É uma Instituição Financeira?</h3>
            <p className="text-blue-700">
              Cadastre-se na VHGold Imóveis e ofereça suas opções de financiamento para nossos clientes.
            </p>
          </div>
          <a
            href="/cadastro/financeira"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Cadastrar Instituição</span>
          </a>
        </div>
      </div>
    </div>
  );
}