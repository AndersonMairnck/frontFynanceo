import { Cliente } from '../types/cliente';
import { Customer } from '../types/order';

export const convertClienteToCustomer = (cliente: Cliente): Customer => {
  return {
    id: cliente.id,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    cpfCnpj: cliente.cpfCnpj, // Já é string obrigatória
    tipoPessoa: cliente.tipoPessoa, // Já é obrigatório
    dataCadastro: cliente.dataCadastro, // Já é obrigatório
    dataNascimento: cliente.dataNascimento,
    ativo: cliente.ativo,
    observacoes: cliente.observacoes,
    enderecos: cliente.enderecos.map(endereco => ({
      id: endereco.id || 0, // Garantir que id não seja undefined
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
      principal: endereco.principal
    }))
  };
};

// Função inversa se necessário
export const convertCustomerToCliente = (customer: Customer): Cliente => {
  return {
    id: customer.id,
    nome: customer.nome,
    email: customer.email,
    telefone: customer.telefone,
    cpfCnpj: customer.cpfCnpj || '',
    tipoPessoa: customer.tipoPessoa || 'FISICA',
    dataCadastro: customer.dataCadastro || new Date(),
    dataNascimento: customer.dataNascimento,
    ativo: customer.ativo,
    observacoes: customer.observacoes,
    enderecos: customer.enderecos
  };
};