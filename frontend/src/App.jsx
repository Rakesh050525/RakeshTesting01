import React, { useEffect, useState } from 'react'

function ProductCard({ p, onAdd }) {
  return (
    <article className="product" aria-labelledby={`prod-${p.id}`}>
      <h3 id={`prod-${p.id}`}>{p.name}</h3>
      <div className="price">${p.price.toFixed(2)}</div>
      <div className="meta">{p.category}</div>
      <button onClick={(e) => onAdd(p.id, e.currentTarget.closest('.product'))} aria-label={`Add ${p.name} to cart`}>Add to cart</button>
    </article>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [sort, setSort] = useState('default')
  const [category, setCategory] = useState('all')

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  async function fetchCart() {
    const res = await fetch('/api/cart')
    const data = await res.json()
    setCart(data.items || [])
  }

  useEffect(() => { fetchCart() }, [])

  async function addToCart(id, cardEl) {
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ id, quantity: 1 }) })
    if (cardEl) {
      cardEl.classList.add('added')
      setTimeout(() => cardEl.classList.remove('added'), 700)
    }
    await fetchCart()
  }

  async function removeFromCart(id) {
    await fetch('/api/cart/' + id, { method: 'DELETE' })
    await fetchCart()
  }

  const categories = Array.from(new Set(products.map(p => p.category))).sort()

  let visible = products.slice()
  if (category !== 'all') visible = visible.filter(p => p.category === category)
  if (sort === 'low') visible.sort((a,b)=>a.price-b.price)
  if (sort === 'high') visible.sort((a,b)=>b.price-a.price)

  return (
    <div className="container">
      <header className="hero">
        <h1 className="logo">ShopSpark</h1>
        <p className="tag">A colorful, accessible shopping demo</p>
        <div className="controls" role="toolbar" aria-label="sorting and filtering">
          <div className="group">
            <span>Sort:</span>
            <label><input type="radio" name="sort" checked={sort==='default'} onChange={()=>setSort('default')} /> Default</label>
            <label><input type="radio" name="sort" checked={sort==='low'} onChange={()=>setSort('low')} /> Price Low→High</label>
            <label><input type="radio" name="sort" checked={sort==='high'} onChange={()=>setSort('high')} /> Price High→Low</label>
          </div>
          <div className="group" style={{marginLeft:12}}>
            <span>Category:</span>
            <label><input type="radio" name="cat" checked={category==='all'} onChange={()=>setCategory('all')} /> All</label>
            {categories.map(c => (
              <label key={c}><input type="radio" name="cat" checked={category===c} onChange={()=>setCategory(c)} /> {c}</label>
            ))}
          </div>
        </div>
      </header>
      <main>
        <section>
          <h2>Products</h2>
          <div id="products" className="products">
            {visible.map(p => <ProductCard key={p.id} p={p} onAdd={addToCart} />)}
          </div>
        </section>
        <aside>
          <h2>Your Cart</h2>
          <div className="cart">
            {cart.length === 0 && <div>Cart is empty</div>}
            {cart.map(it => (
              <div className="cart-item" key={it.product.id}>
                <div>{it.product.name} — {it.quantity} × ${it.product.price.toFixed(2)}</div>
                <div><button onClick={()=>removeFromCart(it.product.id)} aria-label={`Remove ${it.product.name}`}>Remove</button></div>
              </div>
            ))}
            {cart.length > 0 && <div className="total"><strong>Total: ${cart.reduce((s,it)=>s+it.product.price*it.quantity,0).toFixed(2)}</strong></div>}
            <button className="checkout" onClick={async ()=>{ await fetch('/api/checkout',{method:'POST'}); await fetchCart(); alert('Checkout completed') }}>Checkout</button>
          </div>
        </aside>
      </main>
    </div>
  )
}
