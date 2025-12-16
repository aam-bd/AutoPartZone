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
  CLEAR_CART: 'CLEAR_CART'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case CART_ACTIONS.SET_CART:
      const totals = cartService.calculateTotals(action.payload);
      return {
        ...state,
        cart: action.payload,
        cartItems: action.payload.items || [],
        cartCount: cartService.getItemCount(action.payload),
        ...totals,
        loading: false,
        error: null
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
        error: null
      };
    
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
  subtotal: 0
};

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth();

    // Load cart when component mounts or user logs in/out
    useEffect(() => {
        loadCart();
    }, [user]);

    const loadCart = async () => {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
        
        try {
            // Use mock cart data with demo products for better UX
            const mockCart = {
                items: [
                    {
                        _id: '1',
                        productId: '1',
                        name: 'Car Side View Mirror',
                        price: 120,
                        image: '/assets/default-part.jpg',
                        quantity: 1
                    },
                    {
                        _id: '2',
                        productId: '2',
                        name: 'Car Brake Pads',
                        price: 85,
                        image: '/assets/default-part.jpg',
                        quantity: 2
                    }
                ],
                _id: 'mock-cart-id'
            };
            dispatch({ type: CART_ACTIONS.SET_CART, payload: mockCart });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    const addToCart = async (product, quantity = 1) => {
        const productId = product._id || product.id || product.productId;
        
        try {
            // Mock add to cart - update local state
            const currentItems = [...state.cartItems];
            const existingItemIndex = currentItems.findIndex(item => 
                (item.productId && item.productId.toString() === productId.toString()) ||
                (item._id && item._id.toString() === productId.toString())
            );
            
            if (existingItemIndex !== -1) {
                currentItems[existingItemIndex].quantity += quantity;
            } else {
                currentItems.push({
                    _id: productId,
                    productId: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            const updatedCart = { items: currentItems, _id: 'mock-cart-id' };
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    const updateCartQuantity = async (productId, newQuantity) => {
        newQuantity = parseInt(newQuantity);
        
        try {
            let currentItems = [...state.cartItems];
            
            if (newQuantity <= 0 || isNaN(newQuantity)) {
                currentItems = currentItems.filter(item => 
                    (item.productId && item.productId.toString() !== productId.toString()) &&
                    (item._id && item._id.toString() !== productId.toString())
                );
            } else {
                const itemIndex = currentItems.findIndex(item => 
                    (item.productId && item.productId.toString() === productId.toString()) ||
                    (item._id && item._id.toString() === productId.toString())
                );
                
                if (itemIndex !== -1) {
                    currentItems[itemIndex].quantity = newQuantity;
                }
            }
            
            const updatedCart = { items: currentItems, _id: 'mock-cart-id' };
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const currentItems = state.cartItems.filter(item => 
                (item.productId && item.productId.toString() !== productId.toString()) &&
                (item._id && item._id.toString() !== productId.toString())
            );
            
            const updatedCart = { items: currentItems, _id: 'mock-cart-id' };
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    const clearCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.CLEAR_CART });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // Helper function to check if product is in cart
    const isInCart = (productId) => {
        return state.cartItems.some(item => 
            (item.productId && item.productId.toString() === productId.toString()) ||
            (item._id && item._id.toString() === productId.toString())
        );
    };

    // Get cart item quantity
    const getItemQuantity = (productId) => {
        const item = state.cartItems.find(item => 
            (item.productId && item.productId.toString() === productId.toString()) ||
            (item._id && item._id.toString() === productId.toString())
        );
        return item ? item.quantity || item.qty || 0 : 0;
    };

    // Add demo products to cart helper
    const addDemoProducts = async () => {
        const demoProducts = [
            {
                _id: '1',
                name: 'Car Side View Mirror',
                price: 120,
                image: '/assets/default-part.jpg',
                quantity: 1
            },
            {
                _id: '2',
                name: 'Car Brake Pads',
                price: 85,
                image: '/assets/default-part.jpg',
                quantity: 2
            }
        ];
        
        try {
            const updatedItems = [...state.cartItems];
            demoProducts.forEach(demoProduct => {
                const existingItemIndex = updatedItems.findIndex(item => 
                    (item.productId && item.productId.toString() === demoProduct._id.toString()) ||
                    (item._id && item._id.toString() === demoProduct._id.toString())
                );
                
                if (existingItemIndex === -1) {
                    updatedItems.push(demoProduct);
                }
            });
            
            const updatedCart = { items: updatedItems, _id: 'mock-cart-id' };
            dispatch({ type: CART_ACTIONS.SET_CART, payload: updatedCart });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
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
        
        // Actions
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        loadCart,
        addDemoProducts,
        
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