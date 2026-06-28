export interface Product {
  id: string;
  name: string;
  category: "Chargers" | "Cables" | "Power Banks" | "Earbuds" | "Cases";
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  image: string;
  badge?: string;
}

export const categories = ["Chargers", "Cables", "Power Banks", "Earbuds", "Cases"] as const;

export const products: Product[] = [
  // Chargers
  {
    id: "chr-001",
    name: "GaN Fast Charger 65W",
    category: "Chargers",
    price: 3499,
    originalPrice: 4499,
    description: "Ultra-compact 65W GaN charger with dual USB-C ports. Charges your MacBook, iPhone, and iPad simultaneously at full speed.",
    features: ["65W Total Output", "GaN Technology", "Dual USB-C", "Overheat Protection", "Universal Compatibility"],
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80",
    badge: "Best Seller",
  },
  {
    id: "chr-002",
    name: "Wireless Charging Pad",
    category: "Chargers",
    price: 2499,
    originalPrice: 2999,
    description: "Sleek 15W fast wireless charging pad with LED indicator. Compatible with all Qi-enabled devices.",
    features: ["15W Fast Charge", "Qi Certified", "LED Indicator", "Slim Design", "Case Friendly"],
    image: "https://images.unsplash.com/photo-1622021195498-b24c577c2ec1?w=600&q=80",
  },
  {
    id: "chr-003",
    name: "Car Fast Charger Duo",
    category: "Chargers",
    price: 1999,
    description: "Dual-port car charger with 45W USB-C PD and 18W USB-A. Intelligent power distribution for safe fast charging on the go.",
    features: ["45W USB-C PD", "18W USB-A", "Intelligent Chip", "LED Ambient Light", "Compact Size"],
    image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&q=80",
    badge: "New",
  },
  // Cables
  {
    id: "cbl-001",
    name: "Braided USB-C to Lightning",
    category: "Cables",
    price: 1499,
    originalPrice: 1999,
    description: "Premium braided nylon cable with reinforced connectors. MFi certified for reliable iPhone charging and data sync.",
    features: ["MFi Certified", "Braided Nylon", "2 Meter Length", "Reinforced Connectors", "Fast Data Sync"],
    image: "https://images.unsplash.com/photo-1621018592736-23bd3d2f7f68?w=600&q=80",
    badge: "Popular",
  },
  {
    id: "cbl-002",
    name: "USB-C to USB-C Cable 100W",
    category: "Cables",
    price: 1799,
    description: "High-speed 100W USB-C cable with e-marker chip. Perfect for charging laptops and fast-charging smartphones.",
    features: ["100W Power Delivery", "E-Marker Chip", "Braided Design", "1.5 Meter", "480Mbps Data"],
    image: "https://images.unsplash.com/photo-1678197724056-7e61735a903c?w=600&q=80",
    badge: "New",
  },
  {
    id: "cbl-003",
    name: "3-in-1 Magnetic Cable",
    category: "Cables",
    price: 2199,
    originalPrice: 2699,
    description: "Versatile 3-in-1 cable with magnetic tips for USB-C, Lightning, and Micro-USB. One cable for all your devices.",
    features: ["3 Connectors", "Magnetic Tips", "Fast Charging", "LED Indicator", "Tangle-Free"],
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
  },
  // Power Banks
  {
    id: "pwb-001",
    name: "Magnetic Power Bank 10000mAh",
    category: "Power Banks",
    price: 4499,
    originalPrice: 5499,
    description: "Slim 10000mAh magnetic wireless power bank with 20W wired output. Snaps perfectly onto your iPhone for on-the-go charging.",
    features: ["10000mAh Capacity", "15W Wireless", "20W USB-C", "Magnetic Snap", "LED Battery Indicator"],
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
    badge: "Best Seller",
  },
  {
    id: "pwb-002",
    name: "Ultra-Slim Power Bank 5000mAh",
    category: "Power Banks",
    price: 2999,
    description: "Credit card-sized 5000mAh power bank. Slips into any pocket or wallet — perfect for emergency top-ups.",
    features: ["5000mAh", "Ultra-Slim 8mm", "20W USB-C", "Pass-Through Charging", "Pocket-Friendly"],
    image: "https://images.unsplash.com/photo-1589496933738-f0e3cde539b5?w=600&q=80",
  },
  {
    id: "pwb-003",
    name: "20000mAh Beast Power Bank",
    category: "Power Banks",
    price: 5999,
    description: "Massive 20000mAh capacity with triple output. Charges 4 phones or 2 tablets simultaneously. Built for travel.",
    features: ["20000mAh", "Triple Output", "65W USB-C", "Digital Display", "Airline Safe"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    badge: "Premium",
  },
  // Earbuds
  {
    id: "ear-001",
    name: "AirPods Pro-Style ANC Earbuds",
    category: "Earbuds",
    price: 6999,
    originalPrice: 8999,
    description: "Premium ANC earbuds with spatial audio and transparency mode. 36-hour total battery life with the charging case.",
    features: ["Active Noise Cancellation", "Spatial Audio", "36hr Battery", "IPX5 Water Resistant", "Touch Controls"],
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
    badge: "Best Seller",
  },
  {
    id: "ear-002",
    name: "Sports Clip Earbuds",
    category: "Earbuds",
    price: 3999,
    originalPrice: 4999,
    description: "Secure-fit ear-hook earbuds built for workouts. IPX7 waterproof, 12-hour playback, and powerful bass response.",
    features: ["Ear-Hook Design", "IPX7 Waterproof", "12hr Playback", "Bass Boost", "Built-in Mic"],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80",
  },
  {
    id: "ear-003",
    name: "Pod Mini Ultra Compact",
    category: "Earbuds",
    price: 4999,
    description: "The smallest true wireless earbuds with 24hr total battery. Feather-light at just 3.8g per earbud.",
    features: ["3.8g Lightweight", "24hr Battery", "Bluetooth 5.3", "Touch Control", "Compact Case"],
    image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&q=80",
    badge: "New",
  },
  // Cases
  {
    id: "cas-001",
    name: "Clear MagSafe Case",
    category: "Cases",
    price: 2499,
    originalPrice: 2999,
    description: "Crystal-clear anti-yellowing MagSafe case with military-grade drop protection. Shows off your iPhone's original color.",
    features: ["MagSafe Compatible", "Anti-Yellowing", "Military Drop Test", "Raised Edges", "Slim Profile"],
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80",
    badge: "Popular",
  },
  {
    id: "cas-002",
    name: "Leather Folio Wallet Case",
    category: "Cases",
    price: 3999,
    originalPrice: 4999,
    description: "Genuine leather folio case with card slots and a built-in stand. Premium protection that doubles as a wallet.",
    features: ["Genuine Leather", "Card Slots x3", "Built-in Stand", "Magnetic Closure", "RFID Blocking"],
    image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=600&q=80",
    badge: "Premium",
  },
  {
    id: "cas-003",
    name: "Shockproof Armor Case",
    category: "Cases",
    price: 2999,
    description: "Heavy-duty dual-layer armor case with kickstand and belt holster. Built for extreme environments and outdoor use.",
    features: ["Dual-Layer Protection", "Built-in Kickstand", "Belt Holster", "Port Covers", "Textured Grip"],
    image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80",
  },
  {
    id: "cas-004",
    name: "Silicone Soft-Touch Case",
    category: "Cases",
    price: 1799,
    description: "Ultra-thin silicone case with a velvety soft-touch finish. Minimal bulk, maximum grip, and vibrant color options.",
    features: ["Soft-Touch Finish", "Ultra-Thin 1mm", "Microfiber Lining", "Precise Cutouts", "10 Colors"],
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}
