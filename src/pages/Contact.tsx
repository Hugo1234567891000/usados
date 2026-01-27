import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Entre em Contato</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <div>
                  <p className="font-semibold">Telefone</p>
                  <p className="text-gray-600">(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" />
                <div>
                  <p className="font-semibold">E-mail</p>
                  <p className="text-gray-600">contato@imobiliaria.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="font-semibold">Endereço</p>
                  <p className="text-gray-600">Av. Paulista, 1000 - São Paulo, SP</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" />
                <div>
                  <p className="font-semibold">Horário de Funcionamento</p>
                  <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                  <p className="text-gray-600">Sábado: 9h às 13h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Envie uma Mensagem</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Enviar Mensagem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}