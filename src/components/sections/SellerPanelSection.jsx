export default function SellerPanelSection({ user, sellerProducts }) {
  const isSeller = user?.role === 'seller'

  return (
    <section className="section-block" aria-labelledby="seller-title">
      <h1 id="seller-title" className="page-title">Panel de vendedor</h1>

      {!user ? (
        <div className="section-card">
          <p>Inicia sesion para acceder al panel de vendedor.</p>
        </div>
      ) : !isSeller ? (
        <div className="section-card">
          <p>Tu cuenta no tiene permisos de vendedor.</p>
        </div>
      ) : (
        <div className="section-card">
          <h2>Productos publicados</h2>
          <ul className="seller-list">
            {sellerProducts.map((product) => (
              <li key={product.id}>
                <span>{product.name}</span>
                <span>Stock: {product.stock}</span>
                <span>${product.price.toLocaleString('es-CL')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
