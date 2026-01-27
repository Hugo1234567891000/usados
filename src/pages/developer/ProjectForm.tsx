import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { RealEstateProject } from '../../types/property';
import { useAutosave } from '../../hooks/useAutosave';
import { useFormValidation } from '../../hooks/useFormValidation';
import { Building2, MapPin, Calendar, Users, Plus, Image as ImageIcon, FileText, Save, Video, View as View360, X, Upload } from 'lucide-react';
import AmenitiesSelection from '../../components/project/AmenitiesSelection';
import { LocationMap } from '../../components/project/LocationMap';

// Project schema for validation
const projectSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    postalCode: z.string().regex(/^\d{5}-?\d{3}$/),
  }),
  status: z.enum(['preLaunch', 'underConstruction', 'completed']),
  completionDate: z.string().refine(date => {
    const today = new Date();
    const completion = new Date(date);
    return completion > today;
  }, { message: "Completion date must be in the future" }),
  totalUnits: z.number().positive(),
  description: z.string().max(500).optional(),
});

interface ProjectFormProps {
  initialData?: Partial<RealEstateProject>;
  onSave: (data: RealEstateProject) => Promise<void>;
}

interface FloorPlan {
  id: string;
  title: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parkingSpaces: number;
  price: number;
  description: string;
  media: {
    photos: File[];
    videos: File[];
    virtualTourUrl: string;
  };
  units: Unit[];
}

interface Unit {
  id: string;
  number: string;
  floor: number;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  area: {
    total: number;
    private: number;
  };
  media: {
    photos: File[];
    videos: File[];
    virtualTourUrl: string;
  };
}

