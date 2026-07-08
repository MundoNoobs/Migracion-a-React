import '../../styles/ProductGrid.css'

export default function ProductGrid({ products }) {
  return (
    <section id="products" className="grid" aria-live="polite">
      {products.map((product) => (
        <article key={product.id} className="card">
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p>${product.price.toLocaleString('es-CL')}</p>
          <a href={`#product-${product.id}`}>Ver</a>
        </article>
      ))}
    </section>
  )
}
