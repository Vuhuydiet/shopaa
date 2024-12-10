// Enums for Order
export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  RETURNED = 'RETURNED',
}

// Enums for Return
export enum ReturnStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
