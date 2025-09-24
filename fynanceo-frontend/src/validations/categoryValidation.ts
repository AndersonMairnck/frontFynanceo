import * as yup from 'yup';

export const categorySchema = yup.object({
  name: yup
    .string()
    .required('Nome da categoria é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  description: yup
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  isActive: yup
    .boolean()
    .default(true)
});

export type CategoryFormValues = yup.InferType<typeof categorySchema>;