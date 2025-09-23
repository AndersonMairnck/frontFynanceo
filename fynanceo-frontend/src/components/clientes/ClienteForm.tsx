import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { Save, Cancel, Add } from '@mui/icons-material';
import { Cliente, ClienteFormData } from '../../types/cliente';
import { clienteSchema, ClienteFormValues } from '../../validations/clienteValidation';
import EnderecoForm from './EnderecoForm';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// Função para formatar telefone
const formatarTelefone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Função para formatar CPF/CNPJ
const formatarCpfCnpj = (value: string, tipoPessoa: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (tipoPessoa === 'FISICA') {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Objeto padrão completo para um endereço
const enderecoPadrao = {
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  principal: true
};

const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSubmit: onSubmitProp,
  onCancel,
  loading = false
}) => {
  const [enderecos, setEnderecos] = useState<Partial<any>[]>(
    cliente?.enderecos || [enderecoPadrao]
  );

  // Definir valores padrão
  const defaultValues: ClienteFormValues = {
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    tipoPessoa: cliente?.tipoPessoa || 'FISICA',
    cpfCnpj: cliente?.cpfCnpj || '',
    dataNascimento: cliente?.dataNascimento ? new Date(cliente.dataNascimento).toISOString().split('T')[0] : '',
    ativo: cliente?.ativo ?? true,
    observacoes: cliente?.observacoes || '',
    enderecos: cliente?.enderecos || [enderecoPadrao]
  };

  const methods = useForm<ClienteFormValues>({
    resolver: yupResolver(clienteSchema),
    defaultValues: defaultValues,
    mode: 'onChange' // Validar enquanto o usuário digita
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch, 
    setValue,
    control,
    reset,
    trigger // Adicionar trigger para validação manual
  } = methods;

  const tipoPessoa = watch('tipoPessoa');

  // Resetar o formulário quando o cliente prop mudar
  useEffect(() => {
    console.log('📝 Resetando formulário com valores:', defaultValues);
    reset(defaultValues);
    setEnderecos(cliente?.enderecos || [enderecoPadrao]);
  }, [cliente, reset]);

  const adicionarEndereco = () => {
    const novoEndereco = { ...enderecoPadrao, principal: false };
    const novosEnderecos = [...enderecos, novoEndereco];
    setEnderecos(novosEnderecos);
    setValue('enderecos', novosEnderecos as any);
    console.log('➕ Endereço adicionado. Total:', novosEnderecos.length);
  };

  const removerEndereco = (index: number) => {
    if (enderecos.length <= 1) {
      alert('É necessário pelo menos um endereço');
      return;
    }

    const novosEnderecos = enderecos.filter((_, i) => i !== index);
    setEnderecos(novosEnderecos);
    setValue('enderecos', novosEnderecos as any);

    if (enderecos[index]?.principal && novosEnderecos.length > 0) {
      const novosEnderecosComPrincipal = novosEnderecos.map((end, i) => ({
        ...end,
        principal: i === 0
      }));
      setEnderecos(novosEnderecosComPrincipal);
      setValue('enderecos', novosEnderecosComPrincipal as any);
    }
    console.log('➖ Endereço removido. Total:', novosEnderecos.length);
  };

  const definirPrincipal = (index: number) => {
    const novosEnderecos = enderecos.map((endereco, i) => ({
      ...endereco,
      principal: i === index
    }));
    setEnderecos(novosEnderecos);
    setValue('enderecos', novosEnderecos as any);
    console.log('⭐ Endereço definido como principal:', index);
  };

  const onSubmitForm = async (data: ClienteFormValues) => {
    console.log('🚀 Iniciando submit do formulário...');
    console.log('📋 Dados do formulário:', data);
    
    try {
      // Validar todos os campos antes de enviar
      const isValido = await trigger();
      console.log('✅ Formulário válido?:', isValido);
      
      if (!isValido) {
        console.log('❌ Formulário inválido. Erros:', errors);
        alert('Por favor, corrija os erros antes de enviar.');
        return;
      }

      // Garantir que sempre tenha um valor para tipoPessoa
      const formData: ClienteFormData = {
        ...data,
        tipoPessoa: data.tipoPessoa || 'FISICA',
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined,
        enderecos: data.enderecos || [enderecoPadrao]
      };
      
      console.log('📤 Enviando dados para onSubmitProp...');
      await onSubmitProp(formData);
      console.log('✅ Submit concluído com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no formulário:', error);
    }
  };

  // Log de erros para debug
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('❌ Erros de validação:', errors);
    }
  }, [errors]);

  return (
    <FormProvider {...methods}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {cliente ? 'Editar Cliente' : 'Novo Cliente'}
        </Typography>

        {/* Debug Info */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Debug:</strong> Formulário válido: {isValid ? '✅' : '❌'} | 
          Erros: {Object.keys(errors).length} | 
          Endereços: {enderecos.length}
        </Alert>

        <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
          <Grid container spacing={3}>
            {/* Dados Básicos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Dados Básicos
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome *"
                {...register('nome')}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Telefone *"
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatarTelefone(e.target.value);
                      field.onChange(formatted);
                    }}
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Pessoa *"
                select
                {...register('tipoPessoa')}
                error={!!errors.tipoPessoa}
                helperText={errors.tipoPessoa?.message}
                value={tipoPessoa}
              >
                <MenuItem value="FISICA">Pessoa Física</MenuItem>
                <MenuItem value="JURIDICA">Pessoa Jurídica</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="cpfCnpj"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label={tipoPessoa === 'FISICA' ? 'CPF *' : 'CNPJ *'}
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatarCpfCnpj(e.target.value, tipoPessoa);
                      field.onChange(formatted);
                    }}
                    error={!!errors.cpfCnpj}
                    helperText={errors.cpfCnpj?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Nascimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('dataNascimento')}
                error={!!errors.dataNascimento}
                helperText={errors.dataNascimento?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                {...register('observacoes')}
                error={!!errors.observacoes}
                helperText={errors.observacoes?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch {...register('ativo')} defaultChecked />}
                label="Cliente Ativo"
              />
            </Grid>

            {/* Endereços */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Endereços
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={adicionarEndereco}
                  variant="outlined"
                >
                  Adicionar Endereço
                </Button>
              </Box>
              <Divider sx={{ mt: 1, mb: 2 }} />
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Importante:</strong> Logradouro e número serão concatenados automaticamente para a API.
              </Alert>
            </Grid>

            {enderecos.map((_, index) => (
              <Grid item xs={12} key={index}>
                <EnderecoForm
                  index={index}
                  onRemove={() => removerEndereco(index)}
                  isPrincipal={enderecos[index]?.principal || false}
                  onSetPrincipal={() => definirPrincipal(index)}
                  canRemove={enderecos.length > 1}
                />
              </Grid>
            ))}

            {/* Erros gerais do formulário */}
            {errors.enderecos && !Array.isArray(errors.enderecos) && (
              <Grid item xs={12}>
                <Alert severity="error">
                  {(errors.enderecos as any)?.message}
                </Alert>
              </Grid>
            )}

            {/* Ações */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  onClick={onCancel}
                  startIcon={<Cancel />}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading || !isValid} // Desabilitar se não for válido
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </FormProvider>
  );
};

export default ClienteForm;