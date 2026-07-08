import { useEffect, useMemo, useState } from 'react'
import { validateEmail, validateName, validatePassword, validateRequiredFields } from '../../utils/validators'

const profileBlocks = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'password', label: 'Contraseña' },
  { key: 'role', label: 'Rol' },
]

export default function UserProfileSection({
  user,
  orders,
  onNavigateToLogin,
  onSaveProfile,
  onMarkDelivered,
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', profileImage: '' })
  const [message, setMessage] = useState('')
  const profileData = useMemo(() => {
    if (!user) {
      return null
    }

    return {
      name: user.name,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage || '',
      role: user.role,
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      return
    }

    setForm({
      name: user.name,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage || '',
    })
  }, [user])

  const handleFileUpload = (event) => {
    const [file] = event.target.files || []
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        profileImage: typeof reader.result === 'string' ? reader.result : '',
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (event) => {
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

    const result = onSaveProfile(form)

    setMessage(result.message)

    if (result.ok) {
      setEditing(false)
    }
  }

  const maskPassword = (value) => '*'.repeat(Math.max(6, value?.length ?? 0))

  return (
    <section className="section-block" aria-labelledby="profile-title">
      <h1 id="profile-title" className="page-title">Perfil de usuario</h1>

      {!user ? (
        <div className="section-card">
          <p>Debes iniciar sesion para ver tu perfil.</p>
          <button type="button" onClick={onNavigateToLogin}>Ir a login</button>
        </div>
      ) : (
        <div className="section-card">
          {!editing ? (
            <>
              {profileData?.profileImage ? (
                <img
                  className="profile-image"
                  src={profileData.profileImage}
                  alt={`Foto de perfil de ${profileData.name}`}
                />
              ) : null}

              {profileBlocks.map((item) => (
                <p key={item.key}>
                  <strong>{item.label}:</strong>{' '}
                  {item.key === 'password' ? maskPassword(profileData?.password) : profileData[item.key]}
                </p>
              ))}

              <h2>Compras realizadas</h2>
              {orders.length === 0 ? (
                <p>No tienes compras registradas.</p>
              ) : (
                <ul className="seller-list">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <span>Estado: {order.status}</span>
                      <span>Cliente: {order.customerName}</span>
                      <span>Total: ${order.total.toLocaleString('es-CL')}</span>
                      <ul className="order-item-list">
                        {order.items.map((item) => (
                          <li key={item.productId}>
                            {item.name} x{item.quantity} - ${item.unitPrice.toLocaleString('es-CL')}
                          </li>
                        ))}
                      </ul>
                      {order.status !== 'entregado' ? (
                        <button type="button" onClick={() => onMarkDelivered(order.id)}>
                          Marcar como entregado
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}

              <button type="button" onClick={() => setEditing(true)}>
                Editar perfil
              </button>
              {message ? <p role="status">{message}</p> : null}
            </>
          ) : (
            <form className="section-form-inline" onSubmit={handleSave}>
              <label htmlFor="profile-name">Nombre</label>
              <input
                id="profile-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              />

              <label htmlFor="profile-email">Correo</label>
              <input
                id="profile-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
              />

              <label htmlFor="profile-password">Contraseña</label>
              <input
                id="profile-password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, password: event.target.value }))
                }
              />

              <label htmlFor="profile-image-url">Imagen (link)</label>
              <input
                id="profile-image-url"
                type="url"
                value={form.profileImage}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, profileImage: event.target.value }))
                }
              />

              <label htmlFor="profile-image-file">Imagen desde archivo</label>
              <input
                id="profile-image-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />

              {form.profileImage ? (
                <img className="profile-image" src={form.profileImage} alt="Vista previa" />
              ) : null}

              <button type="submit">Guardar cambios</button>
              <button type="button" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              {message ? <p role="status">{message}</p> : null}
            </form>
          )}
        </div>
      )}
    </section>
  )
}
