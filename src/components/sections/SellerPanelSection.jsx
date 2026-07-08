import { useMemo, useState } from 'react'

const sellerTabs = [
  { key: 'products', label: 'Productos' },
  { key: 'stats', label: 'Estadisticas' },
  { key: 'orders', label: 'Pedidos' },
]

const orderItems = [
  { id: 'o1', customer: 'Cliente 1', status: 'Pendiente' },
  { id: 'o2', customer: 'Cliente 2', status: 'Despachado' },
]

export default function SellerPanelSection({ user, sellerProducts }) {
  const isSeller = user?.role === 'seller'
  const [activeTab, setActiveTab] = useState('products')
  const summary = useMemo(
    () => [
      { label: 'Publicados', value: sellerProducts.length },
      { label: 'Ventas del mes', value: 18 },
      { label: 'Pedidos activos', value: orderItems.length },
    ],
    [sellerProducts.length],
  )

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
          <div className="home-actions">
            {sellerTabs.map((tab) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'products' ? (
            <>
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
            </>
          ) : null}

          {activeTab === 'stats' ? (
            <>
              <h2>Resumen de actividad</h2>
              <ul className="seller-list">
                {summary.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {activeTab === 'orders' ? (
            <>
              <h2>Pedidos recientes</h2>
              <ul className="seller-list">
                {orderItems.map((order) => (
                  <li key={order.id}>
                    <span>{order.customer}</span>
                    <span>{order.status}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      )}
    </section>
  )
}
