import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, brand, make, model, category, price, stock, description } = req.body;

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

    const product = new Product({
      name,
      brand,
      make: make || "",
      model: model || "",
      category,
      description: description || "",
      price,
      stock,
      isAvailable: true,
    });

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
    let query = { isAvailable: true };
    
    // For flash sales, we'll simulate with recent products (you can add discount field later)
    if (type === 'flash-sale') {
      // Get recently added products as "flash sales"
      query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    }
    
    const products = await Product.find(query)
      .sort(type === 'flash-sale' ? { createdAt: -1 } : { stock: -1 })
      .limit(12);
    
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isAvailable: true });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isAvailable: true });
    res.json({ brands });
  } catch (err) {
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