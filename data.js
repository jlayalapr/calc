// Glow-AI Dashboard — sample data
// All imagery from Unsplash (public CDN)

window.GLOW_DATA = {
  user: {
    name: "Amelia",
    skinType: "combination",
    skinAge: 28,
    streak: 14,
    joinedDays: 127,
  },

  personas: {
    combination: {
      label: "Combination",
      todayAnalysis: "Your T-zone is a little reactive today. Light hydration on cheeks, balance the forehead.",
      weather: "Dry air, 42% humidity",
      focus: ["Hydration", "Balance"],
      rx: "A gel-cream will do more than a heavy cream tonight.",
    },
    dry: {
      label: "Dry",
      todayAnalysis: "Your barrier is asking for lipids. Layer a ceramide cream over damp skin tonight.",
      weather: "Cold front, 28% humidity",
      focus: ["Barrier", "Nourish"],
      rx: "Skip the exfoliant today. Double cleanse, then occlusive finish.",
    },
    oily: {
      label: "Oily",
      todayAnalysis: "Sebum is up 12% from last week. A niacinamide serum will calm things.",
      weather: "Humid, 71% humidity",
      focus: ["Clarify", "Oil control"],
      rx: "Gentle BHA tonight, hydrating toner, skip the rich cream.",
    },
    sensitive: {
      label: "Sensitive",
      todayAnalysis: "Redness index elevated. Keep it simple — cleanse, soothe, barrier repair.",
      weather: "Pollen high, 51% humidity",
      focus: ["Calm", "Protect"],
      rx: "No actives tonight. Centella and panthenol only.",
    },
  },

  expiring: [
    { id: "e1", brand: "Aera Botanica", name: "Rose Hydrating Mist", daysLeft: 6, opened: 174, total: 180, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400" },
    { id: "e2", brand: "Maison Clé", name: "Vitamin C Serum 15%", daysLeft: 12, opened: 78, total: 90, img: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400" },
  ],

  shelf: [
    { id: "p1", brand: "Aera Botanica", name: "Rose Hydrating Mist", category: "Toner", daysLeft: 6, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600", notes: "Reapply mid-day when the office AC runs.", actives: ["Rose water", "Glycerin", "Panthenol"], rating: 4.6, price: 38 },
    { id: "p2", brand: "Maison Clé", name: "Vitamin C Serum 15%", category: "Serum", daysLeft: 12, img: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600", notes: "AM only. Follow with SPF.", actives: ["L-Ascorbic Acid 15%", "Ferulic", "Vitamin E"], rating: 4.8, price: 72 },
    { id: "p3", brand: "Noor & Pine", name: "Ceramide Cream", category: "Moisturizer", daysLeft: 58, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600", notes: "Night anchor. Pairs with retinal.", actives: ["Ceramide NP", "Squalane", "Cholesterol"], rating: 4.9, price: 54 },
    { id: "p4", brand: "Sable Studio", name: "Gentle Gel Cleanser", category: "Cleanser", daysLeft: 112, img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f0?w=600", notes: "Double cleanse on SPF days.", actives: ["Glucoside", "Aloe", "Allantoin"], rating: 4.5, price: 32 },
    { id: "p5", brand: "Oré Laboratoire", name: "0.05% Retinal", category: "Treatment", daysLeft: 34, img: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=600", notes: "PM, Mon/Wed/Fri. Sandwich technique.", actives: ["Retinaldehyde 0.05%", "Bakuchiol"], rating: 4.7, price: 96 },
    { id: "p6", brand: "Maison Clé", name: "Polypeptide Eye", category: "Eye", daysLeft: 71, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600", notes: "AM + PM, pat with ring finger.", actives: ["Copper peptides", "Caffeine"], rating: 4.4, price: 68 },
    { id: "p7", brand: "Verre Minéral", name: "Mineral SPF 50", category: "SPF", daysLeft: 89, img: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600", notes: "Two-finger rule, reapply every 2h.", actives: ["Zinc Oxide 22%", "Iron oxides"], rating: 4.6, price: 42 },
    { id: "p8", brand: "Aera Botanica", name: "Azelaic Milk 10%", category: "Treatment", daysLeft: 24, img: "https://images.unsplash.com/photo-1620916297893-3c0a66b90fdf?w=600", notes: "PM on off-retinal nights.", actives: ["Azelaic acid 10%", "Niacinamide"], rating: 4.3, price: 48 },
  ],

  routine: {
    AM: [
      { id: "am1", step: "Cleanse", product: "Gentle Gel Cleanser", brand: "Sable Studio", time: "1 min", done: true },
      { id: "am2", step: "Tone", product: "Rose Hydrating Mist", brand: "Aera Botanica", time: "30 sec", done: true },
      { id: "am3", step: "Treat", product: "Vitamin C Serum 15%", brand: "Maison Clé", time: "2 min dry-down", done: false },
      { id: "am4", step: "Eye", product: "Polypeptide Eye", brand: "Maison Clé", time: "30 sec", done: false },
      { id: "am5", step: "Moisturize", product: "Ceramide Cream", brand: "Noor & Pine", time: "1 min", done: false },
      { id: "am6", step: "Protect", product: "Mineral SPF 50", brand: "Verre Minéral", time: "2 min", done: false },
    ],
    PM: [
      { id: "pm1", step: "First cleanse", product: "Oil Melt", brand: "Sable Studio", time: "1 min", done: false },
      { id: "pm2", step: "Second cleanse", product: "Gentle Gel Cleanser", brand: "Sable Studio", time: "1 min", done: false },
      { id: "pm3", step: "Tone", product: "Rose Hydrating Mist", brand: "Aera Botanica", time: "30 sec", done: false },
      { id: "pm4", step: "Treat", product: "0.05% Retinal", brand: "Oré Laboratoire", time: "10 min dry-down", done: false },
      { id: "pm5", step: "Eye", product: "Polypeptide Eye", brand: "Maison Clé", time: "30 sec", done: false },
      { id: "pm6", step: "Seal", product: "Ceramide Cream", brand: "Noor & Pine", time: "1 min", done: false },
    ],
  },

  scanResult: {
    match: 98,
    brand: "Maison Clé",
    name: "Vitamin C Serum 15%",
    verdict: "Good fit for combination skin",
    flags: [
      { label: "L-Ascorbic Acid 15%", tone: "good", note: "brightening" },
      { label: "Ferulic Acid", tone: "good", note: "stabilizer" },
      { label: "Fragrance", tone: "warn", note: "low, may tingle" },
    ],
    compatibility: 92,
    img: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600",
  },

  profileStats: [
    { label: "Skin age", value: "28" },
    { label: "Barrier", value: "Strong" },
    { label: "Hydration", value: "71%" },
  ],

  insights: [
    { id: "i1", day: "Mon", score: 82 },
    { id: "i2", day: "Tue", score: 79 },
    { id: "i3", day: "Wed", score: 85 },
    { id: "i4", day: "Thu", score: 88 },
    { id: "i5", day: "Fri", score: 84 },
    { id: "i6", day: "Sat", score: 91 },
    { id: "i7", day: "Sun", score: 87 },
  ],
};
