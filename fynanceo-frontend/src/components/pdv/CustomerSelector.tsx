import React, { useState, useEffect } from 'react'; // Adicionar useEffect
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Box,
  Typography,
  Chip,
  CircularProgress // Adicionar loading
} from '@mui/material';
import { Person, Search, Add, Check } from '@mui/icons-material';
import { Customer } from '../../types/order';
import { useClientes } from '../../hooks/useClientes'; // Importar o hook
import { convertClienteToCustomer } from '../../utils/customerConverter'; // Importar conversor

interface CustomerSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Usar o hook de clientes
  const { clientes, loading, error, carregarClientes } = useClientes();

  // Carregar clientes quando o modal abrir
  useEffect(() => {
    if (open) {
      carregarClientes(1, 100, ''); // Carregar todos os clientes
    }
  }, [open, carregarClientes]);

  // Debounce para busca em tempo real
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (open) {
      const timer = setTimeout(() => {
        carregarClientes(1, 100, searchTerm);
      }, 500); // 500ms de debounce

      setDebounceTimer(timer);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [searchTerm, open]);

  // Converter Cliente[] para Customer[]
  const customers: Customer[] = clientes.map(convertClienteToCustomer);

  const filteredCustomers = customers.filter(customer =>
    customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.telefone.includes(searchTerm) ||
    customer.cpfCnpj?.includes(searchTerm)
  );

  const handleSelect = (customer: Customer | null) => {
    onSelect(customer);
    onClose();
  };

  const handleClear = () => {
    onSelect(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Selecionar Cliente</Typography>
          <IconButton onClick={handleClear} size="small">
            <Typography variant="body2" color="primary">
              Limpar
            </Typography>
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Campo de busca */}
        <TextField
          fullWidth
          placeholder="Buscar cliente por nome, email, telefone ou CPF/CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ mb: 2 }}
        />

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Erro */}
        {error && (
          <Box bgcolor="error.light" color="error.main" p={1} borderRadius={1} mb={2}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {/* Lista de clientes */}
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {/* Opção "Cliente não identificado" */}
          <ListItem 
            button 
            onClick={() => handleSelect(null)}
            selected={!selectedCustomer}
            sx={{ backgroundColor: !selectedCustomer ? 'action.selected' : 'inherit' }}
          >
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Cliente não identificado"
              secondary="Venda sem cadastro de cliente"
            />
            {!selectedCustomer && <Check color="primary" />}
          </ListItem>

          {/* Lista de clientes */}
          {filteredCustomers.map((customer) => (
            <ListItem 
              key={customer.id} 
              button 
              onClick={() => handleSelect(customer)}
              selected={selectedCustomer?.id === customer.id}
              sx={{ backgroundColor: selectedCustomer?.id === customer.id ? 'action.selected' : 'inherit' }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {customer.nome.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">{customer.nome}</Typography>
                    <Chip 
                      label={customer.ativo ? 'Ativo' : 'Inativo'} 
                      size="small" 
                      color={customer.ativo ? 'success' : 'default'}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.telefone} {customer.cpfCnpj && `• ${customer.cpfCnpj}`}
                    </Typography>
                    {customer.enderecos.find(e => e.principal) && (
                      <Typography variant="caption" color="text.secondary">
                        {customer.enderecos.find(e => e.principal)?.logradouro}, {customer.enderecos.find(e => e.principal)?.numero}
                      </Typography>
                    )}
                  </Box>
                }
              />
              {selectedCustomer?.id === customer.id && <Check color="primary" />}
            </ListItem>
          ))}
        </List>

        {!loading && filteredCustomers.length === 0 && searchTerm && (
          <Box textAlign="center" py={3}>
            <Typography variant="body1" color="text.secondary">
              Nenhum cliente encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente buscar com outros termos
            </Typography>
          </Box>
        )}

        {!loading && filteredCustomers.length === 0 && !searchTerm && (
          <Box textAlign="center" py={3}>
            <Typography variant="body1" color="text.secondary">
              Nenhum cliente cadastrado
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Cadastre clientes no módulo de Clientes
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerSelector;