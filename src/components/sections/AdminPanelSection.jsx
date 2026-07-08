import { useMemo, useState } from 'react'

const sellerFormFields = [
  { id: 'seller-name', label: 'Nombre', key: 'name', type: 'text' },
  { id: 'seller-email', label: 'Correo', key: 'email', type: 'email' },
  { id: 'seller-password', label: 'Contrasena', key: 'password', type: 'password' },
]

export default function AdminPanelSection({ users, onCreateSeller }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const sellers = useMemo(
    () => users.filter((user) => user.role === 'seller'),
    [users],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onCreateSeller(form)

    if (!result.ok) {
      setMessage(result.message)
      return
    }

    setMessage('Cuenta de vendedor creada y guardada.')
    setForm({ name: '', email: '', password: '' })
  }

  return (
    <section className="section-block" aria-labelledby="admin-title">
      <h1 id="admin-title" className="page-title">Panel de administrador</h1>

      <div className="section-card">
        <h2>Crear cuenta de vendedor</h2>
        <form className="section-form-inline" onSubmit={handleSubmit}>
          {sellerFormFields.map((field) => (
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
          <button type="submit">Crear vendedor</button>
        </form>
        {message ? <p role="status">{message}</p> : null}
      </div>

      <div className="section-card">
        <h2>Vendedores registrados</h2>
        <ul className="seller-list">
          {sellers.map((seller) => (
            <li key={seller.id}>
              <span>{seller.name}</span>
              <span>{seller.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
