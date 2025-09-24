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
  Button,
  Card,
  CardHeader,
  Avatar,
  useTheme,
  alpha,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Add,
  Visibility,
  Block,
  CheckCircle,
  MoreVert,
  Person,
  Email,
  Phone,
  Assignment,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import { Cliente } from '../../types/cliente';

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
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteParaInativar, setClienteParaInativar] = useState<Cliente | null>(null);
  const [clienteParaAtivar, setClienteParaAtivar] = useState<Cliente | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const formatarDocumento = (cliente: Cliente): string => {
    if (cliente.tipoPessoa === 'FISICA') {
      return cliente.cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cliente.cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatarData = (data: Date): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, cliente: Cliente) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(cliente);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCliente(null);
  };

  const confirmarInativar = (cliente: Cliente) => {
    setClienteParaInativar(cliente);
    handleMenuClose();
  };

  const confirmarAtivar = (cliente: Cliente) => {
    setClienteParaAtivar(cliente);
    handleMenuClose();
  };

  const executarInativar = () => {
    if (clienteParaInativar) {
      onInativar(clienteParaInativar.id);
      setClienteParaInativar(null);
    }
  };

  const executarAtivar = () => {
    if (clienteParaAtivar) {
      onAtivar(clienteParaAtivar.id);
      setClienteParaAtivar(null);
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading && clientes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ mb: 2, color: theme.palette.primary.main }} />
          <Typography variant="h6" color="textSecondary">
            Carregando clientes...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Card elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 3 }}>
      {/* Cabeçalho */}
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="700">
                Clientes Cadastrados
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {clientes.length} {clientes.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
              </Typography>
            </Box>
          </Box>
        }
        action={
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Buscar por nome, email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
              size="small"
              sx={{ width: 300 }}
            />
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                },
                transition: 'all 0.3s ease'
              }}
            >
              Novo Cliente
            </Button>
          </Box>
        }
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '& .MuiCardHeader-action': { alignSelf: 'center' }
        }}
      />

      {/* Mensagem de erro */}
      {error && (
        <Box px={3} pt={2}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
            }}
          >
            {error}
          </Alert>
        </Box>
      )}

      {/* Tabela */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: alpha(theme.palette.primary.main, 0.02) }}>
              <TableCell sx={{ py: 2, pl: 3, fontWeight: '600', color: 'text.primary', border: 'none' }}>
                Cliente
              </TableCell>
              <TableCell sx={{ py: 2, fontWeight: '600', color: 'text.primary', border: 'none' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />
                  Contato
                </Box>
              </TableCell>
              <TableCell sx={{ py: 2, fontWeight: '600', color: 'text.primary', border: 'none' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assignment fontSize="small" />
                  Documento
                </Box>
              </TableCell>
              <TableCell sx={{ py: 2, fontWeight: '600', color: 'text.primary', border: 'none' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday fontSize="small" />
                  Cadastro
                </Box>
              </TableCell>
              <TableCell sx={{ py: 2, fontWeight: '600', color: 'text.primary', border: 'none' }}>
                Status
              </TableCell>
              <TableCell sx={{ py: 2, pr: 3, fontWeight: '600', color: 'text.primary', border: 'none', width: '80px' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, border: 'none' }}>
                  <Box textAlign="center">
                    <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Nenhum cliente encontrado
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm ? 'Tente ajustar os termos da busca' : 'Comece cadastrando seu primeiro cliente'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente, index) => (
                <TableRow 
                  key={cliente.id} 
                  hover
                  sx={{ 
                    '&:last-child td': { border: 'none' },
                    background: index % 2 === 0 ? 'transparent' : alpha(theme.palette.action.hover, 0.02)
                  }}
                >
                  <TableCell sx={{ py: 2, pl: 3, border: 'none' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          width: 40,
                          height: 40,
                          fontWeight: '600'
                        }}
                      >
                        {getInitials(cliente.nome)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="600">
                          {cliente.nome}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {cliente.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2, border: 'none' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {cliente.email}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {cliente.telefone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2, border: 'none' }}>
                    <Typography variant="body2" fontFamily="monospace">
                      {formatarDocumento(cliente)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, border: 'none' }}>
                    <Typography variant="body2">
                      {formatarData(cliente.dataCadastro)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, border: 'none' }}>
                    <Chip
                      label={cliente.ativo ? 'Ativo' : 'Inativo'}
                      color={cliente.ativo ? 'success' : 'default'}
                      variant={cliente.ativo ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ 
                        fontWeight: '600',
                        borderRadius: 1,
                        minWidth: 80
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1, pr: 3, border: 'none' }}>
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Mais opções">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, cliente)}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.1),
                              borderColor: theme.palette.primary.main
                            }
                          }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            borderRadius: 2,
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={() => { onView(selectedCliente!); handleMenuClose(); }}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          <ListItemText>Visualizar</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { onEdit(selectedCliente!); handleMenuClose(); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        
        {selectedCliente?.ativo ? (
          <MenuItem onClick={() => confirmarInativar(selectedCliente)}>
            <ListItemIcon><Block fontSize="small" color="warning" /></ListItemIcon>
            <ListItemText>Inativar</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => confirmarAtivar(selectedCliente!)}>
            <ListItemIcon><CheckCircle fontSize="small" color="success" /></ListItemIcon>
            <ListItemText>Ativar</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Diálogos de confirmação */}
      <Dialog
        open={!!clienteParaInativar}
        onClose={() => setClienteParaInativar(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
              <Block />
            </Avatar>
            Confirmar Inativação
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Tem certeza que deseja inativar o cliente <strong>{clienteParaInativar?.nome}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setClienteParaInativar(null)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={executarInativar} 
            variant="contained"
            color="warning"
            sx={{ borderRadius: 2 }}
          >
            Confirmar Inativação
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!clienteParaAtivar}
        onClose={() => setClienteParaAtivar(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
              <CheckCircle />
            </Avatar>
            Confirmar Ativação
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Tem certeza que deseja ativar o cliente <strong>{clienteParaAtivar?.nome}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setClienteParaAtivar(null)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={executarAtivar} 
            variant="contained"
            color="success"
            sx={{ borderRadius: 2 }}
          >
            Confirmar Ativação
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ClienteList;