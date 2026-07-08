import '../../styles/StoreList.css'

export default function StoreList({ stores }) {
  return (
    <>
      <h2>Tiendas</h2>
      <section id="stores" className="stores-grid" aria-live="polite">
        {stores.map((store) => (
          <article key={store.id} className="store card">
            <img src={store.image} alt={store.name} />
            <div>{store.name}</div>
            <a href={`#store-${store.id}`}>Ir</a>
          </article>
        ))}
      </section>
    </>
  )
}
