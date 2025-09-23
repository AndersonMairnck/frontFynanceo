import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Assignment,
  CalendarToday,
  LocationOn,
  Star
} from '@mui/icons-material';

import { Cliente } from '../../types/cliente';
interface ClienteDetailProps {
  cliente: Cliente;
  onEdit: () => void;
  onBack: () => void;
}

const ClienteDetail: React.FC<ClienteDetailProps> = ({ cliente, onEdit, onBack }) => {
  const formatarDocumento = (cliente: Cliente): string => {
    if (cliente.tipoPessoa === 'FISICA') {
      return cliente.cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cliente.cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatarData = (data: Date): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarDataNascimento = (data?: Date | null): string => {
    if (!data) return 'Não informada';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {cliente.nome}
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <Chip
              label={cliente.ativo ? 'Ativo' : 'Inativo'}
              color={cliente.ativo ? 'success' : 'default'}
            />
            <Chip
              label={cliente.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={onBack}>
            Voltar
          </Button>
          <Button variant="contained" onClick={onEdit}>
            Editar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Informações Pessoais
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={cliente.email}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Telefone" 
                    secondary={cliente.telefone}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText 
                    primary={cliente.tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'} 
                    secondary={formatarDocumento(cliente)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data de Nascimento" 
                    secondary={formatarDataNascimento(cliente.dataNascimento)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data de Cadastro" 
                    secondary={formatarData(cliente.dataCadastro)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {cliente.observacoes && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Observações
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  {cliente.observacoes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                Endereços
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {cliente.enderecos.length === 0 ? (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                  Nenhum endereço cadastrado
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {cliente.enderecos.map((endereco, index) => (
                    <Box
                      key={endereco.id || index}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: endereco.principal ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        backgroundColor: endereco.principal ? 'primary.light' : 'background.paper',
                        position: 'relative'
                      }}
                    >
                      {endereco.principal && (
                        <Chip
                          icon={<Star />}
                          label="Principal"
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', top: -10, right: 10 }}
                        />
                      )}
                      
                      <Typography variant="subtitle2" gutterBottom>
                        {endereco.logradouro}, {endereco.numero}
                        {endereco.complemento && ` - ${endereco.complemento}`}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        {endereco.bairro}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        {endereco.cidade} - {endereco.estado}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        CEP: {endereco.cep}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClienteDetail;