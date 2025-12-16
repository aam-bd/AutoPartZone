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
      search: params.search || '',
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
    // Return mock data instead of API call
    const mockProducts = [
      {
        _id: '1',
        name: 'Car Side View Mirror',
        brand: 'AutoVision',
        category: 'Mirrors',
        price: 120,
        oldPrice: 149,
        discount: 20,
        rating: 4.5,
        image: '/assets/default-part.jpg',
        reviews: 88,
        stock: 50
      },
      {
        _id: '2',
        name: 'Car Brake Pads',
        brand: 'BrakeMaster',
        category: 'Brakes',
        price: 85,
        oldPrice: 100,
        discount: 15,
        rating: 4.2,
        image: '/assets/default-part.jpg',
        reviews: 75,
        stock: 30
      },
      {
        _id: '3',
        name: 'Engine Oil Filter',
        brand: 'FilterPro',
        category: 'Filters',
        price: 25,
        rating: 4.8,
        image: '/assets/default-part.jpg',
        reviews: 156,
        stock: 100
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      products: mockProducts,
      pagination: {
        current: 1,
        pages: 1,
        total: mockProducts.length,
        limit: 20
      }
    };
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
  async createProduct(productData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return await response.json();
  }

  // Admin only: Update product
  async updateProduct(productId, productData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
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