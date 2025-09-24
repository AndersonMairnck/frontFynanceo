import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup
    .string()
    .required('Nome do produto é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  
  description: yup
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  
  price: yup
    .number()
    .required('Preço de venda é obrigatório')
    .min(0.01, 'Preço deve ser maior que zero')
    .typeError('Preço deve ser um número válido'),
  
  costPrice: yup
    .number()
    .min(0, 'Preço de custo não pode ser negativo')
    .typeError('Preço de custo deve ser um número válido'),
  
  stockQuantity: yup
    .number()
    .required('Quantidade em estoque é obrigatória')
    .min(0, 'Estoque não pode ser negativo')
    .integer('Estoque deve ser um número inteiro')
    .typeError('Estoque deve ser um número válido'),
  
  minStockLevel: yup
    .number()
    .required('Estoque mínimo é obrigatório')
    .min(0, 'Estoque mínimo não pode ser negativo')
    .integer('Estoque mínimo deve ser um número inteiro')
    .typeError('Estoque mínimo deve ser um número válido'),
  
  categoryId: yup
    .number()
    .required('Categoria é obrigatória')
    .min(1, 'Selecione uma categoria válida'),
  
  isActive: yup
    .boolean()
    .default(true)
});

export type ProductFormValues = yup.InferType<typeof productSchema>;