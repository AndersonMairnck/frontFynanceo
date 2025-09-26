// src/types/delivery.ts
export interface OrderStatus {
  id: string;
  name: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  icon: string;
}

export interface DeliveryOrder {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryPerson: string;
  status: string;
  deliveryFee: number;
  estimatedDeliveryTime: Date | null;
  actualDeliveryTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  orderAmount: number;
  orderItems?: OrderItemDTO[];
  notes?: string;
}

export interface OrderItemDTO {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  inProgressDeliveries: number;
  completedDeliveries: number;
  todayDeliveries: number;
  averageDeliveryTime: number;
}

export interface UpdateDeliveryStatusDTO {
  status: string;
  notes?: string;
}

export interface AssignDeliveryPersonDTO {
  deliveryPerson: string;
}

export interface DeliveryFilters {
  status?: string;
  date?: Date;
  type?: string;
  deliveryPerson?: string;
}