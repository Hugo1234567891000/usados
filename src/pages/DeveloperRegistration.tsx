import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, User, Globe, FileText, Shield, CheckCircle } from 'lucide-react';

export default function DeveloperRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    website: '',
    responsibleName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    documents: {
      registration: null,
      license: null,
      proof: null
    },
    acceptedTerms: false
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (field: keyof typeof formData.documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: e.target.files![0]
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cadastro de Construtora</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Faça parte da VHGold Imóveis e exponha seus empreendimentos para milhares de clientes potenciais.
            Nosso processo de cadastro é simples e seguro.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { number: 1, title: 'Informações Básicas' },
              { number: 2, title: 'Documentação' },
              { number: 3, title: 'Revisão' }
            ].map(({ number, title }) => (
              <div key={number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {number}
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${
                    step >= number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {title}
                  </p>
                </div>
                {number < 3 && (
                  <div className="w-12 h-1 mx-4 bg-gray-200">
                    <div className={`h-full ${
                      step > number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Dados da Empresa</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Construtora
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="VHGold Construtora"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="00.000.000/0000-00"
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
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
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
                        value={formData.responsibleName}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="João Silva"
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
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="contato@exemplo.com"
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
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="(11) 99999-9999"
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
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Av. Paulista, 1000 - São Paulo, SP"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Documentação</h2>
                <p className="text-gray-600 mb-6">
                  Para garantir a segurança de todos os envolvidos, precisamos de alguns documentos.
                  Todos os arquivos serão verificados por nossa equipe.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registro da Empresa
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileChange('registration')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Contrato social ou documento equivalente (PDF, DOC)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Licença de Construção
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileChange('license')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Alvará ou licença de funcionamento (PDF, DOC)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprovante de Regularidade
                    </label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="file"
                        onChange={handleFileChange('proof')}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Certidões negativas (PDF, DOC)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Revisão e Confirmação</h2>
                <p className="text-gray-600 mb-6">
                  Revise todas as informações antes de finalizar o cadastro.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Dados da Empresa</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Construtora:</span> {formData.companyName}</p>
                        <p><span className="font-medium">CNPJ:</span> {formData.cnpj}</p>
                        <p><span className="font-medium">Website:</span> {formData.website}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Contato</h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Responsável:</span> {formData.responsibleName}</p>
                        <p><span className="font-medium">E-mail:</span> {formData.email}</p>
                        <p><span className="font-medium">Telefone:</span> {formData.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Endereço</h3>
                    <p className="mt-2">{formData.address}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Documentos Anexados</h3>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{formData.documents.registration?.name || 'Nenhum arquivo selecionado'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{formData.documents.license?.name || 'Nenhum arquivo selecionado'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span>{formData.documents.proof?.name || 'Nenhum arquivo selecionado'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
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

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.acceptedTerms}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalizar Cadastro
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