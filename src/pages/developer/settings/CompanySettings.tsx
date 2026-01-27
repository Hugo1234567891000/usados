import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, FileText, Download, Eye, Upload, X, Key, FileCheck, AlertTriangle } from 'lucide-react';

interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  validUntil?: string;
  status: 'valid' | 'expiring' | 'expired';
}

export default function CompanySettings() {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<CompanyDocument | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // Example company data
  const company = {
    name: 'VHGold Construtora',
    cnpj: '12.345.678/0001-90',
    email: 'construtora@vhgold.com.br',
    phone: '(11) 99999-9999',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 1010',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01310-100'
    },
    documents: [
      {
        id: '1',
        name: 'Contrato Social',
        type: 'application/pdf',
        url: '/documents/contrato-social.pdf',
        status: 'valid' as const
      },
      {
        id: '2',
        name: 'Certidão Negativa',
        type: 'application/pdf',
        url: '/documents/certidao.pdf',
        validUntil: '2024-12-31',
        status: 'valid' as const
      },
      {
        id: '3',
        name: 'Alvará de Funcionamento',
        type: 'application/pdf',
        url: '/documents/alvara.pdf',
        validUntil: '2024-06-30',
        status: 'expiring' as const
      }
    ]
  };

  // DocuSign integration data
  const [docusignData, setDocusignData] = useState({
    apiKey: '',
    webhookSecret: '',
    integrationEnabled: false
  });

  const getDocumentStatusColor = (status: CompanyDocument['status']) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleDocumentUpload = (file: File) => {
    // Implement document upload logic
    console.log('Uploading document:', file.name);
  };

  const handleDeployEdgeFunctions = () => {
    setShowDeployModal(true);
  };

  const confirmDeploy = () => {
    setDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploying(false);
      setDeploySuccess(true);
      
      // Update integration status
      setDocusignData(prev => ({
        ...prev,
        integrationEnabled: true
      }));
      
      // Close modal after a delay
      setTimeout(() => {
        setShowDeployModal(false);
        setDeploySuccess(false);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Dados da Empresa</h2>
        <p className="text-sm text-gray-500">Informações e documentos da construtora</p>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-6">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={company.name}
                readOnly
                className="pl-10 w-full px-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              value={company.cnpj}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
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
                value={company.email}
                readOnly
                className="pl-10 w-full px-4 py-2 border rounded-lg bg-gray-50"
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
                value={company.phone}
                readOnly
                className="pl-10 w-full px-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={`${company.address.street}, ${company.address.number}${company.address.complement ? ` - ${company.address.complement}` : ''} - ${company.address.neighborhood}, ${company.address.city} - ${company.address.state}`}
              readOnly
              className="pl-10 w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-md font-semibold text-gray-900">Documentos</h3>
          <button
            onClick={() => setShowDocumentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>

        <div className="space-y-4">
          {company.documents.map(doc => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  {doc.validUntil && (
                    <p className="text-sm text-gray-500">
                      Válido até {new Date(doc.validUntil).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getDocumentStatusColor(doc.status)
                }`}>
                  {doc.status === 'valid' ? 'Válido' :
                   doc.status === 'expiring' ? 'A vencer' : 'Vencido'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowDocumentModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      // Handle document download
                      console.log('Downloading:', doc.name);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-md font-semibold text-gray-900">Métodos de Pagamento</h3>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Adicionar Cartão</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Visa · Expira em 12/25</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Padrão
              </span>
              <button className="text-red-600 hover:text-red-800">
                Remover
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 5678</p>
                <p className="text-sm text-gray-500">Mastercard · Expira em 06/26</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-blue-600 hover:text-blue-800">
                Tornar padrão
              </button>
              <button className="text-red-600 hover:text-red-800">
                Remover
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Os cartões cadastrados serão utilizados para o pagamento de comissões aos corretores.
                  Certifique-se de manter os dados atualizados e com limite disponível.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DocuSign Integration */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-md font-semibold text-gray-900">Integração com DocuSign</h3>
            <p className="text-sm text-gray-500">Configure a integração para assinatura digital de contratos</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            docusignData.integrationEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {docusignData.integrationEnabled ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DocuSign API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={docusignData.apiKey}
                onChange={(e) => setDocusignData(prev => ({ ...prev, apiKey: e.target.value }))}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Insira sua API Key do DocuSign"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Encontre sua API Key no painel de desenvolvedor do DocuSign
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook Secret
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={docusignData.webhookSecret}
                onChange={(e) => setDocusignData(prev => ({ ...prev, webhookSecret: e.target.value }))}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Insira o secret do webhook"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Utilizado para validar as notificações recebidas do DocuSign
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Após configurar as credenciais, você precisa implantar as funções de borda (edge functions) 
                para processar as assinaturas e webhooks do DocuSign. Este processo pode levar alguns minutos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleDeployEdgeFunctions}
            disabled={!docusignData.apiKey || !docusignData.webhookSecret}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileCheck className="w-5 h-5" />
            <span>Implantar Edge Functions do DocuSign</span>
          </button>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Upload de Documento</h3>
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedDocument(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Arraste e solte um arquivo aqui, ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleDocumentUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Selecionar Arquivo
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="">Selecione o tipo</option>
                  <option value="contract">Contrato Social</option>
                  <option value="license">Alvará</option>
                  <option value="certificate">Certidão</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Edge Functions Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Implantar Edge Functions</h3>
              {!deploying && !deploySuccess && (
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {!deploySuccess ? (
              <>
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Atenção:</strong> Este processo irá implantar as seguintes funções:
                      </p>
                      <ul className="list-disc list-inside text-sm text-blue-700 mt-2">
                        <li>docusign-webhook: Processa notificações de assinatura</li>
                        <li>docusign-auth: Gerencia autenticação com a API</li>
                        <li>docusign-envelope: Cria e gerencia envelopes de assinatura</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {deploying ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-700">Implantando funções...</p>
                    <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns minutos.</p>
                  </div>
                ) : (
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeployModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmDeploy}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirmar Implantação
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Implantação Concluída!</h3>
                <p className="text-gray-600">As funções foram implantadas com sucesso.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}