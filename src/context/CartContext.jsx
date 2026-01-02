// --- src/context/CartContext.jsx ---
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService.jsx';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CART: 'SET_CART',
  CLEAR_CART: 'CLEAR_CART',
  SET_OPERATION_LOADING: 'SET_OPERATION_LOADING'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case CART_ACTIONS.SET_CART:
      const cart = action.payload;
      const items = cart.items || [];
      const totals = cartService.calculateTotals(cart);
      return {
        ...state,
        cart: cart,
        cartItems: items,
        cartCount: cartService.getItemCount(cart),
        ...totals,
        loading: false,
        error: null,
        operationLoading: false
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return { 
        ...state, 
        cart: { items: [] },
        cartItems: [],
        cartCount: 0,
        totalPrice: 0,
        subtotal: 0,
        loading: false,
        error: null,
        operationLoading: false
      };
    
    case CART_ACTIONS.SET_OPERATION_LOADING:
      return { ...state, operationLoading: action.payload };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  cart: { items: [] },
  cartItems: [],
  loading: false,
  error: null,
  cartCount: 0,
  totalPrice: 0,
  subtotal: 0,
  operationLoading: false
};

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth();
    
    // Re-render cart when items change
    const cartItems = state.cart?.items || [];
    // Note: React will automatically re-render when state changes

    // Load cart when component mounts or user logs in/out
    useEffect(() => {
        if (user) {
            // Sync local cart and then load from backend
            syncCart();
        } else {
            // For non-logged in users, load from localStorage only
            loadCart();
        }
    }, [user]);

    const loadCart = async () => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        
        try {
            const cart = await cartService.getCart();
            
            // If using localStorage, enrich missing product details
            if (!localStorage.getItem('token') && cart.items) {
                const enrichedCart = await cartService.enrichCartWithProductDetails();
                dispatch({ type: CART_ACTIONS.SET_CART, payload: enrichedCart });
            } else {
                dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
            }
        } catch (error) {
            console.warn('Cart loading error, using fallback:', error.message);
            // Don't set error for 401 issues, just use empty cart
            const emptyCart = { items: [] };
            dispatch({ type: CART_ACTIONS.SET_CART, payload: emptyCart });
        } finally {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        }
    };

    const addToCart = async (product, quantity = 1) => {
        const productId = product._id || product.id || product.productId;
        
        try {
            console.log('Adding to cart:', { productId, product, quantity });
            const cart = await cartService.addToCart(productId, quantity);
            console.log('Cart service response:', cart);
            
            // Force cart refresh by fetching updated cart
            const updatedCart = await cartService.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            console.error('Add to cart error:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    const updateCartQuantity = async (productId, newQuantity) => {
        newQuantity = parseInt(newQuantity) || 1;
        
        if (newQuantity < 1) return;
        
        try {
            dispatch({ type: CART_ACTIONS.SET_OPERATION_LOADING, payload: true });
            const cart = await cartService.updateQuantity(productId, newQuantity);
            // Force cart refresh to ensure UI updates immediately
            const updatedCart = await cartService.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            console.error('Update quantity error:', error);
            dispatch({ type: CART_ACTIONS.SET_OPERATION_LOADING, payload: false });
            // Don't set error state to prevent cart reset
        }
    };

    const removeFromCart = async (productId) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_OPERATION_LOADING, payload: true });
            const cart = await cartService.removeFromCart(productId);
            // Force cart refresh to ensure UI updates immediately
            const updatedCart = await cartService.getCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            console.error('Remove from cart error:', error);
            dispatch({ type: CART_ACTIONS.SET_OPERATION_LOADING, payload: false });
            // Don't set error state to prevent cart reset
        }
    };

    const clearCart = async () => {
        try {
            const cart = await cartService.clearCart();
            dispatch({ type: CART_ACTIONS.CLEAR_CART });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // Helper function to check if product is in cart
    const isInCart = (productId) => {
        if (!productId || !state.cartItems) return false;
        return state.cartItems.some(item => {
            const itemProductId = item.productId || item._id || item.id;
            return itemProductId && itemProductId.toString() === productId.toString();
        });
    };

    // Get cart item quantity
    const getItemQuantity = (productId) => {
        if (!productId || !state.cartItems) return 0;
        const item = state.cartItems.find(item => {
            const itemProductId = item.productId || item._id || item.id;
            return itemProductId && itemProductId.toString() === productId.toString();
        });
        return item ? item.quantity || item.qty || 0 : 0;
    };

    // Sync local cart when user logs in
    const syncCart = async () => {
        try {
            const cart = await cartService.syncCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: cart });
        } catch (error) {
            console.warn('Cart sync error, using fallback:', error.message);
            // Use local cart as fallback
            const localCart = cartService.getLocalCart();
            dispatch({ type: CART_ACTIONS.SET_CART, payload: localCart });
        }
    };

    const cartContextValue = {
        // State
        cart: state.cart,
        cartItems: state.cartItems,
        loading: state.loading,
        error: state.error,
        cartCount: state.cartCount,
        totalPrice: state.totalPrice,
        subtotal: state.subtotal,
        operationLoading: state.operationLoading,
        
        // Actions
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        loadCart,
        syncCart,
        
        // Helpers
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;