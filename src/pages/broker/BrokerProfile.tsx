import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText, Camera, Plus, X, Shield, CreditCard, Link as LinkIcon } from 'lucide-react';
import BrokerSubscription from './BrokerSubscription';

interface BrokerProfile {
  name: string;
  email: string;
  phone: string;
  creci: string;
  address: string;
  specialties: string[];
  availability: {
    days: string[];
    hours: string;
  };
  documents: {
    name: string;
    type: string;
    url: string;
    validUntil?: string;
    status: 'valid' | 'expiring' | 'expired';
  }[];
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
    type: string;
  };
}

export default function BrokerProfile() {
  const [activeTab, setActiveTab] = useState<'personal' | 'subscription'>('personal');
  const [profile, setProfile] = useState<BrokerProfile>({
    name: 'Ana Silva',
    email: 'ana.silva@vhgold.com.br',
    phone: '(11) 99999-9999',
    creci: '123456',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    specialties: ['Apartamentos de Alto Padrão', 'Imóveis na Planta', 'Financiamento'],
    availability: {
      days: ['Segunda à Sexta'],
      hours: '9h às 18h'
    },
    documents: [
      {
        name: 'CRECI.pdf',
        type: 'application/pdf',
        url: '/documents/creci.pdf',
        validUntil: '2024-12-31',
        status: 'valid'
      },
      {
        name: 'RG.pdf',
        type: 'application/pdf',
        url: '/documents/rg.pdf',
        status: 'valid'
      }
    ],
    bankInfo: {
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: '12345-6',
      type: 'Corrente'
    }
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<BrokerProfile['documents'][0] | null>(null);

  const handleAddSpecialty = () => {
    if (newSpecialty && !profile.specialties.includes(newSpecialty)) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty]
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleDocumentUpload = (file: File) => {
    // Implement document upload logic
    console.log('Uploading document:', file.name);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Seu Perfil</h2>
        <p className="text-gray-600">Gerencie suas informações, documentos e assinatura</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`pb-4 relative ${
              activeTab === 'personal'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dados Pessoais
            {activeTab === 'personal' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-4 relative ${
              activeTab === 'subscription'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assinatura
            {activeTab === 'subscription' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </nav>
      </div>

      {/* Personal Information */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-600">CRECI {profile.creci}</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-6">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CRECI
                </label>
                <input
                  type="text"
                  value={profile.creci}
                  onChange={(e) => setProfile(prev => ({ ...prev, creci: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-6">Especialidades</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Nova especialidade"
                />
                <button
                  onClick={handleAddSpecialty}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    <span>{specialty}</span>
                    <button
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-6">Disponibilidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dias da Semana
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profile.availability.days.join(', ')}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        days: e.target.value.split(',').map(d => d.trim())
                      }
                    }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário
                </label>
                <input
                  type="text"
                  value={profile.availability.hours}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      hours: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-6">Dados Bancários</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco
                </label>
                <input
                  type="text"
                  value={profile.bankInfo.bank}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo,
                      bank: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  value={profile.bankInfo.agency}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo,
                      agency: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta
                </label>
                <input
                  type="text"
                  value={profile.bankInfo.account}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo,
                      account: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Conta
                </label>
                <select
                  value={profile.bankInfo.type}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    bankInfo: {
                      ...prev.bankInfo,
                      type: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="Corrente">Corrente</option>
                  <option value="Poupança">Poupança</option>
                </select>
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
                <Plus className="w-5 h-5" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="space-y-4">
              {profile.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      {doc.validUntil && (
                        <p className="text-sm text-gray-500">
                          Válido até {new Date(doc.validUntil).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Visualizar
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-6">Redes Sociais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="@seuusuario"
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="linkedin.com/in/seuusuario"
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Pessoal
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="www.seusite.com.br"
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Modal */}
          {showDocumentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Upload de Documento</h3>
                  <button
                    onClick={() => setShowDocumentModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-gray-400 mb-4" />
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
                      <option value="creci">CRECI</option>
                      <option value="rg">RG</option>
                      <option value="cpf">CPF</option>
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
                    onClick={() => setShowDocumentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowDocumentModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <BrokerSubscription />
      )}
    </div>
  );
}