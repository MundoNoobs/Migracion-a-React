import '../styles/StoreList.css';

export default function StoreList({ stores }) {
  return (
    <>
      <h2>Tiendas</h2>
      <section id="stores" className="stores-grid">
        {stores.map((store) => (
          <div key={store.id} className="store card">
            <img src={store.image} alt={store.name} />
            <div>{store.name}</div>
            <a href={`/store.html?localId=${store.id}`}>Ir</a>
          </div>
        ))}
      </section>
    </>
  );
}
