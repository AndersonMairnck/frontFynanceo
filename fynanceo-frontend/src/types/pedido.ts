// types/pedido.ts
export type StatusPedido = 
  | 'recebido' 
  | 'preparando' 
  | 'pronto' 
  | 'em_entrega' 
  | 'entregue' 
  | 'cancelado';

export interface Pedido {
  id: number;
  vendaId: number;
  status: StatusPedido;
  tempoPreparo: number;
  entregadorId?: number;
  observacao?: string;
  dataAtualizacao: Date;
}