export default function ProjectForm({ initialData, onSave }: ProjectFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RealEstateProject>>(initialData || {});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [securityItems, setSecurityItems] = useState<string[]>([]);
  const [commonAreaFinishes, setCommonAreaFinishes] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newSecurityItem, setNewSecurityItem] = useState('');
  const [newCommonAreaFinish, setNewCommonAreaFinish] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [location, setLocation] = useState({
    latitude: initialData?.address?.coordinates?.latitude || 0,
    longitude: initialData?.address?.coordinates?.longitude || 0
  });
  
  // Floor plans and units state
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState<number | null>(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number | null>(null);
  
  // Media state
  const [projectMedia, setProjectMedia] = useState({
    photos: [] as File[],
    videos: [] as File[],
    virtualTourUrl: '',
    brochure: null as File | null
  });
  
  const { validate, getFieldError, isValid } = useFormValidation({
    schema: projectSchema
  });

  const { saving, lastSaved, error: saveError } = useAutosave({
    data: formData,
    onSave: async (data) => {
      if (validate(data)) {
        await onSave(data as RealEstateProject);
      }
    }
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng });
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: { latitude: lat, longitude: lng }
      }
    }));
  };

  const handleAddSecurityItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSecurityItem.trim() && !securityItems.includes(newSecurityItem.trim())) {
      setSecurityItems([...securityItems, newSecurityItem.trim()]);
      setNewSecurityItem('');
    }
  };

  const handleAddCommonAreaFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommonAreaFinish.trim() && !commonAreaFinishes.includes(newCommonAreaFinish.trim())) {
      setCommonAreaFinishes([...commonAreaFinishes, newCommonAreaFinish.trim()]);
      setNewCommonAreaFinish('');
    }
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  // Floor plan handlers
  const handleAddFloorPlan = () => {
    const newFloorPlan: FloorPlan = {
      id: `fp-${Date.now()}`,
      title: '',
      bedrooms: 2,
      bathrooms: 1,
      area: 0,
      parkingSpaces: 1,
      price: 0,
      description: '',
      media: {
        photos: [],
        videos: [],
        virtualTourUrl: ''
      },
      units: []
    };
    setFloorPlans([...floorPlans, newFloorPlan]);
    setActiveFloorPlanIndex(floorPlans.length);
  };

  const handleUpdateFloorPlan = (index: number, field: keyof FloorPlan, value: any) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[index] = {
      ...updatedFloorPlans[index],
      [field]: value
    };
    setFloorPlans(updatedFloorPlans);
  };

  const handleFloorPlanMediaChange = (index: number, type: 'photos' | 'videos', files: FileList) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[index].media[type] = [...updatedFloorPlans[index].media[type], ...Array.from(files)];
    setFloorPlans(updatedFloorPlans);
  };

  const handleFloorPlanVirtualTourChange = (index: number, url: string) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[index].media.virtualTourUrl = url;
    setFloorPlans(updatedFloorPlans);
  };

  const handleRemoveFloorPlanMedia = (floorPlanIndex: number, type: 'photos' | 'videos', fileIndex: number) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[floorPlanIndex].media[type] = updatedFloorPlans[floorPlanIndex].media[type].filter((_, i) => i !== fileIndex);
    setFloorPlans(updatedFloorPlans);
  };

  // Unit handlers
  const handleAddUnit = (floorPlanIndex: number) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      number: '',
      floor: 1,
      price: floorPlans[floorPlanIndex].price,
      status: 'available',
      area: {
        total: floorPlans[floorPlanIndex].area,
        private: Math.floor(floorPlans[floorPlanIndex].area * 0.85)
      },
      media: {
        photos: [],
        videos: [],
        virtualTourUrl: ''
      }
    };
    
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[floorPlanIndex].units.push(newUnit);
    setFloorPlans(updatedFloorPlans);
    setActiveUnitIndex(updatedFloorPlans[floorPlanIndex].units.length - 1);
  };

  const handleUpdateUnit = (floorPlanIndex: number, unitIndex: number, field: string, value: any) => {
    const updatedFloorPlans = [...floorPlans];
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedFloorPlans[floorPlanIndex].units[unitIndex][parent][child] = value;
    } else {
      updatedFloorPlans[floorPlanIndex].units[unitIndex][field] = value;
    }
    
    setFloorPlans(updatedFloorPlans);
  };

  const handleUnitMediaChange = (floorPlanIndex: number, unitIndex: number, type: 'photos' | 'videos', files: FileList) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[floorPlanIndex].units[unitIndex].media[type] = [
      ...updatedFloorPlans[floorPlanIndex].units[unitIndex].media[type],
      ...Array.from(files)
    ];
    setFloorPlans(updatedFloorPlans);
  };

  const handleUnitVirtualTourChange = (floorPlanIndex: number, unitIndex: number, url: string) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[floorPlanIndex].units[unitIndex].media.virtualTourUrl = url;
    setFloorPlans(updatedFloorPlans);
  };

  const handleRemoveUnitMedia = (floorPlanIndex: number, unitIndex: number, type: 'photos' | 'videos', fileIndex: number) => {
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[floorPlanIndex].units[unitIndex].media[type] = 
      updatedFloorPlans[floorPlanIndex].units[unitIndex].media[type].filter((_, i) => i !== fileIndex);
    setFloorPlans(updatedFloorPlans);
  };

  // Project media handlers
  const handleProjectMediaChange = (type: 'photos' | 'videos' | 'brochure', files: FileList | File) => {
    if (type === 'brochure' && files instanceof File) {
      setProjectMedia(prev => ({
        ...prev,
        brochure: files
      }));
    } else if (files instanceof FileList) {
      setProjectMedia(prev => ({
        ...prev,
        [type]: [...prev[type], ...Array.from(files)]
      }));
    }
  };

  const handleRemoveProjectMedia = (type: 'photos' | 'videos' | 'brochure', index?: number) => {
    if (type === 'brochure') {
      setProjectMedia(prev => ({
        ...prev,
        brochure: null
      }));
    } else if (typeof index === 'number') {
      setProjectMedia(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const steps = [
    { number: 1, title: 'Informações Básicas' },
    { number: 2, title: 'Características' },
    { number: 3, title: 'Plantas' },
    { number: 4, title: 'Unidades' },
    { number: 5, title: 'Mídia' },
    { number: 6, title: 'Revisão' }
  ];

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map(({ number, title }) => (
            <div key={number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {number}
              </div>
              <span className="mt-2 text-sm">{title}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Autosave Indicator */}
      <div className="flex items-center justify-end gap-2 mb-4 text-sm">
        {saving ? (
          <span className="text-gray-500">Salvando...</span>
        ) : lastSaved ? (
          <span className="text-gray-500">
            Último salvamento: {new Date(lastSaved).toLocaleTimeString()}
          </span>
        ) : null}
        {saveError && (
          <span className="text-red-500">Erro ao salvar: {saveError.message}</span>
        )}
      </div>

      {/* Form Steps */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Empreendimento
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Ex: Residencial Vista Verde"
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'preLaunch'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="preLaunch">Lançamento</option>
                  <option value="underConstruction">Em Construção</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previsão de Entrega
                </label>
                <input
                  type="date"
                  value={formData.completionDate || ''}
                  onChange={(e) => handleChange('completionDate', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                {getFieldError('completionDate') && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError('completionDate')}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.address?.street || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    street: e.target.value
                  })}
                  className="col-span-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Rua"
                />
                <input
                  type="text"
                  value={formData.address?.number || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    number: e.target.value
                  })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Número"
                />
                <input
                  type="text"
                  value={formData.address?.complement || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    complement: e.target.value
                  })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Complemento"
                />
                <input
                  type="text"
                  value={formData.address?.neighborhood || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    neighborhood: e.target.value
                  })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Bairro"
                />
                <input
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    city: e.target.value
                  })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Cidade"
                />
                <input
                  type="text"
                  value={formData.address?.state || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    state: e.target.value.toUpperCase()
                  })}
                  maxLength={2}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="UF"
                />
                <input
                  type="text"
                  value={formData.address?.postalCode || ''}
                  onChange={(e) => handleChange('address', {
                    ...formData.address,
                    postalCode: e.target.value
                  })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="CEP"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localização no Mapa
              </label>
              <LocationMap 
                latitude={location.latitude} 
                longitude={location.longitude} 
                onLocationSelect={handleLocationSelect} 
              />
              <p className="mt-1 text-sm text-gray-500">
                Clique no mapa para definir a localização exata
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Descreva o empreendimento..."
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">
                {((formData.description?.length || 0) / 500) * 100}% do tamanho máximo
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de Unidades
              </label>
              <input
                type="number"
                value={formData.totalUnits || ''}
                onChange={(e) => handleChange('totalUnits', parseInt(e.target.value))}
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 2: Characteristics */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Características do Empreendimento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Torres/Blocos *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    min="1"
                    value={formData.buildingCount || '1'}
                    onChange={(e) => handleChange('buildingCount', parseInt(e.target.value))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Andares por Torre *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.floorsPerBuilding || '1'}
                  onChange={(e) => handleChange('floorsPerBuilding', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Total do Terreno (m²) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalLandArea || ''}
                  onChange={(e) => handleChange('totalLandArea', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="21321"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Total Construída (m²) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalBuiltArea || ''}
                  onChange={(e) => handleChange('totalBuiltArea', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="3213"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipos de Unidade *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Studio', '2 Quartos', '3 Quartos', '4 Quartos', '5 Quartos', 'Cobertura'].map((type) => (
                  <div 
                    key={type}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.unitTypes?.includes(type) 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      const currentTypes = formData.unitTypes || [];
                      const newTypes = currentTypes.includes(type)
                        ? currentTypes.filter(t => t !== type)
                        : [...currentTypes, type];
                      handleChange('unitTypes', newTypes);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Elevadores *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.elevatorCount || '2'}
                  onChange={(e) => handleChange('elevatorCount', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vagas de Garagem por Unidade *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.parkingSpacesPerUnit || ''}
                  onChange={(e) => handleChange('parkingSpacesPerUnit', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="213"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Itens de Segurança
              </label>
              <form onSubmit={handleAddSecurityItem} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSecurityItem}
                  onChange={(e) => setNewSecurityItem(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: Portaria 24h"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-2">
                {securityItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setSecurityItems(securityItems.filter((_, i) => i !== index))}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acabamentos das Áreas Comuns
              </label>
              <form onSubmit={handleAddCommonAreaFinish} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCommonAreaFinish}
                  onChange={(e) => setNewCommonAreaFinish(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: Piso em porcelanato"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonAreaFinishes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setCommonAreaFinishes(commonAreaFinishes.filter((_, i) => i !== index))}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificações
              </label>
              <form onSubmit={handleAddCertification} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: LEED Gold"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-2">
                {certifications.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <AmenitiesSelection 
                onChange={setSelectedAmenities} 
                initialSelected={selectedAmenities}
              />
            </div>
          </div>
        )}

        {/* Step 3: Floor Plans */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Plantas</h2>
              <button
                type="button"
                onClick={handleAddFloorPlan}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Planta</span>
              </button>
            </div>

            {floorPlans.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Nenhuma planta adicionada</p>
                <button
                  type="button"
                  onClick={handleAddFloorPlan}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar Planta
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {floorPlans.map((floorPlan, index) => (
                  <div key={floorPlan.id} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {floorPlan.title || `Planta ${index + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFloorPlans = floorPlans.filter((_, i) => i !== index);
                          setFloorPlans(updatedFloorPlans);
                          setActiveFloorPlanIndex(null);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Planta
                        </label>
                        <input
                          type="text"
                          value={floorPlan.title}
                          onChange={(e) => handleUpdateFloorPlan(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="Ex: Tipo A - 2 Dormitórios"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Área Total (m²)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={floorPlan.area || ''}
                          onChange={(e) => handleUpdateFloorPlan(index, 'area', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dormitórios
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={floorPlan.bedrooms || ''}
                          onChange={(e) => handleUpdateFloorPlan(index, 'bedrooms', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banheiros
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={floorPlan.bathrooms || ''}
                          onChange={(e) => handleUpdateFloorPlan(index, 'bathrooms', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vagas de Garagem
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={floorPlan.parkingSpaces || ''}
                          onChange={(e) => handleUpdateFloorPlan(index, 'parkingSpaces', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preço Base
                        </label>
                        <input
                          type="text"
                          value={floorPlan.price ? formatCurrency(floorPlan.price) : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '');
                            const value = numericValue ? parseInt(numericValue) / 100 : 0;
                            handleUpdateFloorPlan(index, 'price', value);
                          }}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={floorPlan.description || ''}
                        onChange={(e) => handleUpdateFloorPlan(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Descreva esta planta..."
                      />
                    </div>

                    {/* Floor Plan Media Section */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Mídia da Planta</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Photos */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fotos
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="flex flex-col items-center">
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-4">Adicione fotos da planta</p>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleFloorPlanMediaChange(index, 'photos', e.target.files);
                                  }
                                }}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                              />
                            </div>
                            
                            {floorPlan.media.photos.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">
                                  {floorPlan.media.photos.length} fotos selecionadas
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  {floorPlan.media.photos.map((photo, photoIndex) => (
                                    <div key={photoIndex} className="relative group">
                                      <img
                                        src={URL.createObjectURL(photo)}
                                        alt={`Planta ${index + 1} - Foto ${photoIndex + 1}`}
                                        className="w-full h-20 object-cover rounded-lg"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFloorPlanMedia(index, 'photos', photoIndex)}
                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Videos */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vídeos
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="flex flex-col items-center">
                              <Video className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-4">Adicione vídeos da planta</p>
                              <input
                                type="file"
                                multiple
                                accept="video/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleFloorPlanMediaChange(index, 'videos', e.target.files);
                                  }
                                }}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                              />
                            </div>
                            
                            {floorPlan.media.videos.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">
                                  {floorPlan.media.videos.length} vídeos selecionados
                                </p>
                                <div className="space-y-2">
                                  {floorPlan.media.videos.map((video, videoIndex) => (
                                    <div key={videoIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                      <span className="text-sm truncate">{video.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFloorPlanMedia(index, 'videos', videoIndex)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Virtual Tour */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tour Virtual
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <View360 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="url"
                              value={floorPlan.media.virtualTourUrl || ''}
                              onChange={(e) => handleFloorPlanVirtualTourChange(index, e.target.value)}
                              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              placeholder="URL do tour virtual (ex: Matterport, etc)"
                            />
                          </div>
                          {floorPlan.media.virtualTourUrl && (
                            <a
                              href={floorPlan.media.virtualTourUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Visualizar
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Units */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Unidades</h2>
            
            {floorPlans.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Você precisa adicionar plantas antes de adicionar unidades</p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ir para Plantas
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {floorPlans.map((floorPlan, floorPlanIndex) => (
                  <div key={floorPlan.id} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {floorPlan.title || `Planta ${floorPlanIndex + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleAddUnit(floorPlanIndex)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Nova Unidade</span>
                      </button>
                    </div>

                    {floorPlan.units.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">Nenhuma unidade adicionada para esta planta</p>
                        <button
                          type="button"
                          onClick={() => handleAddUnit(floorPlanIndex)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Adicionar Unidade
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {floorPlan.units.map((unit, unitIndex) => (
                          <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">
                                {unit.number ? `Unidade ${unit.number}` : `Unidade ${unitIndex + 1}`}
                              </h4>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedFloorPlans = [...floorPlans];
                                  updatedFloorPlans[floorPlanIndex].units = updatedFloorPlans[floorPlanIndex].units.filter((_, i) => i !== unitIndex);
                                  setFloorPlans(updatedFloorPlans);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Número da Unidade
                                </label>
                                <input
                                  type="text"
                                  value={unit.number || ''}
                                  onChange={(e) => handleUpdateUnit(floorPlanIndex, unitIndex, 'number', e.target.value)}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                  placeholder="Ex: 101"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Andar
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={unit.floor || ''}
                                  onChange={(e) => handleUpdateUnit(floorPlanIndex, unitIndex, 'floor', parseInt(e.target.value))}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Preço
                                </label>
                                <input
                                  type="text"
                                  value={unit.price ? formatCurrency(unit.price) : ''}
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, '');
                                    const value = numericValue ? parseInt(numericValue) / 100 : 0;
                                    handleUpdateUnit(floorPlanIndex, unitIndex, 'price', value);
                                  }}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                  placeholder="R$ 0,00"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={unit.status || 'available'}
                                  onChange={(e) => handleUpdateUnit(floorPlanIndex, unitIndex, 'status', e.target.value)}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                >
                                  <option value="available">Disponível</option>
                                  <option value="reserved">Reservada</option>
                                  <option value="sold">Vendida</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Área Total (m²)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={unit.area?.total || ''}
                                  onChange={(e) => handleUpdateUnit(floorPlanIndex, unitIndex, 'area.total', parseInt(e.target.value))}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Área Privativa (m²)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={unit.area?.private || ''}
                                  onChange={(e) => handleUpdateUnit(floorPlanIndex, unitIndex, 'area.private', parseInt(e.target.value))}
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                            </div>

                            {/* Unit Media Section */}
                            <div className="mt-4 pt-4 border-t">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">Mídia da Unidade</h5>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Photos */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Fotos
                                  </label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                                    <div className="flex flex-col items-center">
                                      <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                                      <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                            handleUnitMediaChange(floorPlanIndex, unitIndex, 'photos', e.target.files);
                                          }
                                        }}
                                        className="block w-full text-xs text-gray-500
                                          file:mr-2 file:py-1 file:px-3
                                          file:rounded-full file:border-0
                                          file:text-xs file:font-semibold
                                          file:bg-blue-50 file:text-blue-700
                                          hover:file:bg-blue-100"
                                      />
                                    </div>
                                    
                                    {unit.media.photos.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-600 mb-1">
                                          {unit.media.photos.length} fotos
                                        </p>
                                        <div className="grid grid-cols-3 gap-1">
                                          {unit.media.photos.map((photo, photoIndex) => (
                                            <div key={photoIndex} className="relative group">
                                              <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Unidade ${unit.number} - Foto ${photoIndex + 1}`}
                                                className="w-full h-12 object-cover rounded-lg"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveUnitMedia(floorPlanIndex, unitIndex, 'photos', photoIndex)}
                                                className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Videos */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Vídeos
                                  </label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                                    <div className="flex flex-col items-center">
                                      <Video className="w-6 h-6 text-gray-400 mb-2" />
                                      <input
                                        type="file"
                                        multiple
                                        accept="video/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                            handleUnitMediaChange(floorPlanIndex, unitIndex, 'videos', e.target.files);
                                          }
                                        }}
                                        className="block w-full text-xs text-gray-500
                                          file:mr-2 file:py-1 file:px-3
                                          file:rounded-full file:border-0
                                          file:text-xs file:font-semibold
                                          file:bg-blue-50 file:text-blue-700
                                          hover:file:bg-blue-100"
                                      />
                                    </div>
                                    
                                    {unit.media.videos.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-600">
                                          {unit.media.videos.length} vídeos
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Virtual Tour */}
                              <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Tour Virtual
                                </label>
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <View360 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                      type="url"
                                      value={unit.media.virtualTourUrl || ''}
                                      onChange={(e) => handleUnitVirtualTourChange(floorPlanIndex, unitIndex, e.target.value)}
                                      className="pl-9 w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                      placeholder="URL do tour virtual"
                                    />
                                  </div>
                                  {unit.media.virtualTourUrl && (
                                    <a
                                      href={unit.media.virtualTourUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                      Visualizar
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Media */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Mídia do Empreendimento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos do Empreendimento
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-4">Adicione fotos do empreendimento</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleProjectMediaChange('photos', e.target.files);
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {projectMedia.photos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {projectMedia.photos.length} fotos selecionadas
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {projectMedia.photos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Foto ${photoIndex + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveProjectMedia('photos', photoIndex)}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Videos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vídeos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    <Video className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-4">Adicione vídeos do empreendimento</p>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleProjectMediaChange('videos', e.target.files);
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {projectMedia.videos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {projectMedia.videos.length} vídeos selecionados
                      </p>
                      <div className="space-y-2">
                        {projectMedia.videos.map((video, videoIndex) => (
                          <div key={videoIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                            <span className="text-sm truncate">{video.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProjectMedia('videos', videoIndex)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Virtual Tour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Virtual
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <View360 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={projectMedia.virtualTourUrl || ''}
                    onChange={(e) => setProjectMedia(prev => ({ ...prev, virtualTourUrl: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="URL do tour virtual (ex: Matterport, etc)"
                  />
                </div>
                {projectMedia.virtualTourUrl && (
                  <a
                    href={projectMedia.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visualizar
                  </a>
                )}
              </div>
            </div>
            
            {/* Brochure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brochura / Material de Vendas
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <FileText className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-4">Adicione o material de vendas (PDF)</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProjectMediaChange('brochure', e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                
                {projectMedia.brochure && (
                  <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm">{projectMedia.brochure.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProjectMedia('brochure')}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Revisão e Envio</h2>
            <p className="text-gray-600">Revise todas as informações antes de finalizar o cadastro do empreendimento.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nome do Empreendimento</p>
                    <p className="font-medium">{formData.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">
                      {formData.status === 'preLaunch' ? 'Lançamento' : 
                       formData.status === 'underConstruction' ? 'Em Construção' : 
                       formData.status === 'completed' ? 'Concluído' : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Previsão de Entrega</p>
                    <p className="font-medium">
                      {formData.completionDate ? new Date(formData.completionDate).toLocaleDateString('pt-BR') : 'Não informada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Unidades</p>
                    <p className="font-medium">{formData.totalUnits || 'Não informado'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <p className="font-medium">
                  {formData.address?.street ? `${formData.address.street}, ${formData.address.number}` : 'Endereço não informado'}
                  {formData.address?.complement && ` - ${formData.address.complement}`}
                  {formData.address?.neighborhood && `, ${formData.address.neighborhood}`}
                  {formData.address?.city && `, ${formData.address.city}`}
                  {formData.address?.state && ` - ${formData.address.state}`}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Características</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Torres/Blocos</p>
                    <p className="font-medium">{formData.buildingCount || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Andares por Torre</p>
                    <p className="font-medium">{formData.floorsPerBuilding || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Área Total do Terreno</p>
                    <p className="font-medium">{formData.totalLandArea ? `${formData.totalLandArea}m²` : 'Não informada'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Área Total Construída</p>
                    <p className="font-medium">{formData.totalBuiltArea ? `${formData.totalBuiltArea}m²` : 'Não informada'}</p>
                  </div>
                </div>
                
                {selectedAmenities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <span key={amenity} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {amenity.replace(/^custom-/, '').replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Plantas e Unidades</h3>
                <p className="text-sm text-gray-600 mb-2">Total de Plantas: {floorPlans.length}</p>
                
                {floorPlans.map((floorPlan, index) => (
                  <div key={floorPlan.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{floorPlan.title || `Planta ${index + 1}`}</p>
                    <div className="grid grid-cols-4 gap-2 mt-1 text-sm">
                      <div>
                        <span className="text-gray-600">Área:</span> {floorPlan.area}m²
                      </div>
                      <div>
                        <span className="text-gray-600">Quartos:</span> {floorPlan.bedrooms}
                      </div>
                      <div>
                        <span className="text-gray-600">Banheiros:</span> {floorPlan.bathrooms}
                      </div>
                      <div>
                        <span className="text-gray-600">Vagas:</span> {floorPlan.parkingSpaces}
                      </div>
                    </div>
                    <p className="text-sm mt-1">
                      <span className="text-gray-600">Preço Base:</span> {formatCurrency(floorPlan.price)}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-600">Unidades:</span> {floorPlan.units.length}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Mídia</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Fotos</p>
                    <p className="font-medium">{projectMedia.photos.length} fotos</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vídeos</p>
                    <p className="font-medium">{projectMedia.videos.length} vídeos</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tour Virtual</p>
                    <p className="font-medium">{projectMedia.virtualTourUrl ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Material de Vendas</p>
                    <p className="font-medium">{projectMedia.brochure ? 'Sim' : 'Não'}</p>
                  </div>
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
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          )}
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                validate(formData);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Rascunho
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finalizar Cadastro
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}