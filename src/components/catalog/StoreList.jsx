import '../../styles/StoreList.css'

export default function StoreList({ stores, onOpenStore }) {
  return (
    <>
      <h2>Tiendas</h2>
      <section id="stores" className="stores-grid" aria-live="polite">
        {stores.length === 0 ? <p>No hay vendedores registrados aun.</p> : null}
        {stores.map((store) => (
          <article key={store.id} className="store card">
            <img src={store.image} alt={store.name} />
            <div>{store.name}</div>
            <button type="button" onClick={() => onOpenStore(store)}>
              IR
            </button>
          </article>
        ))}
      </section>
    </>
  )
}
