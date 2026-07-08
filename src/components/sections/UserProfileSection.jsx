import { useMemo, useState } from 'react'

const profileBlocks = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'role', label: 'Rol' },
]

const activityList = [
  'Ultimo acceso: hoy',
  'Pedidos pendientes: 2',
  'Favoritos guardados: 5',
]

export default function UserProfileSection({ user, onNavigateToLogin }) {
  const [editing, setEditing] = useState(false)
  const profileData = useMemo(() => {
    if (!user) {
      return null
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }, [user])

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
          {profileBlocks.map((item) => (
            <p key={item.key}>
              <strong>{item.label}:</strong> {profileData[item.key]}
            </p>
          ))}

          <h2>Actividad reciente</h2>
          <ul className="seller-list">
            {activityList.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>

          <button type="button" onClick={() => setEditing((current) => !current)}>
            {editing ? 'Cerrar edicion' : 'Editar perfil'}
          </button>

          {editing ? <p>Modo edicion activo. Aqui se conectaria un formulario real.</p> : null}
        </div>
      )}
    </section>
  )
}
