import { useState } from 'react'

const sampleAccounts = [
  { label: 'Cuenta comprador', email: 'compra@demo.cl' },
  { label: 'Cuenta vendedor', email: 'seller@demo.cl' },
]

export default function LoginSection({ onLogin, onNavigateToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setError('Completa correo y contrasena para continuar.')
      return
    }

    setError('')
    onLogin({
      name: 'Usuario Demo',
      email: form.email,
      role: form.email.includes('seller') ? 'seller' : 'buyer',
      remember,
    })
  }

  return (
    <section className="section-block section-form" aria-labelledby="login-title">
      <h1 id="login-title" className="page-title">Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Correo</label>
        <input
          id="login-email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />

        <label htmlFor="login-password">Contrasena</label>
        <input
          id="login-password"
          type="password"
          required
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />

        <button type="submit">Ingresar</button>
      </form>

      <div className="section-card" style={{ marginTop: '1rem' }}>
        <h2>Cuentas de ejemplo</h2>
        <ul className="seller-list">
          {sampleAccounts.map((account) => (
            <li key={account.email}>
              <span>{account.label}</span>
              <span>{account.email}</span>
            </li>
          ))}
        </ul>
        {error ? <p role="alert">{error}</p> : null}
        <label className="login-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          Recordarme
        </label>
        <button type="button" onClick={onNavigateToRegister}>Ir a registro</button>
      </div>
    </section>
  )
}
