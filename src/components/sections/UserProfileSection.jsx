export default function UserProfileSection({ user, onNavigateToLogin }) {
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
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      )}
    </section>
  )
}
