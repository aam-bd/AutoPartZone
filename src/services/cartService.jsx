// API service for cart operations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class CartService {
  // Get user's cart
  async getCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      // For non-logged in users, return empty cart or local storage cart
      return this.getLocalCart();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      return data.cart || data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return this.getLocalCart();
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');
    
    try {
      let response;
      
      if (token) {
        // Logged in user - save to backend
        response = await fetch(`${API_BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity })
        });
      } else {
        // Non-logged in user - save to local storage
        const cart = this.getLocalCart();
        const existingItem = cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
        
        this.saveLocalCart(cart);
        return cart;
      }

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      return data.cart || data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local storage
      const cart = this.getLocalCart();
      const existingItem = cart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      
      this.saveLocalCart(cart);
      return cart;
    }
  }

  // Update item quantity
  async updateQuantity(productId, quantity) {
    const token = localStorage.getItem('token');
    
    try {
      let response;
      
      if (token) {
        response = await fetch(`${API_BASE_URL}/cart/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity })
        });

        if (!response.ok) {
          throw new Error('Failed to update cart');
        }

        const data = await response.json();
        return data.cart || data;
      } else {
        // Non-logged in user - update local storage
        const cart = this.getLocalCart();
        const item = cart.items.find(item => item.productId === productId);
        
        if (item) {
          if (quantity <= 0 || isNaN(quantity)) {
            cart.items = cart.items.filter(item => item.productId !== productId);
          } else {
            item.quantity = parseInt(quantity);
          }
          this.saveLocalCart(cart);
        }
        
        return cart;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      // Fallback to local storage
      const cart = this.getLocalCart();
      const item = cart.items.find(item => item.productId === productId);
      
      if (item) {
        if (quantity <= 0 || isNaN(quantity)) {
          cart.items = cart.items.filter(item => item.productId !== productId);
        } else {
          item.quantity = parseInt(quantity);
        }
        this.saveLocalCart(cart);
      }
      
      return cart;
    }
  }

  // Remove item from cart
  async removeFromCart(productId) {
    const token = localStorage.getItem('token');
    
    try {
      let response;
      
      if (token) {
        response = await fetch(`${API_BASE_URL}/cart/remove`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });
      } else {
        // Non-logged in user - remove from local storage
        const cart = this.getLocalCart();
        cart.items = cart.items.filter(item => item.productId !== productId);
        this.saveLocalCart(cart);
        return cart;
      }

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      const data = await response.json();
      return data.cart || data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local storage
      const cart = this.getLocalCart();
      cart.items = cart.items.filter(item => item.productId !== productId);
      this.saveLocalCart(cart);
      return cart;
    }
  }

  // Clear entire cart
  async clearCart() {
    const token = localStorage.getItem('token');
    
    try {
      if (token) {
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }
      }
      
      // Always clear local storage
      localStorage.removeItem('localCart');
      return { items: [] };
    } catch (error) {
      console.error('Error clearing cart:', error);
      localStorage.removeItem('localCart');
      return { items: [] };
    }
  }

  // Sync local cart with backend (when user logs in)
  async syncCart() {
    const token = localStorage.getItem('token');
    const localCart = this.getLocalCart();
    
    if (!token || localCart.items.length === 0) {
      return this.getCart();
    }

    try {
      // Add each local cart item to backend
      for (const item of localCart.items) {
        await this.addToCart(item.productId, item.quantity);
      }
      
      // Clear local cart after sync
      localStorage.removeItem('localCart');
      
      return this.getCart();
    } catch (error) {
      console.error('Error syncing cart:', error);
      return localCart;
    }
  }

  // Helper methods for local storage
  getLocalCart() {
    const localCart = localStorage.getItem('localCart');
    return localCart ? JSON.parse(localCart) : { items: [] };
  }

  saveLocalCart(cart) {
    localStorage.setItem('localCart', JSON.stringify(cart));
  }

  // Calculate cart totals (useful for frontend)
  calculateTotals(cart) {
    if (!cart || !cart.items) {
      return {
        subtotal: 0,
        totalItems: 0,
        totalPrice: 0
      };
    }

    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 0);
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);

    return {
      subtotal,
      totalItems,
      totalPrice: subtotal // same as subtotal for now
    };
  }

  // Get cart item count
  getItemCount(cart) {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  }
}

export default new CartService();