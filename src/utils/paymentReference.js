export function generatePaymentReference() {
  return `NEHA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}