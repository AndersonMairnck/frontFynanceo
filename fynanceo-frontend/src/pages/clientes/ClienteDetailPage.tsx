import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
    Button // Adicionar esta importação
} from '@mui/material';
import { useClientes } from '@/hooks/useClientes';
import ClienteDetail from '@/components/clientes/ClienteDetail';

const ClienteDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    cliente,
    loading,
    error,
    carregarCliente,
    limparErro
  } = useClientes();

  const clienteId = id ? parseInt(id) : undefined;

  // Carregar cliente ao montar o componente
  useEffect(() => {
    if (clienteId) {
      carregarCliente(clienteId);
    }
  }, [clienteId, carregarCliente]);

  // Navegação
  const handleEdit = () => {
    if (cliente) {
      navigate(`/clientes/editar/${cliente.id}`);
    }
  };

  const handleBack = () => {
    navigate('/clientes');
  };

  // Limpar erro ao desmontar
  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  // Loading
  if (loading || !cliente) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Erro
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Voltar para a lista
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ClienteDetail
        cliente={cliente}
        onEdit={handleEdit}
        onBack={handleBack}
      />

      {/* Snackbar para erro */}
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
    </Container>
  );
};

export default ClienteDetailPage;