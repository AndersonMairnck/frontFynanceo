import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  TextField,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Box,
  Alert
} from '@mui/material';
import { Delete, LocationOn } from '@mui/icons-material';

interface EnderecoFormProps {
  index: number;
  onRemove: () => void;
  isPrincipal: boolean;
  onSetPrincipal: () => void;
  canRemove: boolean;
}

// Interface para o tipo dos erros do endereço
interface EnderecoError {
  logradouro?: { message?: string };
  numero?: { message?: string };
  complemento?: { message?: string };
  bairro?: { message?: string };
  cidade?: { message?: string };
  estado?: { message?: string };
  cep?: { message?: string };
}

const EnderecoForm: React.FC<EnderecoFormProps> = ({
  index,
  onRemove,
  isPrincipal,
  onSetPrincipal,
  canRemove
}) => {
  const { register, formState: { errors }, watch } = useFormContext();

  // Observar valores do logradouro e número para mostrar preview
  const logradouro = watch(`enderecos.${index}.logradouro`);
  const numero = watch(`enderecos.${index}.numero`);

  // Função auxiliar para obter erros de forma segura com tipos
  const getError = (fieldName: keyof EnderecoError): { message?: string } | undefined => {
    // Fazer type casting seguro para o array de erros
    const enderecosErrors = errors.enderecos as unknown as EnderecoError[];
    
    if (enderecosErrors && Array.isArray(enderecosErrors) && enderecosErrors[index]) {
      const enderecoError = enderecosErrors[index];
      return enderecoError[fieldName];
    }
    
    return undefined;
  };

  // Função para verificar se há erro em um campo
  const hasError = (fieldName: keyof EnderecoError): boolean => {
    return !!getError(fieldName);
  };

  // Função para obter mensagem de erro
  const getErrorMessage = (fieldName: keyof EnderecoError): string => {
    const error = getError(fieldName);
    return error?.message || '';
  };

  return (
    <Box sx={{ 
      border: '1px solid #ddd', 
      padding: '16px', 
      marginBottom: '16px',
      borderRadius: '8px',
      backgroundColor: isPrincipal ? '#f0f8ff' : 'white'
    }}>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap="8px">
            <LocationOn color={isPrincipal ? "primary" : "disabled"} />
            <strong>Endereço {index + 1}</strong>
            {isPrincipal && <span style={{ color: '#1976d2' }}>(Principal)</span>}
          </Box>
          
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPrincipal}
                  onChange={onSetPrincipal}
                  color="primary"
                />
              }
              label="Principal"
            />
            
            {canRemove && (
              <IconButton onClick={onRemove} color="error" size="small">
                <Delete />
              </IconButton>
            )}
          </Box>
        </Grid>

        {/* Preview da concatenação */}
        {(logradouro || numero) && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Será enviado para a API como:</strong> {logradouro || ''}{logradouro && numero ? ', ' : ''}{numero || ''}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Logradouro *"
            {...register(`enderecos.${index}.logradouro`)}
            error={hasError('logradouro')}
            helperText={getErrorMessage('logradouro')}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Número *"
            {...register(`enderecos.${index}.numero`)}
            error={hasError('numero')}
            helperText={getErrorMessage('numero')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Complemento"
            {...register(`enderecos.${index}.complemento`)}
            error={hasError('complemento')}
            helperText={getErrorMessage('complemento')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bairro"
            {...register(`enderecos.${index}.bairro`)}
            error={hasError('bairro')}
            helperText={getErrorMessage('bairro')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cidade"
            {...register(`enderecos.${index}.cidade`)}
            error={hasError('cidade')}
            helperText={getErrorMessage('cidade')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estado"
            placeholder="Ex: SP"
            {...register(`enderecos.${index}.estado`)}
            error={hasError('estado')}
            helperText={getErrorMessage('estado')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CEP"
            placeholder="00000-000"
            {...register(`enderecos.${index}.cep`)}
            error={hasError('cep')}
            helperText={getErrorMessage('cep')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnderecoForm;