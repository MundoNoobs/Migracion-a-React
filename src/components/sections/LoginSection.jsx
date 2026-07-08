import { useState } from 'react'
import { validateEmail, validateRequiredFields } from '../../utils/validators'

export default function LoginSection({ onLogin, onNavigateToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    const requiredValidation = validateRequiredFields(form, ['email', 'password'])
    if (!requiredValidation.ok) {
      setError(requiredValidation.message)
      return
    }

    const emailValidation = validateEmail(form.email)
    if (!emailValidation.ok) {
      setError(emailValidation.message)
      return
    }

    const result = onLogin({
      email: form.email,
      password: form.password,
      remember,
    })

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
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
        <h2>Acceso local</h2>
        <p>Solo pueden ingresar usuarios existentes en el almacenamiento local.</p>
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
