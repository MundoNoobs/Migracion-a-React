import { useState } from 'react'

export default function LoginSection({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({
      name: 'Usuario Demo',
      email: form.email,
      role: form.email.includes('seller') ? 'seller' : 'buyer',
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
    </section>
  )
}
