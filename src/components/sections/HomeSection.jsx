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

const quickActions = [
  { key: 'login', label: 'Ir a login' },
  { key: 'register', label: 'Ir a registro' },
  { key: 'profile', label: 'Ver perfil' },
  { key: 'seller', label: 'Abrir panel vendedor' },
]

export default function HomeSection({ products, stores, onNavigate }) {
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
      <ProductGrid products={products} />
      <StoreList stores={stores} />
    </section>
  )
}
