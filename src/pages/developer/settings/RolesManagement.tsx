import React, { useState } from 'react';
import { Shield, Plus, X, Check } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'projects' | 'commercial' | 'financial' | 'reports';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function RolesManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Example permissions data
  const permissions: Permission[] = [
    {
      id: 'projects.view',
      name: 'Visualizar Empreendimentos',
      description: 'Permite visualizar todos os empreendimentos',
      category: 'projects'
    },
    {
      id: 'projects.edit',
      name: 'Editar Empreendimentos',
      description: 'Permite criar e editar empreendimentos',
      category: 'projects'
    },
    {
      id: 'commercial.view',
      name: 'Visualizar Vendas',
      description: 'Permite visualizar vendas e propostas',
      category: 'commercial'
    },
    {
      id: 'commercial.edit',
      name: 'Gerenciar Vendas',
      description: 'Permite gerenciar vendas e propostas',
      category: 'commercial'
    },
    {
      id: 'financial.view',
      name: 'Visualizar Financeiro',
      description: 'Permite visualizar informações financeiras',
      category: 'financial'
    },
    {
      id: 'financial.edit',
      name: 'Gerenciar Financeiro',
      description: 'Permite gerenciar informações financeiras',
      category: 'financial'
    },
    {
      id: 'reports.view',
      name: 'Visualizar Relatórios',
      description: 'Permite visualizar relatórios',
      category: 'reports'
    },
    {
      id: 'reports.generate',
      name: 'Gerar Relatórios',
      description: 'Permite gerar e agendar relatórios',
      category: 'reports'
    }
  ];

  // Example roles data
  const roles: Role[] = [
    {
      id: '1',
      name: 'Administrador',
      description: 'Acesso completo ao sistema',
      permissions: permissions.map(p => p.id)
    },
    {
      id: '2',
      name: 'Gerente Comercial',
      description: 'Gerenciamento de vendas e propostas',
      permissions: ['projects.view', 'commercial.view', 'commercial.edit', 'reports.view']
    },
    {
      id: '3',
      name: 'Gerente Financeiro',
      description: 'Gerenciamento financeiro',
      permissions: ['projects.view', 'financial.view', 'financial.edit', 'reports.view']
    }
  ];

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement role addition logic
    console.log('Adding role:', newRole);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Perfis de Acesso</h2>
          <p className="text-sm text-gray-500">Gerencie os perfis de acesso e suas permissões</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Perfil</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Permissões:</p>
              <div className="space-y-1">
                {role.permissions.map(permissionId => {
                  const permission = permissions.find(p => p.id === permissionId);
                  return permission ? (
                    <div
                      key={permissionId}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{permission.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedRole(role)}
                className="text-blue-600 hover:text-blue-800"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {selectedRole ? 'Editar Perfil' : 'Novo Perfil'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedRole(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddRole} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Perfil
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Permissões
                </label>
                <div className="space-y-6">
                  {(['projects', 'commercial', 'financial', 'reports'] as const).map(category => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {permissions
                          .filter(permission => permission.category === category)
                          .map(permission => (
                            <label
                              key={permission.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={newRole.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{permission.name}</p>
                                <p className="text-sm text-gray-500">{permission.description}</p>
                              </div>
                            </label>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedRole ? 'Salvar Alterações' : 'Criar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}