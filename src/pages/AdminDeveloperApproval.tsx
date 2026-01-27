import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Building2, Mail, Phone, FileText, Shield, AlertCircle, Download, FileIcon, X } from 'lucide-react';

interface Document {
  name: string;
  type: string;
  url: string;
  size: string;
  uploadedAt: string;
}

interface Developer {
  id: string;
  companyName: string;
  cnpj: string;
  website: string;
  responsibleName: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    registration: Document;
    license: Document;
    proof: Document;
  };
  submittedAt: string;
}

// Mock data - replace with actual data from your backend
const mockDevelopers: Developer[] = [
  {
    id: '1',
    companyName: 'Construtora ABC',
    cnpj: '12.345.678/0001-90',
    website: 'https://www.construtorabc.com.br',
    responsibleName: 'João Silva',
    email: 'joao@construtorabc.com.br',
    phone: '(11) 99999-9999',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    status: 'pending',
    documents: {
      registration: {
        name: 'contrato-social.pdf',
        type: 'application/pdf',
        url: '/documents/contrato-social.pdf',
        size: '2.5 MB',
        uploadedAt: '2024-03-15T10:30:00'
      },
      license: {
        name: 'alvara.pdf',
        type: 'application/pdf',
        url: '/documents/alvara.pdf',
        size: '1.8 MB',
        uploadedAt: '2024-03-15T10:30:00'
      },
      proof: {
        name: 'certidoes.pdf',
        type: 'application/pdf',
        url: '/documents/certidoes.pdf',
        size: '3.2 MB',
        uploadedAt: '2024-03-15T10:30:00'
      }
    },
    submittedAt: '2024-03-15T10:30:00'
  },
  {
    id: '2',
    companyName: 'Incorporadora XYZ',
    cnpj: '98.765.432/0001-10',
    website: 'https://www.incorporadoraxyz.com.br',
    responsibleName: 'Maria Santos',
    email: 'maria@incorporadoraxyz.com.br',
    phone: '(11) 98888-8888',
    address: 'Rua Augusta, 500 - São Paulo, SP',
    status: 'pending',
    documents: {
      registration: {
        name: 'contrato-social-xyz.pdf',
        type: 'application/pdf',
        url: '/documents/contrato-social-xyz.pdf',
        size: '2.1 MB',
        uploadedAt: '2024-03-14T15:45:00'
      },
      license: {
        name: 'alvara-xyz.pdf',
        type: 'application/pdf',
        url: '/documents/alvara-xyz.pdf',
        size: '1.5 MB',
        uploadedAt: '2024-03-14T15:45:00'
      },
      proof: {
        name: 'certidoes-xyz.pdf',
        type: 'application/pdf',
        url: '/documents/certidoes-xyz.pdf',
        size: '2.8 MB',
        uploadedAt: '2024-03-14T15:45:00'
      }
    },
    submittedAt: '2024-03-14T15:45:00'
  }
];

export default function AdminDeveloperApproval() {
  const [developers, setDevelopers] = useState<Developer[]>(mockDevelopers);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);

  const handleApprove = (developerId: string) => {
    setDevelopers(prev => prev.map(dev => 
      dev.id === developerId ? { ...dev, status: 'approved' } : dev
    ));
    setShowDetails(false);
  };

  const handleReject = (developerId: string) => {
    setDevelopers(prev => prev.map(dev => 
      dev.id === developerId ? { ...dev, status: 'rejected' } : dev
    ));
    setShowDetails(false);
  };

  const filteredDevelopers = developers.filter(dev => 
    filter === 'all' || dev.status === filter
  );

  const getStatusColor = (status: Developer['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: Developer['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
    }
  };

  const handleDownload = (document: Document) => {
    // In a real application, this would trigger a file download
    console.log('Downloading:', document.name);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aprovação de Construtoras</h1>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'Todos' : 
                 status === 'pending' ? 'Pendentes' :
                 status === 'approved' ? 'Aprovados' : 'Rejeitados'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Construtora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Submissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevelopers.map((developer) => (
                <tr key={developer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {developer.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {developer.cnpj}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{developer.responsibleName}</div>
                    <div className="text-sm text-gray-500">{developer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(developer.submittedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(developer.status)
                    }`}>
                      {getStatusText(developer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDeveloper(developer);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {developer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(developer.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(developer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Developer Details Modal */}
        {showDetails && selectedDeveloper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalhes da Construtora
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informações da Empresa</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{selectedDeveloper.companyName}</p>
                          <p className="text-sm text-gray-500">{selectedDeveloper.cnpj}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">E-mail</p>
                          <p className="text-sm text-gray-500">{selectedDeveloper.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Telefone</p>
                          <p className="text-sm text-gray-500">{selectedDeveloper.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Documentos</h3>
                    <div className="space-y-4">
                      {Object.entries(selectedDeveloper.documents).map(([key, doc]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">
                                {doc.size} · Enviado em {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDocument(doc)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedDeveloper.status === 'pending' && (
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => handleReject(selectedDeveloper.id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleApprove(selectedDeveloper.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aprovar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        {showDocumentViewer && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] m-4 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <FileIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium">{selectedDocument.name}</h3>
                    <p className="text-sm text-gray-500">{selectedDocument.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setShowDocumentViewer(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 bg-gray-50">
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-full rounded-lg"
                  title={selectedDocument.name}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}