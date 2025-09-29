

// Tipos baseados na sua API
export interface Order {
  id: number;
  orderNumber: string;
  customerName?: string;
  tableNumber?: number;
  orderType: 'Mesa' | 'Balcao' | 'Delivery';
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItemDTO[];
  createdAt: Date;
  notes?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDTO {

  id: number;
  orderNumber: string;
  customerId?: number;
  customerName?: string;
  userId: number;
  userName?: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  isDelivery: boolean;
  deliveryType: string;
  createdAt: Date;
  items: OrderItemDTO[];
  delivery?: DeliveryDTO;
}

export interface OrderItemDTO {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryDTO {
  id: number;
  orderId: number;
  deliveryPerson?: string;
  status: string;
  deliveryAddress?: string;
  customerPhone?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  orderNumber: string;
  customerName?: string;
  customerAddress?: string;
  orderAmount: number;
  orderItems: OrderItemDTO[];
}

// DTOs para criação
export interface CreateOrderDTO {
  customerId?: number;
  paymentMethod: string;
  deliveryType: string;
  items: CreateOrderItemDTO[];
}

export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderWithDeliveryDTO {
  customerId?: number;
  paymentMethod: string;
  deliveryInfo: DeliveryInfoDTO;
  items: CreateOrderItemDTO[];
}

export interface DeliveryInfoDTO {
  deliveryType: string;
  deliveryPerson?: string;
  deliveryAddress?: string;
  customerPhone?: string;
  estimatedDeliveryTime?: Date;
}

export interface UpdateOrderStatusDTO {
  status: string;
}

// Tipos específicos do PDV
export type OrderType = 'delivery' | 'takeaway' | 'dinein';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  stock: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: number;
}
// Adicionar no final do arquivo src/types/order.ts

// Estatísticas de entrega
export interface DeliveryStatsDTO {
  totalDeliveries: number;
  pendingDeliveries: number;
  inProgressDeliveries: number;
  completedDeliveries: number;
  todayDeliveries: number;
  averageDeliveryTime: number;
}

 // Tipos para o PDV
 export interface Customer {
 id: number;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
  dataCadastro: Date;
  dataNascimento?: Date;
  ativo: boolean;
  observacoes?: string;
  enderecos: Endereco[];
 }
export interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: number;
}

export interface CreateOrderRequest {
  customerId?: number;
  tableNumber?: number;
  orderType: string;
  notes?: string;
}

export interface AddItemsRequest {
  orderId: number;
  items: CreateOrderItemDTO[];
}

export interface ProcessPaymentRequest {
  orderId: number;
  paymentMethod: string;
  amount: number;
  transactionId?: string;
}