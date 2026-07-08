import ProductGrid from '../catalog/ProductGrid'
import StoreList from '../catalog/StoreList'

export default function HomeSection({ products, stores }) {
  return (
    <section className="section-block" aria-labelledby="home-title">
      <h1 id="home-title" className="page-title">Bienvenido a Zofri</h1>
      <ProductGrid products={products} />
      <StoreList stores={stores} />
    </section>
  )
}
