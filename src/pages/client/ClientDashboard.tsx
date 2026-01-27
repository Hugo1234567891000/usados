@@ .. @@
             <Link
               to="/cliente/financiamento"
               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                 isActive('/cliente/financiamento')
                   ? 'bg-blue-600 text-white'
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               <DollarSign className="w-5 h-5" />
               <span>Financiamento</span>
             </Link>
-            <Link
-              to="/cliente/corretor"
-              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
-                isActive('/cliente/corretor')
-                  ? 'bg-blue-600 text-white'
-                  : 'text-gray-600 hover:bg-gray-100'
-              }`}
-            >
-              <MessageSquare className="w-5 h-5" />
-              <span>Seu Corretor</span>
-            </Link>
             <Link
               to="/cliente/perfil"
               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                 isActive('/cliente/perfil')
                   ? 'bg-blue-600 text-white'
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               <Settings className="w-5 h-5" />
               <span>Configurações</span>
             </Link>