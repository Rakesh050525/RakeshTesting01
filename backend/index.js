const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Sample products
const products = [
  { id: 1, name: 'T-shirt', price: 19.99 },
  { id: 2, name: 'Coffee Mug', price: 9.99 },
  { id: 3, name: 'Notebook', price: 6.5 },
  { id: 4, name: 'Sticker Pack', price: 3.0 }
];

// In-memory cart: { productId: quantity }
let cart = {};

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  const items = Object.entries(cart).map(([id, qty]) => {
    const prod = products.find(p => p.id === parseInt(id));
    return { product: prod, quantity: qty };
  });
  res.json({ items });
});

app.post('/api/cart', (req, res) => {
  const { id, quantity } = req.body;
  if (!id || !quantity) return res.status(400).json({ error: 'id and quantity required' });
  const prod = products.find(p => p.id === parseInt(id));
  if (!prod) return res.status(404).json({ error: 'product not found' });
  cart[id] = (cart[id] || 0) + parseInt(quantity);
  res.json({ success: true, cart });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  if (cart[id]) delete cart[id];
  res.json({ success: true, cart });
});

app.post('/api/checkout', (req, res) => {
  // Simple checkout simulation
  cart = {};
  res.json({ success: true, message: 'Checkout completed (demo)' });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Shopping demo running on http://localhost:${PORT}`);
});
