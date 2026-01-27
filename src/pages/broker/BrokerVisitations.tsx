import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Mail, Plus, X, Check, AlertTriangle, ChevronDown, ChevronUp, Search, Filter, Download, Bell } from 'lucide-react';

interface Visitation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyName: string;
  propertyAddress: string;
  propertyUnit?: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'noShow';
  notes?: string;
  followUpDate?: string;
  notificationSent?: boolean;
  reminderSent?: boolean;
}

interface Notification {
  id: string;
  type: 'reminder' | 'upcoming';
  visitationId: string;
  message: string;
  date: string;
  read: boolean;
}

export default function BrokerVisitations() {
  const location = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisitation, setSelectedVisitation] = useState<Visitation | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    dateRange: 'upcoming',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newVisitation, setNewVisitation] = useState<Omit<Visitation, 'id'>>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    propertyName: '',
    propertyAddress: '',
    propertyUnit: '',
    date: '',
    time: '',
    status: 'scheduled',
    notes: ''
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if we're coming from the chat with pre-filled data
  useEffect(() => {
    if (location.state?.scheduleVisit) {
      const { clientData, propertyData, chatId } = location.state;
      
      setNewVisitation({
        clientName: clientData.name || '',
        clientEmail: clientData.email || '',
        clientPhone: clientData.phone || '',
        propertyName: propertyData.name || '',
        propertyAddress: propertyData.address || '',
        propertyUnit: propertyData.unit || '',
        date: '',
        time: '',
        status: 'scheduled',
        notes: ''
      });
      
      setShowAddModal(true);
    }
  }, [location.state]);

  // Example visitations data - now using state to allow adding new visitations
  const [visitations, setVisitations] = useState<Visitation[]>([
    {
      id: '1',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      clientPhone: '(11) 99999-9999',
      propertyName: 'Edifício Horizonte - Moema',
      propertyAddress: 'Alameda dos Anapurus, 1000 - Moema, São Paulo',
      propertyUnit: '101',
      date: '2024-04-15',
      time: '14:00',
      status: 'scheduled',
      notes: 'Cliente interessado em apartamentos de 2 dormitórios'
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      clientEmail: 'maria.santos@email.com',
      clientPhone: '(11) 98888-8888',
      propertyName: 'Residencial Jardins - Pinheiros',
      propertyAddress: 'Rua dos Pinheiros, 1500 - Pinheiros, São Paulo',
      propertyUnit: '201',
      date: '2024-04-10',
      time: '10:00',
      status: 'completed',
      notes: 'Cliente gostou do imóvel, vai pensar sobre a proposta',
      followUpDate: '2024-04-17'
    },
    {
      id: '3',
      clientName: 'Pedro Almeida',
      clientEmail: 'pedro.almeida@email.com',
      clientPhone: '(11) 97777-7777',
      propertyName: 'Vila Verde - Alto de Pinheiros',
      propertyAddress: 'Rua Natingui, 1000 - Alto de Pinheiros, São Paulo',
      date: '2024-04-05',
      time: '16:00',
      status: 'cancelled',
      notes: 'Cliente cancelou por motivos pessoais'
    },
    {
      id: '4',
      clientName: 'Ana Pereira',
      clientEmail: 'ana.pereira@email.com',
      clientPhone: '(11) 96666-6666',
      propertyName: 'Parque Cidade Jardim - Morumbi',
      propertyAddress: 'Rua Cidade Jardim, 500 - Morumbi, São Paulo',
      propertyUnit: '1001',
      date: '2024-04-03',
      time: '11:00',
      status: 'noShow',
      notes: 'Cliente não compareceu, tentar contato novamente'
    }
  ]);

  // Load visitations from localStorage on component mount
  useEffect(() => {
    const savedVisitations = localStorage.getItem('brokerVisitations');
    if (savedVisitations) {
      try {
        setVisitations(JSON.parse(savedVisitations));
      } catch (error) {
        console.error('Error parsing saved visitations:', error);
      }
    }
    
    const savedNotifications = localStorage.getItem('brokerNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
      }
    }
  }, []);

  // Save visitations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('brokerVisitations', JSON.stringify(visitations));
  }, [visitations]);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('brokerNotifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Check for upcoming visitations and create notifications
  useEffect(() => {
    const checkUpcomingVisitations = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      visitations.forEach(visitation => {
        if (visitation.status !== 'scheduled') return;
        
        const visitDate = new Date(visitation.date);
        visitDate.setHours(0, 0, 0, 0);
        
        // Check if visit is tomorrow and notification hasn't been sent
        if (visitDate.getTime() === tomorrow.getTime() && !visitation.notificationSent) {
          // Create notification for broker
          const newNotification: Notification = {
            id: `notif-${Date.now()}-${visitation.id}`,
            type: 'upcoming',
            visitationId: visitation.id,
            message: `Lembrete: Visita agendada amanhã com ${visitation.clientName} às ${visitation.time} no empreendimento ${visitation.propertyName}`,
            date: new Date().toISOString(),
            read: false
          };
          
          setNotifications(prev => [...prev, newNotification]);
          
          // Mark notification as sent
          setVisitations(prev => 
            prev.map(v => 
              v.id === visitation.id ? { ...v, notificationSent: true } : v
            )
          );
          
          // Simulate sending email to client
          console.log(`Email enviado para ${visitation.clientEmail}: Lembrete de visita agendada para amanhã às ${visitation.time} no empreendimento ${visitation.propertyName}`);
          
          // Simulate sending SMS to client
          console.log(`SMS enviado para ${visitation.clientPhone}: Lembrete: Sua visita ao ${visitation.propertyName} está agendada para amanhã às ${visitation.time}`);
        }
        
        // Check if visit is today (morning) and reminder hasn't been sent
        const now = new Date();
        const visitDateTime = new Date(visitation.date + 'T' + visitation.time);
        const timeDiff = visitDateTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // If visit is today and within 2-4 hours and reminder hasn't been sent
        if (
          visitDate.getTime() === today.getTime() && 
          hoursDiff > 0 && 
          hoursDiff <= 4 && 
          !visitation.reminderSent
        ) {
          // Create reminder notification for broker
          const reminderNotification: Notification = {
            id: `reminder-${Date.now()}-${visitation.id}`,
            type: 'reminder',
            visitationId: visitation.id,
            message: `LEMBRETE URGENTE: Visita com ${visitation.clientName} hoje às ${visitation.time} no empreendimento ${visitation.propertyName}`,
            date: new Date().toISOString(),
            read: false
          };
          
          setNotifications(prev => [...prev, reminderNotification]);
          
          // Mark reminder as sent
          setVisitations(prev => 
            prev.map(v => 
              v.id === visitation.id ? { ...v, reminderSent: true } : v
            )
          );
          
          // Simulate sending last minute reminder to client
          console.log(`Email de lembrete final enviado para ${visitation.clientEmail}: Sua visita ao ${visitation.propertyName} está agendada para hoje às ${visitation.time}`);
          
          // Simulate sending SMS reminder to client
          console.log(`SMS de lembrete final enviado para ${visitation.clientPhone}: Lembrete: Sua visita ao ${visitation.propertyName} é hoje às ${visitation.time}`);
        }
      });
    };
    
    // Check immediately on component mount
    checkUpcomingVisitations();
    
    // Then check every hour
    const interval = setInterval(checkUpcomingVisitations, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [visitations]);

  // Filter visitations based on filters
  const filteredVisitations = visitations.filter(visitation => {
    const matchesStatus = filter.status === 'all' || visitation.status === filter.status;
    const matchesSearch = filter.search === '' || 
      visitation.clientName.toLowerCase().includes(filter.search.toLowerCase()) ||
      visitation.propertyName.toLowerCase().includes(filter.search.toLowerCase()) ||
      (visitation.propertyUnit && visitation.propertyUnit.toLowerCase().includes(filter.search.toLowerCase()));
    
    // Date range filtering
    const visitationDate = new Date(visitation.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let matchesDateRange = true;
    if (filter.dateRange === 'today') {
      const todayEnd = new Date(today);
      todayEnd.setDate(today.getDate() + 1);
      matchesDateRange = visitationDate >= today && visitationDate < todayEnd;
    } else if (filter.dateRange === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setDate(tomorrow.getDate() + 1);
      matchesDateRange = visitationDate >= tomorrow && visitationDate < tomorrowEnd;
    } else if (filter.dateRange === 'week') {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      matchesDateRange = visitationDate >= today && visitationDate < weekEnd;
    } else if (filter.dateRange === 'upcoming') {
      matchesDateRange = visitationDate >= today;
    } else if (filter.dateRange === 'past') {
      matchesDateRange = visitationDate < today;
    }
    
    return matchesStatus && matchesSearch && matchesDateRange;
  }).sort((a, b) => {
    // Sort by date (newest first for past, oldest first for upcoming)
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    
    if (filter.dateRange === 'past') {
      return dateB.getTime() - dateA.getTime();
    }
    return dateA.getTime() - dateB.getTime();
  });

  const getStatusColor = (status: Visitation['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'noShow':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: Visitation['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'completed':
        return 'Realizada';
      case 'cancelled':
        return 'Cancelada';
      case 'noShow':
        return 'Não Compareceu';
    }
  };

  const handleAddVisitation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newVisitation.clientName || !newVisitation.propertyName || !newVisitation.date || !newVisitation.time) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Generate a unique ID
    const newId = Date.now().toString();
    
    // Add the new visitation to the state
    const visitationToAdd: Visitation = {
      id: newId,
      ...newVisitation
    };
    
    setVisitations(prev => [...prev, visitationToAdd]);
    
    // Create confirmation notification
    const confirmationNotification: Notification = {
      id: `conf-${Date.now()}`,
      type: 'upcoming',
      visitationId: newId,
      message: `Nova visita agendada com ${newVisitation.clientName} para ${formatDate(newVisitation.date)} às ${newVisitation.time}`,
      date: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [...prev, confirmationNotification]);
    
    // If this visitation was scheduled from a chat, store confirmation for that chat
    if (location.state?.chatId) {
      localStorage.setItem('scheduledVisitConfirmation', JSON.stringify({
        chatId: location.state.chatId,
        date: newVisitation.date,
        time: newVisitation.time,
        propertyName: newVisitation.propertyName,
        clientName: newVisitation.clientName
      }));
      
      // Clear the location state to prevent the form from being pre-filled again
      window.history.replaceState({}, document.title);
    }
    
    // Simulate sending confirmation email to client
    console.log(`Email de confirmação enviado para ${newVisitation.clientEmail}: Sua visita ao ${newVisitation.propertyName} foi agendada para ${formatDate(newVisitation.date)} às ${newVisitation.time}`);
    
    // Simulate sending confirmation SMS to client
    console.log(`SMS de confirmação enviado para ${newVisitation.clientPhone}: Confirmação: Sua visita ao ${newVisitation.propertyName} está agendada para ${formatDate(newVisitation.date)} às ${newVisitation.time}`);
    
    // Reset form and close modal
    setNewVisitation({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      propertyName: '',
      propertyAddress: '',
      propertyUnit: '',
      date: '',
      time: '',
      status: 'scheduled',
      notes: ''
    });
    
    setShowAddModal(false);
  };

  const handleUpdateVisitationStatus = (id: string, newStatus: Visitation['status'], followUpDate?: string) => {
    setVisitations(prev => 
      prev.map(visitation => 
        visitation.id === id 
          ? { ...visitation, status: newStatus, ...(followUpDate && { followUpDate }) } 
          : visitation
      )
    );
    
    // Create status update notification
    const visitation = visitations.find(v => v.id === id);
    if (visitation) {
      const statusNotification: Notification = {
        id: `status-${Date.now()}`,
        type: 'upcoming',
        visitationId: id,
        message: `Visita com ${visitation.clientName} foi marcada como ${getStatusText(newStatus).toLowerCase()}`,
        date: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [...prev, statusNotification]);
      
      // Simulate sending status update email to client
      console.log(`Email de atualização enviado para ${visitation.clientEmail}: Sua visita ao ${visitation.propertyName} foi ${getStatusText(newStatus).toLowerCase()}`);
      
      // If status is completed, send follow-up email
      if (newStatus === 'completed') {
        console.log(`Email de acompanhamento enviado para ${visitation.clientEmail}: Obrigado por visitar o ${visitation.propertyName}. Gostaríamos de saber suas impressões.`);
      }
    }
    
    setShowDetailsModal(false);
    setSelectedVisitation(null);
  };

  const handleViewDetails = (visitation: Visitation) => {
    setSelectedVisitation(visitation);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Agenda de Visitação</h2>
          <p className="text-gray-600">Gerencie suas visitas agendadas com clientes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Notificações</h3>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Nenhuma notificação
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${
                                notification.type === 'upcoming' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {notification.type === 'upcoming' ? (
                                  <Calendar className="w-4 h-4" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.date).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Agendar Visita</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por cliente ou imóvel..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="scheduled">Agendadas</option>
              <option value="completed">Realizadas</option>
              <option value="cancelled">Canceladas</option>
              <option value="noShow">Não Compareceu</option>
            </select>
            <select
              value={filter.dateRange}
              onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="upcoming">Próximas Visitas</option>
              <option value="today">Hoje</option>
              <option value="tomorrow">Amanhã</option>
              <option value="week">Esta Semana</option>
              <option value="past">Visitas Passadas</option>
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Mais Filtros</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Additional filters would go here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período Específico
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">De</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Até</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empreendimento
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="">Todos os Empreendimentos</option>
                  <option value="1">Edifício Horizonte - Moema</option>
                  <option value="2">Residencial Jardins - Pinheiros</option>
                  <option value="3">Vila Verde - Alto de Pinheiros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="date-asc">Data (mais próxima)</option>
                  <option value="date-desc">Data (mais distante)</option>
                  <option value="client">Nome do Cliente</option>
                  <option value="property">Nome do Imóvel</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setFilter({
                    status: 'all',
                    dateRange: 'upcoming',
                    search: ''
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visitations List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold">
            {filteredVisitations.length} {filteredVisitations.length === 1 ? 'visita encontrada' : 'visitas encontradas'}
          </h3>
        </div>
        
        {filteredVisitations.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma visita encontrada</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Não encontramos visitas com os filtros selecionados. Tente ajustar seus filtros ou agende uma nova visita.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredVisitations.map((visitation) => (
              <div
                key={visitation.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 rounded-full p-3">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{visitation.clientName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span>{visitation.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{visitation.clientPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{visitation.propertyName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{visitation.propertyAddress}</span>
                    </div>
                    {visitation.propertyUnit && (
                      <div className="text-sm text-gray-500">
                        Unidade: {visitation.propertyUnit}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(visitation.status)
                    }`}>
                      {getStatusText(visitation.status)}
                    </span>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(visitation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{visitation.time}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(visitation)}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Visitation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Agendar Nova Visita</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddVisitation} className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informações do Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={newVisitation.clientName}
                        onChange={(e) => setNewVisitation(prev => ({ ...prev, clientName: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Nome do cliente"
                        required
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
                        value={newVisitation.clientEmail}
                        onChange={(e) => setNewVisitation(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="email@exemplo.com"
                        required
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
                        value={newVisitation.clientPhone}
                        onChange={(e) => setNewVisitation(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informações do Imóvel</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empreendimento
                  </label>
                  <input
                    type="text"
                    value={newVisitation.propertyName}
                    onChange={(e) => setNewVisitation(prev => ({ ...prev, propertyName: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Nome do empreendimento"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={newVisitation.propertyAddress}
                      onChange={(e) => setNewVisitation(prev => ({ ...prev, propertyAddress: e.target.value }))}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Endereço completo"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade (opcional)
                  </label>
                  <input
                    type="text"
                    value={newVisitation.propertyUnit || ''}
                    onChange={(e) => setNewVisitation(prev => ({ ...prev, propertyUnit: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Número da unidade"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Data e Hora</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={newVisitation.date}
                        onChange={(e) => setNewVisitation(prev => ({ ...prev, date: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="time"
                        value={newVisitation.time}
                        onChange={(e) => setNewVisitation(prev => ({ ...prev, time: e.target.value }))}
                        className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={newVisitation.notes || ''}
                  onChange={(e) => setNewVisitation(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Informações adicionais sobre a visita..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agendar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitation Details Modal */}
      {showDetailsModal && selectedVisitation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Detalhes da Visita</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedVisitation(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Status da Visita</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(selectedVisitation.status)
                }`}>
                  {getStatusText(selectedVisitation.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data e Hora</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{formatDate(selectedVisitation.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{selectedVisitation.time}</span>
                    </div>
                  </div>
                </div>

                {selectedVisitation.followUpDate && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Acompanhamento</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{formatDate(selectedVisitation.followUpDate)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Imóvel</h4>
                <div className="space-y-2">
                  <p className="font-medium">{selectedVisitation.propertyName}</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{selectedVisitation.propertyAddress}</span>
                  </div>
                  {selectedVisitation.propertyUnit && (
                    <p className="text-gray-600">Unidade: {selectedVisitation.propertyUnit}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
                <div className="space-y-2">
                  <p className="font-medium">{selectedVisitation.clientName}</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{selectedVisitation.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{selectedVisitation.clientPhone}</span>
                  </div>
                </div>
              </div>

              {selectedVisitation.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedVisitation.notes}</p>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                {selectedVisitation.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateVisitationStatus(selectedVisitation.id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancelar Visita
                    </button>
                    <button 
                      onClick={() => handleUpdateVisitationStatus(selectedVisitation.id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Marcar como Realizada
                    </button>
                  </div>
                )}
                
                {(selectedVisitation.status === 'completed' || selectedVisitation.status === 'noShow') && (
                  <button 
                    onClick={() => {
                      // In a real app, you would open a modal to select a follow-up date
                      const followUpDate = new Date();
                      followUpDate.setDate(followUpDate.getDate() + 7);
                      handleUpdateVisitationStatus(
                        selectedVisitation.id, 
                        selectedVisitation.status, 
                        followUpDate.toISOString().split('T')[0]
                      );
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agendar Acompanhamento
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedVisitation(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}