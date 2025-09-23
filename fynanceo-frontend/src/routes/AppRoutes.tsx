import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LazyLoad } from '../components/common/LazyLoad';

// Páginas principais
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));
const ClienteListPage = React.lazy(() => import('../pages/clientes/ClienteListPage'));
const ClienteFormPage = React.lazy(() => import('../pages/clientes/ClienteFormPage'));
const ClienteDetailPage = React.lazy(() => import('../pages/clientes/ClienteDetailPage'));
const PlaceholderPage = React.lazy(() => import('../pages/PlaceholderPage'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota principal */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <LazyLoad>
            <DashboardPage />
          </LazyLoad>
        } 
      />
      
      {/* Clientes */}
      <Route 
        path="/clientes" 
        element={
          <LazyLoad>
            <ClienteListPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/clientes/novo" 
        element={
          <LazyLoad>
            <ClienteFormPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/clientes/editar/:id" 
        element={
          <LazyLoad>
            <ClienteFormPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/clientes/:id" 
        element={
          <LazyLoad>
            <ClienteDetailPage />
          </LazyLoad>
        } 
      />
      
      {/* Outros módulos (placeholders) */}
      <Route 
        path="/pdv" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Ponto de Venda" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/produtos" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Produtos" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/produtos/categorias" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Categorias de Produtos" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/produtos/estoque" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Controle de Estoque" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/vendas" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Histórico de Vendas" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/vendas/relatorios" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Relatórios de Vendas" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/relatorios" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Relatórios" />
          </LazyLoad>
        } 
      />
      <Route 
        path="/configuracoes" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Configurações" />
          </LazyLoad>
        } 
      />
      
      {/* Rota 404 */}
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;