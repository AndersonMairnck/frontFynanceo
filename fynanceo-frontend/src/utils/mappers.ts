import { Cliente, ClienteFormData, ClienteAPI, ClienteFormDataAPI } from '../types/cliente';

/**
 * Converte Cliente da API para nosso Cliente interno
 */
export const mapClienteAPIToCliente = (clienteAPI: ClienteAPI): Cliente => {
  // Extrair número do logradouro (assumindo formato "Rua Exemplo, 123")
  const [logradouro, numero] = extrairLogradouroENumero(clienteAPI.rua);
  
  return {
    id: clienteAPI.id,
    nome: clienteAPI.name,
    email: clienteAPI.email,
    telefone: clienteAPI.phone,
    cpfCnpj: clienteAPI.cpfCnpj || '',
    tipoPessoa: (clienteAPI.tipoPessoa as 'FISICA' | 'JURIDICA') || 'FISICA', // Garantir que venha com valor
    dataCadastro: new Date(clienteAPI.createdAt),
    ativo: clienteAPI.isActive,
    observacoes: '',
    
    // Converter endereço único para array de endereços
    enderecos: [{
      id: clienteAPI.id,
      logradouro: logradouro,
      numero: numero,
      complemento: clienteAPI.complemento,
      bairro: clienteAPI.bairro,
      cidade: clienteAPI.cidade,
      estado: clienteAPI.estado,
      cep: clienteAPI.cep,
      principal: true
    }]
  };
};

/**
 * Extrai logradouro e número de uma string combinada
 * Exemplo: "Rua das Flores, 123" → { logradouro: "Rua das Flores", numero: "123" }
 */
const extrairLogradouroENumero = (ruaCompleta: string): [string, string] => {
  if (!ruaCompleta) return ['', ''];
  
  // Tentar encontrar número no final (após última vírgula)
  const ultimaVirgula = ruaCompleta.lastIndexOf(',');
  if (ultimaVirgula !== -1) {
    const logradouro = ruaCompleta.substring(0, ultimaVirgula).trim();
    const numero = ruaCompleta.substring(ultimaVirgula + 1).trim();
    return [logradouro, numero];
  }
  
  // Se não encontrar vírgula, assumir que é só logradouro
  return [ruaCompleta, ''];
};

/**
 * Converte nosso ClienteFormData para o formato da API
 * Concatena logradouro + número no campo "rua"
 */
export const mapClienteFormDataToAPI = (clienteForm: ClienteFormData, clienteExistente?: ClienteAPI): ClienteFormDataAPI => {
  // Pegar o primeiro endereço
  const enderecoPrincipal = clienteForm.enderecos[0];
  
  // Concatenar logradouro e número para o campo "rua" da API
  const ruaCompleta = enderecoPrincipal 
    ? `${enderecoPrincipal.logradouro}, ${enderecoPrincipal.numero}`.trim()
    : '';
  
  return {
    name: clienteForm.nome,
    email: clienteForm.email,
    phone: clienteForm.telefone,
    isActive: clienteForm.ativo,
	
									   
    cpfCnpj: clienteForm.cpfCnpj,
    tipoPessoa: clienteForm.tipoPessoa,
    
    // Endereço - concatenar logradouro e número
    rua: ruaCompleta,
    bairro: enderecoPrincipal?.bairro || '',
    cidade: enderecoPrincipal?.cidade || '',
    estado: enderecoPrincipal?.estado || '',
    cep: enderecoPrincipal?.cep || '',
    complemento: enderecoPrincipal?.complemento || '',
    
    // Manter campos existentes se for uma atualização
    ...(clienteExistente && {
												   
      createdAt: clienteExistente.createdAt,
										  
    })
  };
};

/**
 * Para criação: enviar dados mínimos necessários
 */
export const mapClienteFormDataToAPIForCreate = (clienteForm: ClienteFormData): ClienteFormDataAPI => {
  const enderecoPrincipal = clienteForm.enderecos[0];
  
  // Concatenar logradouro e número para o campo "rua" da API
  const ruaCompleta = enderecoPrincipal 
    ? `${enderecoPrincipal.logradouro}, ${enderecoPrincipal.numero}`.trim()
    : '';
  
  return {
    name: clienteForm.nome,
    email: clienteForm.email,
    phone: clienteForm.telefone,
    isActive: clienteForm.ativo,
    cpfCnpj: clienteForm.cpfCnpj,
    tipoPessoa: clienteForm.tipoPessoa,
    
    // Endereço - concatenar logradouro e número
    rua: ruaCompleta,
    bairro: enderecoPrincipal?.bairro || '',
    cidade: enderecoPrincipal?.cidade || '',
    estado: enderecoPrincipal?.estado || '',
    cep: enderecoPrincipal?.cep || '',
    complemento: enderecoPrincipal?.complemento || ''
  };
};

export const mapClientesAPIToClientes = (clientesAPI: ClienteAPI[]): Cliente[] => {
  return clientesAPI.map(mapClienteAPIToCliente);
};