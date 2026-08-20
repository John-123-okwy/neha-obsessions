export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  OUT_FOR_DELIVERY: "out_for_delivery",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const STATUS_STEPS = [
  { key: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { key: ORDER_STATUS.PREPARING, label: "Preparing" },
  { key: ORDER_STATUS.READY, label: "Ready" },
  { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out for Delivery" },
  { key: ORDER_STATUS.COMPLETED, label: "Completed" },
];

export const STATUS_META = {
  [ORDER_STATUS.PENDING]: { label: "Pending", color: "#9CA3AF" },
  [ORDER_STATUS.CONFIRMED]: { label: "Confirmed", color: "#6B21A8" },
  [ORDER_STATUS.PREPARING]: { label: "Preparing", color: "#D97706" },
  [ORDER_STATUS.READY]: { label: "Ready", color: "#0D9488" },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: "Out for Delivery", color: "#C026D3" },
  [ORDER_STATUS.COMPLETED]: { label: "Completed", color: "#16A34A" },
  [ORDER_STATUS.CANCELLED]: { label: "Cancelled", color: "#DC2626" },
};