import { useEffect, useMemo, useState } from 'react'
import { validateProductPayload } from '../../utils/validators'

const productFields = [
  { id: 'seller-product-name', label: 'Nombre', key: 'name', type: 'text' },
  { id: 'seller-product-price', label: 'Valor', key: 'price', type: 'number' },
  { id: 'seller-product-stock', label: 'Stock', key: 'stock', type: 'number' },
  { id: 'seller-product-image', label: 'Imagen', key: 'image', type: 'text' },
]

const orderStatusOptions = ['en espera', 'empaquetando', 'enviado']

const emptyForm = {
  name: '',
  price: '',
  stock: '',
  image: '',
}

export default function SellerPanelSection({
  user,
  sellerProducts,
  sellerOrders,
  onCreateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) {
  const isSeller = user?.role === 'seller'
  const [activeTab, setActiveTab] = useState('products')
  const [form, setForm] = useState(emptyForm)
  const [editingProductId, setEditingProductId] = useState(null)
  const [message, setMessage] = useState('')

  const sellerSummary = useMemo(
    () => [
      { label: 'Productos publicados', value: sellerProducts.length },
      { label: 'Pedidos asociados', value: sellerOrders.length },
      {
        label: 'Ventas estimadas',
        value: sellerOrders.reduce((sum, order) => sum + order.total, 0),
      },
    ],
    [sellerOrders, sellerProducts.length],
  )

  useEffect(() => {
    if (!editingProductId) {
      return
    }

    const editingProduct = sellerProducts.find((product) => product.id === editingProductId)

    if (!editingProduct) {
      setEditingProductId(null)
      setForm(emptyForm)
      return
    }

    setForm({
      name: editingProduct.name,
      price: String(editingProduct.price),
      stock: String(editingProduct.stock),
      image: editingProduct.image,
    })
  }, [editingProductId, sellerProducts])

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image,
    }

    const productValidation = validateProductPayload(payload)
    if (!productValidation.ok) {
      setMessage(productValidation.message)
      return
    }

    const result = onCreateProduct({
      productId: editingProductId,
      product: payload,
    })

    setMessage(result.message)

    if (result.ok) {
      setForm(emptyForm)
      setEditingProductId(null)
    }
  }

  const handleEdit = (product) => {
    setEditingProductId(product.id)
    setActiveTab('products')
    setMessage('Editando producto seleccionado.')
  }

  const handleCancelEdit = () => {
    setEditingProductId(null)
    setForm(emptyForm)
    setMessage('Edicion cancelada.')
  }

  const handleDelete = (productId) => {
    const result = onDeleteProduct(productId)
    setMessage(result.message)
  }

  if (!user) {
    return (
      <section className="section-block" aria-labelledby="seller-title">
        <h1 id="seller-title" className="page-title">Panel de vendedor</h1>
        <div className="section-card">
          <p>Inicia sesion para acceder al panel de vendedor.</p>
        </div>
      </section>
    )
  }

  if (!isSeller) {
    return (
      <section className="section-block" aria-labelledby="seller-title">
        <h1 id="seller-title" className="page-title">Panel de vendedor</h1>
        <div className="section-card">
          <p>Tu cuenta no tiene permisos de vendedor.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-block" aria-labelledby="seller-title">
      <h1 id="seller-title" className="page-title">Panel de vendedor</h1>

      <div className="section-card">
        <ul className="seller-list">
          {sellerSummary.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <strong>{typeof item.value === 'number' ? item.value.toLocaleString('es-CL') : item.value}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <div className="home-actions">
          <button type="button" onClick={() => setActiveTab('products')}>
            Productos
          </button>
          <button type="button" onClick={() => setActiveTab('orders')}>
            Pedidos
          </button>
          <button type="button" onClick={() => setActiveTab('stats')}>
            Estadisticas
          </button>
        </div>
        {message ? <p role="status">{message}</p> : null}
      </div>

      {activeTab === 'products' ? (
        <div className="section-card">
          <h2>{editingProductId ? 'Editar producto' : 'Crear producto'}</h2>
          <form className="section-form-inline" onSubmit={handleSubmit}>
            {productFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  required
                  value={form[field.key]}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, [field.key]: event.target.value }))
                  }
                />
              </div>
            ))}

            <button type="submit">{editingProductId ? 'Guardar cambios' : 'Publicar producto'}</button>
            {editingProductId ? (
              <button type="button" onClick={handleCancelEdit}>
                Cancelar
              </button>
            ) : null}
          </form>

          <h2>Mis productos</h2>
          {sellerProducts.length === 0 ? (
            <p>No tienes productos publicados.</p>
          ) : (
            <ul className="seller-list">
              {sellerProducts.map((product) => (
                <li key={product.id}>
                  <span>{product.name}</span>
                  <span>Stock: {product.stock}</span>
                  <span>${product.price.toLocaleString('es-CL')}</span>
                  <div className="home-actions">
                    <button type="button" onClick={() => handleEdit(product)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(product.id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {activeTab === 'orders' ? (
        <div className="section-card">
          <h2>Pedidos recibidos</h2>
          {sellerOrders.length === 0 ? (
            <p>No hay pedidos asociados a tu cuenta.</p>
          ) : (
            <ul className="seller-list">
              {sellerOrders.map((order) => (
                <li key={order.id}>
                  <span>Cliente: {order.customerName}</span>
                  <span>Correo: {order.customerEmail}</span>
                  <span>Estado: {order.status}</span>
                  <strong>Total: ${order.total.toLocaleString('es-CL')}</strong>
                  <ul className="order-item-list">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.name} x{item.quantity} - ${item.unitPrice.toLocaleString('es-CL')} c/u
                      </li>
                    ))}
                  </ul>
                  <label htmlFor={`status-${order.id}`}>Actualizar estado</label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(event) => onUpdateOrderStatus(order.id, event.target.value)}
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {activeTab === 'stats' ? (
        <div className="section-card">
          <h2>Resumen de actividad</h2>
          <ul className="seller-list">
            {sellerSummary.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{typeof item.value === 'number' ? item.value.toLocaleString('es-CL') : item.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
