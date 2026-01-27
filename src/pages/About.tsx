import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Sobre a VHGold Imóveis</h1>
          <p className="text-gray-600 mb-6">
            Fundada com o compromisso de excelência no mercado imobiliário, a VHGold Imóveis se destaca 
            por oferecer um serviço personalizado e profissional a todos os seus clientes.
          </p>
          <p className="text-gray-600 mb-6">
            Nossa missão é encontrar o imóvel perfeito para cada cliente, seja para moradia ou investimento. 
            Contamos com uma equipe altamente qualificada e anos de experiência no mercado imobiliário.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <span>contato@imobiliaria.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" />
              <span>Av. Paulista, 1000 - São Paulo, SP</span>
            </div>
          </div>
        </div>
        <div className="relative h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" 
            alt="Office" 
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}