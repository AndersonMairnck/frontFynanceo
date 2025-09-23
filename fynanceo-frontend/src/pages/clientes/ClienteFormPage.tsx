import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Cliente, ClienteFormData } from '../../types/cliente';
import { useClientes } from '../../hooks/useClientes';
import ClienteForm from '../../components/clientes/ClienteForm';

const ClienteFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    cliente,
    loading,
    error,
    carregarCliente,
    criarCliente,
    atualizarCliente,
    limparErro
  } = useClientes();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const isEdit = Boolean(id);
  const clienteId = id ? parseInt(id) : undefined;

  // Carregar cliente se for edição
  useEffect(() => {
    if (isEdit && clienteId) {
      carregarCliente(clienteId);
    }
  }, [isEdit, clienteId, carregarCliente]);

  // Submit do formulário
  const handleSubmit = async (formData: ClienteFormData) => {
    try {
      if (isEdit && clienteId) {
        await atualizarCliente(clienteId, formData);
        mostrarSnackbar('Cliente atualizado com sucesso!', 'success');
      } else {
        await criarCliente(formData);
        mostrarSnackbar('Cliente criado com sucesso!', 'success');
      }
      
      // Redirecionar após sucesso
      setTimeout(() => navigate('/clientes'), 1000);
    } catch (error) {
      mostrarSnackbar(
        `Erro ao ${isEdit ? 'atualizar' : 'criar'} cliente`, 
        'error'
      );
    }
  };

  // Cancelar
  const handleCancel = () => {
    navigate('/clientes');
  };

  // Mostrar snackbar
  const mostrarSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Limpar erro ao desmontar
  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  // Loading específico para carregamento de cliente em edição
  if (isEdit && !cliente && loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <ClienteForm
          cliente={isEdit ? cliente || undefined : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
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

      {/* Snackbar para erro global */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={limparErro}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default ClienteFormPage;