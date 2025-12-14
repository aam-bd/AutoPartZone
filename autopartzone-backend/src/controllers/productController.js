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

    // Deduplicate by name+brand+make+model (case-insensitive). Return the newest document per group.
    const products = await Product.aggregate([
      { $match: { isAvailable: true } },
      {
        $addFields: {
          _nameLower: { $toLower: { $ifNull: ["$name", ""] } },
          _brandLower: { $toLower: { $ifNull: ["$brand", ""] } },
          _makeLower: { $toLower: { $ifNull: ["$make", ""] } },
          _modelLower: { $toLower: { $ifNull: ["$model", ""] } },
        },
      },
      {
        $sort: { _nameLower: 1, _brandLower: 1, _makeLower: 1, _modelLower: 1, createdAt: -1 }
      },
      {
        $group: {
          _id: { name: "$_nameLower", brand: "$_brandLower", make: "$_makeLower", model: "$_modelLower" },
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $project: { _nameLower: 0, _brandLower: 0, _makeLower: 0, _modelLower: 0 } }
    ]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Hard delete the document when id matches
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
