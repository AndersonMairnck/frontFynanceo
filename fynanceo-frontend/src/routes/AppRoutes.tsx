import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LazyLoad } from '../components/common/LazyLoad';
import PDVPage from '../pages/pdv/PDVPage';
import TableManagementPage from '../pages/orders/TableManagementPage'; // 🆕 NOVA PÁGINA

// Páginas principais
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));
const ClienteListPage = React.lazy(() => import('../pages/clientes/ClienteListPage'));
const ClienteFormPage = React.lazy(() => import('../pages/clientes/ClienteFormPage'));
const ClienteDetailPage = React.lazy(() => import('../pages/clientes/ClienteDetailPage'));
const PlaceholderPage = React.lazy(() => import('../pages/PlaceholderPage'));

// Novas páginas de produtos e categorias
const ProductListPage = React.lazy(() => import('../pages/produtos/ProductListPage'));
const ProductFormPage = React.lazy(() => import('../pages/produtos/ProductFormPage'));
const ProductDetailPage = React.lazy(() => import('../pages/produtos/ProductDetailPage'));
const CategoryListPage = React.lazy(() => import('../pages/categorias/CategoryListPage'));
const CategoryFormPage = React.lazy(() => import('../pages/categorias/CategoryFormPage'));

// NOVAS PÁGINAS DO MÓDULO DE PEDIDOS
const OrdersPage = React.lazy(() => import('../pages/orders/OrdersPage'));
const ActiveOrdersPage = React.lazy(() => import('../pages/orders/ActiveOrdersPage'));
const OrderHistoryPage = React.lazy(() => import('../pages/orders/OrderHistoryPage'));

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
      <Route path="/mesas" element={<TableManagementPage />} /> {/* 🆕 NOVA ROTA */}
      {/* Ponto de Venda */}
      <Route 
        path="/pdv" 
        element={
          <LazyLoad>
            <PDVPage />
          </LazyLoad>
        } 
      />

      {/* NOVO MÓDULO: PEDIDOS */}
      <Route 
        path="/pedidos" 
        element={
          <LazyLoad>
            <OrdersPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/pedidos/ativos" 
        element={
          <LazyLoad>
            <ActiveOrdersPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/pedidos/historico" 
        element={
          <LazyLoad>
            <OrderHistoryPage />
          </LazyLoad>
        } 
      />

      {/* Produtos */}
      <Route 
        path="/produtos" 
        element={
          <LazyLoad>
            <ProductListPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/produtos/novo" 
        element={
          <LazyLoad>
            <ProductFormPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/produtos/editar/:id" 
        element={
          <LazyLoad>
            <ProductFormPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/produtos/:id" 
        element={
          <LazyLoad>
            <ProductDetailPage />
          </LazyLoad>
        } 
      />

      {/* Categorias */}
      <Route 
        path="/categorias" 
        element={
          <LazyLoad>
            <CategoryListPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/categorias/nova" 
        element={
          <LazyLoad>
            <CategoryFormPage />
          </LazyLoad>
        } 
      />
      <Route 
        path="/categorias/editar/:id" 
        element={
          <LazyLoad>
            <CategoryFormPage />
          </LazyLoad>
        } 
      />

      {/* Vendas (mantendo compatibilidade com o sidebar existente) */}
      <Route 
        path="/vendas" 
        element={
          <LazyLoad>
            <Navigate to="/pedidos" replace />
          </LazyLoad>
        } 
      />
      <Route 
        path="/vendas/historico" 
        element={
          <LazyLoad>
            <Navigate to="/pedidos/historico" replace />
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

      {/* Outras rotas existentes */}
      <Route 
        path="/produtos/estoque" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Controle de Estoque" />
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
      
      {/* Rota padrão alternativa */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Rota 404 */}
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;