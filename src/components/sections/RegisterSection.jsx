import { useState } from 'react'

export default function RegisterSection({ onRegister }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      return
    }

    onRegister({
      name: form.name,
      email: form.email,
    })
  }

  return (
    <section className="section-block section-form" aria-labelledby="register-title">
      <h1 id="register-title" className="page-title">Registro</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-name">Nombre completo</label>
        <input
          id="register-name"
          type="text"
          required
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />

        <label htmlFor="register-email">Correo</label>
        <input
          id="register-email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />

        <label htmlFor="register-password">Contrasena</label>
        <input
          id="register-password"
          type="password"
          required
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />

        <label htmlFor="register-confirm-password">Confirmar contrasena</label>
        <input
          id="register-confirm-password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
          }
        />

        <button type="submit">Crear cuenta</button>
      </form>
    </section>
  )
}
