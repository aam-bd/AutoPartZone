import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    make: '',
    model: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    isAvailable: true
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      console.log('Fetched products:', data);
      setProducts(data.products || data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === '__new__') {
      setShowNewCategoryInput(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowNewCategoryInput(false);
      setFormData(prev => ({ ...prev, category: e.target.value }));
    }
  };

  const handleNewCategorySubmit = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      const category = newCategory.trim();
      setFormData(prev => ({ ...prev, category }));
      setShowNewCategoryInput(false);
      setNewCategory('');
      // Add to categories list if not already there
      if (!categories.includes(category)) {
        setCategories(prev => [...prev, category]);
      }
    }
  };

  const handleNewCategoryBlur = () => {
    if (newCategory.trim()) {
      const category = newCategory.trim();
      setFormData(prev => ({ ...prev, category }));
      setShowNewCategoryInput(false);
      setNewCategory('');
      // Add to categories list if not already there
      if (!categories.includes(category)) {
        setCategories(prev => [...prev, category]);
      }
    }
  };

  const handleAddCategoryClick = () => {
    if (newCategory.trim()) {
      const category = newCategory.trim();
      setFormData(prev => ({ ...prev, category }));
      setShowNewCategoryInput(false);
      setNewCategory('');
      // Add to categories list if not already there
      if (!categories.includes(category)) {
        setCategories(prev => [...prev, category]);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that category is set
    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting product data:', formData);
      console.log('Selected image:', selectedImage);
      console.log('Image preview:', imagePreview);
      
      if (editingProduct) {
        console.log('Updating product with image:', !!selectedImage);
        await productService.updateProduct(editingProduct._id, formData, selectedImage);
      } else {
        console.log('Creating product with image:', !!selectedImage);
        await productService.createProduct(formData, selectedImage);
      }
      
      // Refresh products to show updated images
      await fetchProducts();
      
      // Also fetch the specific updated product to ensure fresh data
      if (editingProduct) {
        try {
          const updatedProduct = await productService.getProductById(editingProduct._id);
          console.log('Fetched updated product:', updatedProduct);
          setProducts(prev => prev.map(p => 
            p._id === editingProduct._id ? { ...updatedProduct, id: updatedProduct._id } : p
          ));
        } catch (err) {
          console.error('Failed to fetch updated product:', err);
        }
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Product submission error:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      make: product.make || '',
      model: product.model || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      isAvailable: product.isAvailable
    });
    setSelectedImage(null);
    setImagePreview(product.image || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data.categories || data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      make: '',
      model: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      isAvailable: true
    });
    setEditingProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={product.images && product.images.length > 0 
                      ? `http://localhost:5000${product.images[0]}` 
                      : '/src/assets/default-part.jpg'} 
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    {product.make && product.model && (
                      <div className="text-sm text-gray-500">{product.make} {product.model}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product!
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Make</label>
                      <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    {!showNewCategoryInput ? (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                        <option value="__new__">+ Add New Category</option>
                      </select>
                    ) : (
                      <div className="mt-1">
                        <div className="text-xs text-gray-500 mb-1">
                          Adding new category: "{newCategory || '...'}"
                        </div>
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={handleNewCategorySubmit}
                          onBlur={handleNewCategoryBlur}
                          placeholder="Enter new category name"
                          className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={handleAddCategoryClick}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            disabled={!newCategory.trim()}
                          >
                            Add Category
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewCategoryInput(false);
                              setNewCategory('');
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="space-y-3">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Product preview" 
                            className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={handleImageRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="text-xs text-gray-500 mt-1">
                            {editingProduct && !selectedImage ? 'Current image' : selectedImage ? 'New image selected' : ''}
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="mt-2">
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Click to upload image
                              </span>
                              <span className="mt-1 block text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </span>
                            </label>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        </div>
                      )}
                      {editingProduct && !imagePreview && (
                        <button
                          type="button"
                          onClick={() => setImagePreview('/src/assets/default-part.jpg')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Use default image
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Available for sale</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;