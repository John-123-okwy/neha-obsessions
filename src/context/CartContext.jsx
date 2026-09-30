import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "neha-obsessions-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // customization (optional) shape: { cartKey, total, summary, message, referenceImage, requiresConfirmation }
  function addToCart(product, quantity = 1, customization = null) {
    const key = customization ? customization.cartKey : product.id;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === key);
      if (existing) {
        return prev.map((item) =>
          item.id === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: key,
          productId: product.id,
          name: product.name,
          price: customization ? customization.total : product.price,
          image: product.images?.[0] || product.image || "",
          quantity,
          customization: customization
            ? {
                summary: customization.summary,
                message: customization.message || "",
                referenceImage: customization.referenceImage || "",
                requiresConfirmation: customization.requiresConfirmation || false,
              }
            : null,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}0