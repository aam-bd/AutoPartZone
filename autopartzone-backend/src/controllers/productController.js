import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    console.log('Add product - file:', req.file);
    console.log('Add product - body:', req.body);
    console.log('Add product - headers:', req.headers);

    let data = req.body;

    // Handle form data if image was uploaded
    if (req.file) {
      console.log('Processing form data with file upload...');
      // For FormData, values are already parsed correctly
      data = { ...req.body };
      
      // Convert string values to proper types
      if (data.price !== undefined) data.price = parseFloat(data.price);
      if (data.stock !== undefined) data.stock = parseInt(data.stock);
      if (data.isAvailable !== undefined) data.isAvailable = data.isAvailable === 'true';
    }

    const { name, brand, make, model, category, price, stock, description } = data;

    if (!name || !brand || !category || price == null || stock == null) {
      return res.status(400).json({ message: "All required fields are missing" });
    }

    // Prevent duplicates: same name + brand (+make +model when provided), case-insensitive
    const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const nameRe = { $regex: `^${escapeRegex(name)}$`, $options: "i" };
    const brandRe = { $regex: `^${escapeRegex(brand)}$`, $options: "i" };
    const dupQuery = { name: nameRe, brand: brandRe };
    if (make) dupQuery.make = { $regex: `^${escapeRegex(make)}$`, $options: "i" };
    if (model) dupQuery.model = { $regex: `^${escapeRegex(model)}$`, $options: "i" };
    const existing = await Product.findOne(dupQuery);
    if (existing) {
      return res.status(409).json({ message: "Product with same name, brand and make/model already exists" });
    }

    const productData = {
      name,
      brand,
      make: make || "",
      model: model || "",
      category,
      description: description || "",
      price,
      stock,
      isAvailable: true,
    };

    // Add image if uploaded
    if (req.file) {
      productData.images = [`/uploads/products/${req.file.filename}`];
    }

    console.log('Creating product with data:', productData);

    const product = new Product(productData);

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { raw } = req.query;

    if (raw === "true") {
      const products = await Product.find({ isAvailable: true });
      return res.json(products);
    }

    // Get all filter parameters
    const { 
      q: query,
      category,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock = true
    } = req.query;

    // Build search criteria
    const searchCriteria = { isAvailable: true };
    
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      searchCriteria.category = category;
    }
    
    if (brand) {
      searchCriteria.brand = brand;
    }
    
    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchCriteria.price.$lte = parseFloat(maxPrice);
    }
    
    if (inStock === 'true') {
      searchCriteria.stock = { $gt: 0 };
    }

    // Build sort criteria
    const sortCriteria = {};
    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(searchCriteria)
        .sort(sortCriteria)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(searchCriteria)
    ]);

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Hard delete document when id matches
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted", product: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const { type } = req.params;
    let query = { isAvailable: true, stock: { $gt: 0 } }; // Only show products with stock
    
    // For flash sales, get products with stock prioritized by recently added
    if (type === 'flash-sale') {
      // Get available products with stock as "flash sales"
      // First try to get recent products (last 30 days), if none, get any available products
      const recentDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: recentDate };
    }
    
    const products = await Product.find(query)
      .sort(type === 'flash-sale' ? { createdAt: -1 } : { stock: -1 })
      .limit(12);
    
    // If no recent products for flash sale, get any available products with stock
    if (type === 'flash-sale' && products.length === 0) {
      const fallbackProducts = await Product.find({ 
        isAvailable: true, 
        stock: { $gt: 0 } 
      })
      .sort({ createdAt: -1 })
      .limit(12);
      
      return res.json({ products: fallbackProducts });
    }
    
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    // Try with isAvailable filter first
    let categories;
    try {
      categories = await Product.distinct('category', { isAvailable: true });
    } catch (err) {
      console.error('Categories with isAvailable failed, trying without:', err);
      categories = await Product.distinct('category');
    }
    res.json({ categories });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product brands
export const getBrands = async (req, res) => {
  try {
    // Try with isAvailable filter first
    let brands;
    try {
      brands = await Product.distinct('brand', { isAvailable: true });
    } catch (err) {
      console.error('Brands with isAvailable failed, trying without:', err);
      brands = await Product.distinct('brand');
    }
    res.json({ brands });
  } catch (err) {
    console.error('Brands error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Update request - file:', req.file);
    console.log('Update request - body:', req.body);

    let updateData = req.body;

    // If image uploaded, handle form data differently
    if (req.file) {
      console.log('Processing update form data with file upload...');
      // With FormData, values are already parsed correctly
      updateData = { ...req.body };
      
      // Convert string values to proper types
      if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
      if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);
      if (updateData.isAvailable !== undefined) updateData.isAvailable = updateData.isAvailable === 'true';
      
      // Add the image
      updateData.images = [`/uploads/products/${req.file.filename}`];
    } else {
      // Regular JSON form data
      // Convert string values to proper types
      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price);
      }
      if (updateData.stock !== undefined) {
        updateData.stock = parseInt(updateData.stock);
      }
      if (updateData.discount !== undefined) {
        updateData.discount = parseFloat(updateData.discount) || 0;
      }

      // Convert boolean strings
      if (updateData.isAvailable !== undefined) {
        updateData.isAvailable = updateData.isAvailable === 'true' || updateData.isAvailable === true;
      }
    }

    console.log('Final update data:', updateData);

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get related products
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 8 } = req.query;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Find products in same category, excluding current product
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isAvailable: true,
      stock: { $gt: 0 }
    })
    .limit(parseInt(limit));
    
    res.json({ products: relatedProducts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};