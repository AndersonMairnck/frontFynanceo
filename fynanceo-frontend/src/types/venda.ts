// types/venda.ts
export enum FormaPagamento {
  DINHEIRO = 'dinheiro',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  PIX = 'pix'
}

export enum TipoConsumo {
  LOCAL = 'local',
  BALCAO = 'balcao',
  DELIVERY = 'delivery'
}

export interface ItemVenda {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  observacao?: string;
}

export interface Venda {
  id: number;
  data: Date;
  clienteId?: number;
  itens: ItemVenda[];
  formaPagamento: FormaPagamento;
  tipoConsumo: TipoConsumo;
  mesa?: number;
  garcomId?: number;
  entregadorId?: number;
  valorTotal: number;
  status: 'pendente' | 'confirmada' | 'cancelada';
}