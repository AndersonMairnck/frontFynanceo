import * as yup from 'yup';

// Validações de CPF/CNPJ
const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.length === 11;
};

const validarCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  return cnpj.length === 14;
};

// Tornar alguns campos opcionais para evitar erros de validação inicial
export const enderecoSchema = yup.object({
  logradouro: yup.string().required('Logradouro é obrigatório'),
  numero: yup.string().required('Número é obrigatório'),
  complemento: yup.string().optional(),
  bairro: yup.string().required('Bairro é obrigatório'),
  cidade: yup.string().required('Cidade é obrigatória'),
  estado: yup.string()
    .required('Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres'),
  cep: yup.string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  principal: yup.boolean().default(false)
});

export const clienteSchema = yup.object({
  nome: yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  
  telefone: yup.string()
    .required('Telefone é obrigatório'),
  
  tipoPessoa: yup.string()
    .oneOf(['FISICA', 'JURIDICA'], 'Tipo de pessoa inválido')
    .required('Tipo de pessoa é obrigatório'),
  
  cpfCnpj: yup.string()
    .required('CPF/CNPJ é obrigatório')
    .test('cpf-cnpj-valido', 'CPF/CNPJ inválido', function(value) {
      // Permitir string vazia inicialmente
      if (!value || value.trim() === '') return true;
      
      const { tipoPessoa } = this.parent;
      if (tipoPessoa === 'FISICA') {
        return validarCPF(value);
      } else {
        return validarCNPJ(value);
      }
    }),
  
  dataNascimento: yup.string().nullable().optional(),
  ativo: yup.boolean().default(true),
  observacoes: yup.string().max(500, 'Observações muito longas').optional(),
  
  enderecos: yup.array()
    .of(enderecoSchema)
    .min(1, 'Pelo menos um endereço é necessário')
    .test('enderecos-validos', 'Endereços inválidos', function(enderecos) {
      // Validação mais flexível para endereços
      if (!enderecos || enderecos.length === 0) {
        return this.createError({ message: 'Pelo menos um endereço é necessário' });
      }
      return true;
    })
});

export type ClienteFormValues = yup.InferType<typeof clienteSchema>;