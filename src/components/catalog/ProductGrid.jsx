import { useState } from 'react'
import '../../styles/ProductGrid.css'

export default function ProductGrid({ products, onAddToCart, currentUser, emptyMessage = 'No hay productos disponibles.' }) {
  const [quantities, setQuantities] = useState({})

  const handleAdd = (product) => {
    const quantity = quantities[product.id] ?? 1
    onAddToCart(product, quantity)
  }

  return (
    <section id="products" className="grid" aria-live="polite">
      {products.length === 0 ? <p className="grid-empty">{emptyMessage}</p> : null}
      {products.map((product) => (
        <article key={product.id} className="card">
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p>${product.price.toLocaleString('es-CL')}</p>
          <p>Stock: {product.stock}</p>
          <p>Vende: {product.sellerName}</p>
          <label className="product-quantity">
            Cantidad
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantities[product.id] ?? 1}
              onChange={(event) =>
                setQuantities((previous) => ({
                  ...previous,
                  [product.id]: Number(event.target.value),
                }))
              }
            />
          </label>
          <button type="button" onClick={() => handleAdd(product)} disabled={product.stock <= 0}>
            {currentUser ? 'Agregar al carrito' : 'Inicia sesion para comprar'}
          </button>
        </article>
      ))}
    </section>
  )
}
