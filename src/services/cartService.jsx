// API service for cart operations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class CartService {
  // Get user's cart
  async getCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      // For non-logged in users, return enriched local storage cart
      await this.enrichCartWithProductDetails();
      return this.getLocalCart();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Clear invalid token and fallback to local storage
        console.warn('Invalid token detected, clearing authentication');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        await this.enrichCartWithProductDetails();
        return this.getLocalCart();
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      // Enrich cart items with product details if needed
      const cart = data.cart || data;
      if (cart.items && cart.items.length > 0) {
        // Enhance items with product details from populated data
        cart.items = cart.items.map(item => ({
          ...item,
          // Handle both populated and non-populated items
          name: item.name || (item.productId?.name) || `Product ${item.productId}`,
          brand: item.brand || (item.productId?.brand) || 'Generic',
          image: item.image || (item.productId?.image) || '/assets/default-part.jpg',
          price: item.price || (item.productId?.price) || 0,
          productId: item.productId?._id || item.productId,
          // Ensure quantity field exists
          quantity: item.quantity || item.qty || 1
        }));
      }
      return cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      // For network errors, try local storage fallback
      try {
        await this.enrichCartWithProductDetails();
        return this.getLocalCart();
      } catch (localError) {
        console.error('Error with local cart fallback:', localError);
        return this.getLocalCart();
      }
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
        // First fetch product details to store in local cart
        const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product details');
        }
        const product = await productResponse.json();
        
        const cart = this.getLocalCart();
        const existingItem = cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            productId: product._id,
            name: product.name,
            brand: product.brand,
            image: product.images?.[0] || product.image || '/assets/default-part.jpg',
            price: product.price,
            quantity: quantity
          });
        }
        
        this.saveLocalCart(cart);
        return cart;
      }

      if (response.status === 401) {
        // Clear invalid token and fallback to local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Fetch product details for local storage fallback
        try {
          const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
          if (productResponse.ok) {
            const product = await productResponse.json();
            const cart = this.getLocalCart();
            const existingItem = cart.items.find(item => item.productId === productId);
            
            if (existingItem) {
              existingItem.quantity += quantity;
            } else {
              cart.items.push({
                productId: product._id,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.price,
                quantity: quantity
              });
            }
            
            this.saveLocalCart(cart);
            return cart;
          }
        } catch (productError) {
          console.warn('Failed to fetch product details:', productError);
        }
        
        // Fallback to minimal data but preserve existing items
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
      try {
        const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (productResponse.ok) {
          const product = await productResponse.json();
          const cart = this.getLocalCart();
          const existingItem = cart.items.find(item => item.productId === productId);
          
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.items.push({
              productId: product._id,
              name: product.name,
              brand: product.brand,
              image: product.image,
              price: product.price,
              quantity: quantity
            });
          }
          
          this.saveLocalCart(cart);
          return cart;
        }
      } catch (productError) {
        console.warn('Failed to fetch product details:', productError);
      }
      
      // Final fallback to minimal data but preserve existing items
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
        const cart = data.cart || data;
        // Enrich cart items with product details if needed
        if (cart.items && cart.items.length > 0) {
          cart.items = cart.items.map(item => ({
            ...item,
            name: item.name || (item.productId?.name) || `Product ${item.productId}`,
            brand: item.brand || (item.productId?.brand) || 'Generic',
            image: item.image || (item.productId?.image) || '/assets/default-part.jpg',
            price: item.price || (item.productId?.price) || 0,
            productId: item.productId?._id || item.productId,
            quantity: item.quantity || item.qty || 1
          }));
        }
        return cart;
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
      const cart = data.cart || data;
      // Enrich cart items with product details if needed
      if (cart.items && cart.items.length > 0) {
        cart.items = cart.items.map(item => ({
          ...item,
          name: item.name || (item.productId?.name) || `Product ${item.productId}`,
          brand: item.brand || (item.productId?.brand) || 'Generic',
          image: item.image || (item.productId?.image) || '/assets/default-part.jpg',
          price: item.price || (item.productId?.price) || 0,
          productId: item.productId?._id || item.productId,
          quantity: item.quantity || item.qty || 1
        }));
      }
      return cart;
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
    if (!localCart) {
      return { items: [] };
    }
    
    const cart = JSON.parse(localCart);
    
    // Ensure all items have required fields with defaults (no async fetching to prevent race conditions)
    if (cart.items && cart.items.length > 0) {
      cart.items = cart.items.map(item => ({
        ...item,
        name: item.name || `Product ${item.productId}`,
        brand: item.brand || 'Generic',
        image: item.image || '/assets/default-part.jpg',
        price: item.price || 0,
        quantity: item.quantity || item.qty || 1,
        productId: item.productId || item._id || item.id
      }));
    }
    
    return cart;
  }

  // New method to enrich cart items with product details
  async enrichCartWithProductDetails() {
    const cart = this.getLocalCart();
    
    if (!cart.items || cart.items.length === 0) {
      return cart;
    }
    
    // Find items that need enrichment
    const itemsNeedingEnrichment = cart.items.filter(item => 
      !item.name || item.name === `Product ${item.productId}` || item.brand === 'Generic' || item.price === 0
    );
    
    if (itemsNeedingEnrichment.length === 0) {
      return cart;
    }
    
    // Fetch missing product details
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        if (!item.name || item.name === `Product ${item.productId}` || item.brand === 'Generic' || item.price === 0) {
          try {
            const productResponse = await fetch(`${API_BASE_URL}/products/${item.productId}`);
            if (productResponse.ok) {
              const product = await productResponse.json();
              return {
                ...item,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.price,
                productId: item.productId
              };
            }
          } catch (error) {
            console.warn(`Failed to fetch details for product ${item.productId}:`, error);
          }
        }
        
        // Return original item with defaults
        return item;
      })
    );
    
    cart.items = enrichedItems;
    
    // Save the enriched cart back to localStorage
    localStorage.setItem('localCart', JSON.stringify(cart));
    
    return cart;
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