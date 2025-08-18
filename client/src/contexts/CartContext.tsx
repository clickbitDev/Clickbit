import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { createCartItemData, createCartItemDataFromProductId, CartItemData } from '../services/productUtils';

// Types
interface CartItem {
  id: string; // Product ID (number as string)
  productId: number; // Actual product ID
  name: string; // Full product name
  serviceSlug: string; // Service slug for reference
  serviceName: string; // Service name
  price: number;
  description: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  addItemByServiceAndTier: (serviceSlug: string, tierName: string, quantity?: number) => void;
  addItemByProductId: (productId: number, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItem = { ...action.payload };
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
      
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
      };
      
    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Add item to cart
  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
  };

  // Add item by service slug and tier name
  const addItemByServiceAndTier = (serviceSlug: string, tierName: string, quantity: number = 1) => {
    console.log('addItemByServiceAndTier called with:', { serviceSlug, tierName, quantity });
    const cartItemData = createCartItemData(serviceSlug, tierName);
    console.log('cartItemData result:', cartItemData);
    if (cartItemData) {
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: cartItemData.productId.toString(),
        productId: cartItemData.productId,
        name: cartItemData.name,
        serviceSlug: cartItemData.serviceSlug,
        serviceName: cartItemData.serviceName,
        price: cartItemData.price,
        description: cartItemData.description,
      };
      console.log('Dispatching cart item:', cartItem);
      dispatch({ type: 'ADD_ITEM', payload: { ...cartItem, quantity } });
    } else {
      console.error('Failed to create cart item data for:', { serviceSlug, tierName });
    }
  };

  // Add item by product ID
  const addItemByProductId = (productId: number, quantity: number = 1) => {
    const cartItemData = createCartItemDataFromProductId(productId);
    if (cartItemData) {
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: cartItemData.productId.toString(),
        productId: cartItemData.productId,
        name: cartItemData.name,
        serviceSlug: cartItemData.serviceSlug,
        serviceName: cartItemData.serviceName,
        price: cartItemData.price,
        description: cartItemData.description,
      };
      dispatch({ type: 'ADD_ITEM', payload: { ...cartItem, quantity } });
    }
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get item quantity
  const getItemQuantity = (id: string): number => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    ...state,
    addItem,
    addItemByServiceAndTier,
    addItemByProductId,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 