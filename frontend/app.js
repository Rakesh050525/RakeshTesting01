async function fetchProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

async function fetchCart() {
  const res = await fetch('/api/cart');
  return res.json();
}

async function addToCart(id, cardEl) {
  await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ id, quantity: 1 }) });
  // simple animation on the card
  if (cardEl) {
    cardEl.classList.add('added');
    setTimeout(() => cardEl.classList.remove('added'), 700);
  }
  await renderCart();
}

async function removeFromCart(id) {
  await fetch('/api/cart/' + id, { method: 'DELETE' });
  await renderCart();
}

async function checkout() {
  const res = await fetch('/api/checkout', { method: 'POST' });
  const data = await res.json();
  alert(data.message);
  await renderCart();
}

async function renderProducts() {
  const products = await fetchProducts();
  const el = document.getElementById('products');
  el.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `<strong>${p.name}</strong><div class="price">$${p.price.toFixed(2)}</div>`;
    const btn = document.createElement('button');
    btn.textContent = 'Add to cart';
    btn.onclick = () => addToCart(p.id, div);
    div.appendChild(btn);
    el.appendChild(div);
  });
}

// Sorting UI
document.querySelectorAll('input[name="sort"]').forEach(r => {
  r.addEventListener('change', async () => {
    const val = document.querySelector('input[name="sort"]:checked').value;
    const products = await fetchProducts();
    let sorted = products.slice();
    if (val === 'low') sorted.sort((a,b)=>a.price-b.price);
    if (val === 'high') sorted.sort((a,b)=>b.price-a.price);
    // re-render with sorted order
    const el = document.getElementById('products');
    el.innerHTML = '';
    sorted.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `<strong>${p.name}</strong><div class="price">$${p.price.toFixed(2)}</div>`;
      const btn = document.createElement('button');
      btn.textContent = 'Add to cart';
      btn.onclick = () => addToCart(p.id, div);
      div.appendChild(btn);
      el.appendChild(div);
    });
  });
});

async function renderCart() {
  const data = await fetchCart();
  const el = document.getElementById('cart');
  el.innerHTML = '';
  if (!data.items || data.items.length === 0) {
    el.textContent = 'Cart is empty';
    return;
  }
  let total = 0;
  data.items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    const subtotal = it.product.price * it.quantity;
    total += subtotal;
    div.innerHTML = `${it.product.name} — ${it.quantity} × $${it.product.price.toFixed(2)} = $${subtotal.toFixed(2)}`;
    const rm = document.createElement('button');
    rm.textContent = 'Remove';
    rm.style.marginLeft = '8px';
    rm.onclick = () => removeFromCart(it.product.id);
    div.appendChild(rm);
    el.appendChild(div);
  });
  const t = document.createElement('div');
  t.style.marginTop = '8px';
  t.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  el.appendChild(t);
}

document.getElementById('checkout').addEventListener('click', checkout);

async function init() {
  await renderProducts();
  await renderCart();
}

init();
