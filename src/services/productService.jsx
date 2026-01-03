// API service for product operations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ProductService {
  // Get all products with optional filters
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      category: params.category || '',
      brand: params.brand || '',
      minPrice: params.minPrice || '',
      maxPrice: params.maxPrice || '',
      q: params.search || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      inStock: params.inStock !== undefined ? params.inStock : true
    });

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  }

  // Get single product by ID
  async getProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    return await response.json();
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    return this.getProducts({ ...params, category });
  }

  // Get products by brand
  async getProductsByBrand(brand, params = {}) {
    return this.getProducts({ ...params, brand });
  }

  // Search products
  async searchProducts(params = {}) {
    return this.getProducts(params);
  }

  // Get product categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  }

  // Get product brands
  async getBrands() {
    const response = await fetch(`${API_BASE_URL}/products/brands`);
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    return await response.json();
  }

  // Get featured products (flash sales, new arrivals, etc.)
  async getFeaturedProducts(type = 'featured') {
    const response = await fetch(`${API_BASE_URL}/products/featured/${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    return await response.json();
  }

  // Get product recommendations
  async getRecommendations(productId, userId = null) {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const url = userId 
      ? `${API_BASE_URL}/recommend/user/${userId}`
      : `${API_BASE_URL}/recommend/product/${productId}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    return await response.json();
  }

  // Check product availability
  async checkAvailability(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/availability`);
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    return await response.json();
  }

  // Get related products
  async getRelatedProducts(productId, limit = 8) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/related?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }
    return await response.json();
  }

  // Admin only: Create product
  async createProduct(productData, imageFile = null) {
    const token = localStorage.getItem('token');
    
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`
    };

    if (imageFile) {
      // Use FormData for file upload
      body = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          // Convert boolean to string for FormData
          const value = typeof productData[key] === 'boolean' ? String(productData[key]) : productData[key];
          body.append(key, value);
        }
      });
      body.append('image', imageFile);
    } else {
      // Use regular JSON if no image
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(productData);
    }

    console.log('Creating product - headers:', headers);
    console.log('Creating product - body type:', body.constructor.name);
    if (imageFile) {
      console.log('Image file:', imageFile.name, imageFile.type, imageFile.size);
    }

    const response = await fetch(`${API_BASE_URL}/products/add`, {
      method: 'POST',
      headers,
      body
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create product error response:', errorText);
      throw new Error('Failed to create product');
    }
    return await response.json();
  }

  // Admin only: Update product
  async updateProduct(productId, productData, imageFile = null) {
    const token = localStorage.getItem('token');
    
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`
    };

    if (imageFile) {
      // Use FormData for file upload
      body = new FormData();
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          // Convert boolean to string for FormData
          const value = typeof productData[key] === 'boolean' ? String(productData[key]) : productData[key];
          body.append(key, value);
        }
      });
      body.append('image', imageFile);
    } else {
      // Use regular JSON if no image
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(productData);
    }

    console.log('Updating product - headers:', headers);
    console.log('Updating product - body type:', body.constructor.name);
    if (imageFile) {
      console.log('Image file:', imageFile.name, imageFile.type, imageFile.size);
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers,
      body
    });

    console.log('Update response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update product error response:', errorText);
      throw new Error('Failed to update product');
    }
    return await response.json();
  }

  // Admin only: Delete product
  async deleteProduct(productId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return await response.json();
  }
}

export default new ProductService();