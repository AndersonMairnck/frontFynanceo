import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClienteListPage from '../pages/clientes/ClienteListPage';
import ClienteFormPage from '../pages/clientes/ClienteFormPage';
import ClienteDetailPage from '../pages/clientes/ClienteDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas de Clientes */}
      <Route path="/clientes" element={<ClienteListPage />} />
      <Route path="/clientes/novo" element={<ClienteFormPage />} />
      <Route path="/clientes/editar/:id" element={<ClienteFormPage />} />
      <Route path="/clientes/:id" element={<ClienteDetailPage />} />
      
      {/* Rota padrão - redireciona para clientes */}
      <Route path="/" element={<Navigate to="/clientes" replace />} />
      
      {/* Rota 404 */}
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;