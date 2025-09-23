import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Add,
  Visibility,
  Block,
  CheckCircle
} from '@mui/icons-material';
import { Cliente } from '@/types/cliente';

interface ClienteListProps {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  onEdit: (cliente: Cliente) => void;
  onView: (cliente: Cliente) => void;
  onAdd: () => void;
  onInativar: (id: number) => void;
  onAtivar: (id: number) => void;
  onSearch: (term: string) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({
  clientes,
  loading,
  error,
  onEdit,
  onView,
  onAdd,
  onInativar,
  onAtivar,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteParaInativar, setClienteParaInativar] = useState<Cliente | null>(null);
  const [clienteParaAtivar, setClienteParaAtivar] = useState<Cliente | null>(null);

  // Função de busca com debounce
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  // Formatar CPF/CNPJ para exibição
  const formatarDocumento = (cliente: Cliente): string => {
    if (cliente.tipoPessoa === 'FISICA') {
      return cliente.cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cliente.cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Formatar data
  const formatarData = (data: Date): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Confirmar inativação
  const confirmarInativar = (cliente: Cliente) => {
    setClienteParaInativar(cliente);
  };

  // Confirmar ativação
  const confirmarAtivar = (cliente: Cliente) => {
    setClienteParaAtivar(cliente);
  };

  // Executar inativação
  const executarInativar = () => {
    if (clienteParaInativar) {
      onInativar(clienteParaInativar.id);
      setClienteParaInativar(null);
    }
  };

  // Executar ativação
  const executarAtivar = () => {
    if (clienteParaAtivar) {
      onAtivar(clienteParaAtivar.id);
      setClienteParaAtivar(null);
    }
  };

  if (loading && clientes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3}>
      {/* Cabeçalho com busca e ações */}
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Clientes Cadastrados</Typography>
        
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
          >
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {/* Mensagem de erro */}
      {error && (
        <Box px={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Tabela de clientes */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Data Cadastro</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width="120px">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {loading ? 'Carregando...' : 'Nenhum cliente encontrado'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {cliente.nome}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {cliente.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{formatarDocumento(cliente)}</TableCell>
                  <TableCell>{formatarData(cliente.dataCadastro)}</TableCell>
                  <TableCell>
                    <Chip
                      label={cliente.ativo ? 'Ativo' : 'Inativo'}
                      color={cliente.ativo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => onView(cliente)}
                        title="Visualizar"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => onEdit(cliente)}
                        title="Editar"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      
                      {cliente.ativo ? (
                        <IconButton
                          size="small"
                          onClick={() => confirmarInativar(cliente)}
                          title="Inativar"
                          color="warning"
                        >
                          <Block fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => confirmarAtivar(cliente)}
                          title="Ativar"
                          color="success"
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmação para inativar */}
      <Dialog
        open={!!clienteParaInativar}
        onClose={() => setClienteParaInativar(null)}
      >
        <DialogTitle>Confirmar Inativação</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja inativar o cliente {clienteParaInativar?.nome}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClienteParaInativar(null)}>Cancelar</Button>
          <Button onClick={executarInativar} color="warning">
            Inativar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para ativar */}
      <Dialog
        open={!!clienteParaAtivar}
        onClose={() => setClienteParaAtivar(null)}
      >
        <DialogTitle>Confirmar Ativação</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja ativar o cliente {clienteParaAtivar?.nome}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClienteParaAtivar(null)}>Cancelar</Button>
          <Button onClick={executarAtivar} color="success">
            Ativar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ClienteList;