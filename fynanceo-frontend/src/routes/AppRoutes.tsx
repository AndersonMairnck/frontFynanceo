import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LazyLoad } from '../components/common/LazyLoad';

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
      {/* <Route 
        path="/produtos" 
        element={
          <LazyLoad>
            <PlaceholderPage title="Produtos" />
          </LazyLoad>
        } 
      /> */}
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

      {/* Rotas de Categorias */}
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
      
      {/* Rota padrão */}
      <Route path="/" element={<Navigate to="/produtos" replace />} />
      					  
																	  
	  
      {/* Rota 404 */}
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;