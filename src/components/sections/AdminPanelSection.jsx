import { useMemo, useState } from 'react'
import { validateEmail, validateName, validatePassword, validateRequiredFields } from '../../utils/validators'

const sellerFormFields = [
  { id: 'seller-name', label: 'Nombre', key: 'name', type: 'text' },
  { id: 'seller-email', label: 'Correo', key: 'email', type: 'email' },
  { id: 'seller-password', label: 'Contrasena', key: 'password', type: 'password' },
  { id: 'seller-image', label: 'Imagen de perfil', key: 'profileImage', type: 'text' },
]

export default function AdminPanelSection({ users, onCreateSeller }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', profileImage: '' })
  const [message, setMessage] = useState('')

  const sellers = useMemo(
    () => users.filter((user) => user.role === 'seller'),
    [users],
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const requiredValidation = validateRequiredFields(form, ['name', 'email', 'password'])
    if (!requiredValidation.ok) {
      setMessage(requiredValidation.message)
      return
    }

    const nameValidation = validateName(form.name)
    if (!nameValidation.ok) {
      setMessage(nameValidation.message)
      return
    }

    const emailValidation = validateEmail(form.email)
    if (!emailValidation.ok) {
      setMessage(emailValidation.message)
      return
    }

    const passwordValidation = validatePassword(form.password)
    if (!passwordValidation.ok) {
      setMessage(passwordValidation.message)
      return
    }

    const result = onCreateSeller(form)

    if (!result.ok) {
      setMessage(result.message)
      return
    }

    setMessage('Cuenta de vendedor creada y guardada.')
    setForm({ name: '', email: '', password: '', profileImage: '' })
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
