import { useMemo, useState } from 'react'
import ProductGrid from '../catalog/ProductGrid'
import StoreList from '../catalog/StoreList'

const highlights = [
  {
    title: 'Compra rapida',
    description: 'Explora productos destacados con informacion dinamica.',
  },
  {
    title: 'Tiendas activas',
    description: 'Conoce los locales disponibles en formato de listado.',
  },
  {
    title: 'Acceso por secciones',
    description: 'Salta directamente a login, registro, perfil o vendedor.',
  },
]

export default function HomeSection({ products, stores, currentUser, onNavigate, onCheckout }) {
  const [cartItems, setCartItems] = useState([])
  const [feedback, setFeedback] = useState('')

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  )

  const handleAddToCart = (product, quantity) => {
    if (!currentUser) {
      onNavigate('login')
      return { ok: false, message: 'Debes iniciar sesion para comprar.' }
    }

    const existingItem = cartItems.find((item) => item.product.id === product.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0

    if (product.stock < currentQuantity + quantity) {
      setFeedback('No hay stock suficiente para esa cantidad.')
      return { ok: false, message: 'No hay stock suficiente.' }
    }

    setCartItems((previous) => {
      const itemExists = previous.find((item) => item.product.id === product.id)

      if (itemExists) {
        return previous.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...previous, { product, quantity }]
    })

    setFeedback(`${product.name} agregado al carrito.`)
    return { ok: true }
  }

  const handleRemoveFromCart = (productId) => {
    setCartItems((previous) => previous.filter((item) => item.product.id !== productId))
  }

  const handleCheckout = () => {
    const result = onCheckout(cartItems)
    setFeedback(result.message)

    if (result.ok) {
      setCartItems([])
    }
  }

  const handleOpenStore = (store) => {
    if (!currentUser) {
      onNavigate('login')
      return
    }

    setFeedback(`Tienda seleccionada: ${store.name}`)
  }

  const quickActions = currentUser
    ? [
        { key: 'profile', label: 'Ver perfil' },
        ...(currentUser.role === 'admin' ? [{ key: 'admin', label: 'Panel administrador' }] : []),
        ...(currentUser.role === 'seller' ? [{ key: 'seller', label: 'Abrir panel vendedor' }] : []),
      ]
    : [
        { key: 'login', label: 'Ir a login' },
        { key: 'register', label: 'Ir a registro' },
        { key: 'profile', label: 'Ver perfil' },
        { key: 'seller', label: 'Abrir panel vendedor' },
      ]

  return (
    <section className="section-block" aria-labelledby="home-title">
      <h1 id="home-title" className="page-title">Bienvenido a Zofri</h1>
      <div className="section-card">
        {highlights.map((item) => (
          <div key={item.title} className="home-highlight">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
        <div className="home-actions">
          {quickActions.map((action) => (
            <button key={action.key} type="button" onClick={() => onNavigate(action.key)}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
      {feedback ? <p className="section-feedback">{feedback}</p> : null}

      <ProductGrid products={products} onAddToCart={handleAddToCart} currentUser={currentUser} />

      <div className="section-card">
        <h2>Carrito de compras</h2>
        {cartItems.length === 0 ? (
          <p>No hay productos agregados.</p>
        ) : (
          <>
            <ul className="seller-list">
              {cartItems.map((item) => (
                <li key={item.product.id}>
                  <span>{item.product.name}</span>
                  <span>Cantidad: {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toLocaleString('es-CL')}</span>
                  <button type="button" onClick={() => handleRemoveFromCart(item.product.id)}>
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> ${cartTotal.toLocaleString('es-CL')}</p>
            <button type="button" onClick={handleCheckout}>Comprar carrito</button>
          </>
        )}
      </div>

      <StoreList stores={stores} onOpenStore={handleOpenStore} />
    </section>
  )
}
