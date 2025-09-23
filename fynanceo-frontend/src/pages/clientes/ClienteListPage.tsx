import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import { Cliente } from '../../types/cliente';
import { useClientes } from '../../hooks/useClientes';
import { useDebounce } from '../../hooks/useDebounce';
import ClienteList from '../../components/clientes/ClienteList';
import { APIConnectionTest } from '../../components/APIConnectionTest';
const ClienteListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    clientes,
    loading,
    error,
    carregarClientes,
    inativarCliente,
    ativarCliente,
    limparErro,
  } = useClientes();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carregar clientes ao iniciar a página e quando search term mudar
  useEffect(() => {
    carregarClientes(1, 10, debouncedSearchTerm);
  }, [debouncedSearchTerm, carregarClientes]);

  // Mostrar snackbar de sucesso/erro
  const mostrarSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Navegação
  const handleAdd = () => navigate('/clientes/novo');
  const handleEdit = (cliente: Cliente) => navigate(`/clientes/editar/${cliente.id}`);
  const handleView = (cliente: Cliente) => navigate(`/clientes/${cliente.id}`);

  // Busca
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Inativar cliente
  const handleInativar = async (id: number) => {
    try {
      await inativarCliente(id);
      mostrarSnackbar('Cliente inativado com sucesso!', 'success');
    } catch (error) {
      mostrarSnackbar('Erro ao inativar cliente', 'error');
    }
  };

  // Ativar cliente
  const handleAtivar = async (id: number) => {
    try {
      await ativarCliente(id);
      mostrarSnackbar('Cliente ativado com sucesso!', 'success');
    } catch (error) {
      mostrarSnackbar('Erro ao ativar cliente', 'error');
    }
  };

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Limpar erro quando o componente desmontar
  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <APIConnectionTest />
  
      <Box>
        <ClienteList
          clientes={clientes}
          loading={loading}
          error={error}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          onInativar={handleInativar}
          onAtivar={handleAtivar}
          onSearch={handleSearch}
        />
      </Box>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClienteListPage;