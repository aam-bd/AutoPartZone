import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const sampleProducts = [
  {
    name: "Car Side View Mirror",
    brand: "AutoVision",
    category: "Mirrors",
    description: "High-quality side view mirror with anti-glare coating and heated functionality.",
    price: 120,
    oldPrice: 149,
    stock: 50,
    rating: { average: 4.5, count: 88 },
    discount: 20,
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Material": "ABS Plastic",
      "Type": "Heated",
      "Fitment": "Universal",
      "Color": "Black"
    },
    tags: ["mirror", "side-view", "heated"],
    featured: true
  },
  {
    name: "Car Brake Pads",
    brand: "BrakeMaster",
    category: "Brakes",
    description: "Premium ceramic brake pads for superior stopping power and low dust.",
    price: 85,
    oldPrice: 100,
    stock: 30,
    rating: { average: 4.2, count: 75 },
    discount: 15,
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Material": "Ceramic",
      "Position": "Front",
      "Wear Sensor": "Included",
      "Warranty": "2 Years"
    },
    tags: ["brakes", "pads", "ceramic"],
    featured: true
  },
  {
    name: "LED Headlight Kit",
    brand: "BrightLight",
    category: "Lighting",
    description: "Ultra-bright LED headlight conversion kit with 6000K color temperature.",
    price: 150,
    oldPrice: 189,
    stock: 25,
    rating: { average: 4.7, count: 124 },
    discount: 21,
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Brightness": "8000 Lumens",
      "Color Temp": "6000K",
      "Voltage": "12V-24V",
      "Lifespan": "50,000 hours"
    },
    tags: ["headlights", "LED", "conversion"],
    featured: true
  },
  {
    name: "Car Battery",
    brand: "PowerCell",
    category: "Electrical",
    description: "Heavy-duty automotive battery with advanced calcium technology for extended life.",
    price: 200,
    oldPrice: 250,
    stock: 15,
    rating: { average: 4.6, count: 203 },
    discount: 20,
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Capacity": "75 Ah",
      "Voltage": "12V",
      "CCA": "850",
      "Warranty": "3 Years"
    },
    tags: ["battery", "electrical", "heavy-duty"],
    featured: true
  },
  {
    name: "Engine Oil Filter",
    brand: "FilterPro",
    category: "Filters",
    description: "High-efficiency oil filter with synthetic media for superior engine protection.",
    price: 25,
    stock: 100,
    rating: { average: 4.8, count: 156 },
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Media": "Synthetic Blend",
      "Micron Rating": "20",
      "Anti-Drain Back": "Yes",
      "Change Interval": "10,000 miles"
    },
    tags: ["oil", "filter", "synthetic"],
    featured: false
  },
  {
    name: "Spark Plugs",
    brand: "IgniteTech",
    category: "Ignition",
    description: "Iridium-tipped spark plugs for improved fuel efficiency and performance.",
    price: 35,
    stock: 80,
    rating: { average: 4.0, count: 42 },
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Material": "Iridium",
      "Gap": "0.044 inch",
      "Heat Range": "6",
      "Quantity": "Pack of 4"
    },
    tags: ["spark plugs", "ignition", "iridium"],
    featured: false
  },
  {
    name: "Air Filter",
    brand: "AirFlow",
    category: "Filters",
    description: "High-flow air filter designed for performance and longevity.",
    price: 18,
    stock: 120,
    rating: { average: 4.3, count: 89 },
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Type": "Panel",
      "Material": "Cotton Gauze",
      "Reusable": "Yes",
      "Cleaning": "Service required"
    },
    tags: ["air filter", "engine", "performance"],
    featured: false
  },
  {
    name: "Windshield Wipers",
    brand: "ClearView",
    category: "Exterior",
    description: "All-season windshield wiper blades with premium rubber for streak-free wiping.",
    price: 22,
    stock: 60,
    rating: { average: 4.1, count: 67 },
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Length": "22 inch",
      "Type": "Beam Blade",
      "Material": "Synthetic Rubber",
      "Fitment": "Universal Adapter"
    },
    tags: ["wipers", "windshield", "all-season"],
    featured: false
  },
  {
    name: "Shock Absorbers",
    brand: "RideTech",
    category: "Suspension",
    description: "Gas-charged shock absorbers for smooth ride and enhanced stability.",
    price: 180,
    oldPrice: 220,
    stock: 20,
    rating: { average: 4.4, count: 95 },
    discount: 18,
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Type": "Twin Tube",
      "Finish": "Black Powder Coat",
      "Mount": "Standard",
      "Warranty": "Limited Lifetime"
    },
    tags: ["shocks", "suspension", "performance"],
    featured: true
  },
  {
    name: "Alternator",
    brand: "PowerGen",
    category: "Electrical",
    description: "High-output alternator for reliable electrical system performance.",
    price: 280,
    stock: 12,
    rating: { average: 4.5, count: 48 },
    isAvailable: true,
    images: ["/assets/default-part.jpg"],
    specifications: {
      "Output": "140 Amps",
      "Voltage": "12V",
      "Pulley": "Included",
      "Warranty": "2 Years"
    },
    tags: ["alternator", "electrical", "charging"],
    featured: false
  }
];

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();