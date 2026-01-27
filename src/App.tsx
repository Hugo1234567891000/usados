import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Properties from './pages/Properties';
import PropertyPage from './pages/PropertyPage';
import SimulationPage from './pages/SimulationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminDeveloperApproval from './pages/AdminDeveloperApproval';
import AdminPropertyApproval from './pages/AdminPropertyApproval';
import DeveloperRegistration from './pages/DeveloperRegistration';
import BrokerRegistration from './pages/BrokerRegistration';
import FinancialRegistration from './pages/FinancialRegistration';
import DeveloperPortal from './pages/DeveloperPortal';
import BrokerDashboard from './pages/BrokerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import FinancialPortal from './pages/FinancialPortal';
import BankPortal from './pages/BankPortal';

// Client pages  
import ClientHome from './pages/client/ClientHome';
import ClientFavorites from './pages/client/ClientFavorites';
import ClientProfile from './pages/client/ClientProfile';

// Developer pages
import DashboardHome from './pages/developer/DashboardHome';
import ProjectManagement from './pages/developer/ProjectManagement';
import ProjectsMap from './pages/developer/ProjectsMap';
import NewProject from './pages/developer/projects/NewProject';
import Houses from './pages/developer/projects/Houses';
import Rooms from './pages/developer/projects/Rooms';
import Lots from './pages/developer/projects/Lots';
import ReportsHome from './pages/developer/reports/ReportsHome';
import CompanySettings from './pages/developer/settings/CompanySettings';
import UsersManagement from './pages/developer/settings/UsersManagement';
import RolesManagement from './pages/developer/settings/RolesManagement';

// Broker pages
import BrokerVisitations from './pages/broker/BrokerVisitations';
import BrokerCommissions from './pages/broker/BrokerCommissions';
import BrokerProfile from './pages/broker/BrokerProfile';

// Financial pages
import FinancingRates from './pages/financeira/FinancingRates';
import FinancingProposals from './pages/financeira/FinancingProposals';
import FinancingSimulations from './pages/financeira/FinancingSimulations';
import FinancialDashboard from './pages/financeira/FinancialDashboard';

// Bank pages
import RatesConfiguration from './pages/bank/financing/RatesConfiguration';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
            <AuthModal />
          </>
        } />
        <Route path="/sobre" element={
          <>
            <Header />
            <About />
            <Footer />
            <AuthModal />
          </>
        } />
        <Route path="/contato" element={
          <>
            <Header />
            <Contact />
            <Footer />
            <AuthModal />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/imoveis" element={
          <>
            <Header />
            <Properties />
            <Footer />
            <AuthModal />
          </>
        } />
        <Route path="/imoveis/:id" element={
          <>
            <Header />
            <PropertyPage />
            <Footer />
            <AuthModal />
          </>
        } />
        <Route path="/simulacao" element={
          <>
            <Header />
            <SimulationPage />
            <Footer />
            <AuthModal />
          </>
        } />

        {/* Registration routes */}
        <Route path="/cadastro/construtora" element={<DeveloperRegistration />} />
        <Route path="/cadastro/corretor" element={<BrokerRegistration />} />
        <Route path="/cadastro/financeira" element={<FinancialRegistration />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route path="construtoras" element={<AdminDeveloperApproval />} />
          <Route path="empreendimentos" element={<AdminPropertyApproval />} />
          <Route path="corretores" element={<div>Corretores</div>} />
        </Route>

        {/* Developer routes */}
        <Route path="/developer/*" element={<DeveloperPortal />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/new" element={<NewProject />} />
          <Route path="projects/houses" element={<Houses />} />
          <Route path="projects/rooms" element={<Rooms />} />
          <Route path="projects/lots" element={<Lots />} />
          <Route path="projects/map" element={<ProjectsMap />} />
          <Route path="reports" element={<ReportsHome />} />
          <Route path="settings/company" element={<CompanySettings />} />
          <Route path="settings/users" element={<UsersManagement />} />
          <Route path="settings/roles" element={<RolesManagement />} />
        </Route>

        {/* Broker routes */}
        <Route path="/corretor/*" element={<BrokerDashboard />}>
          <Route path="dashboard" element={<div>Broker Dashboard</div>} />
          <Route path="visitas" element={<BrokerVisitations />} />
          <Route path="financeiro" element={<BrokerCommissions />} />
          <Route path="perfil" element={<BrokerProfile />} />
        </Route>

        {/* Client routes */}
        <Route path="/cliente/*" element={<ClientDashboard />}>
          <Route index element={<ClientHome />} />
          <Route path="favoritos" element={<ClientFavorites />} />
          <Route path="perfil" element={<ClientProfile />} />
        </Route>

        {/* Financial routes */}
        <Route path="/financeira/*" element={<FinancialPortal />}>
          <Route path="financiamento/taxas" element={<FinancingRates />} />
          <Route path="propostas" element={<FinancingProposals />} />
          <Route path="simulacoes" element={<FinancingSimulations />} />
          <Route path="dashboard" element={<FinancialDashboard />} />
        </Route>

        {/* Bank routes */}
        <Route path="/bank/*" element={<BankPortal />}>
          <Route path="financing/rates" element={<RatesConfiguration />} />
        </Route>
      </Routes>
    </div>
  );
}