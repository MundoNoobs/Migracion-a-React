import { useState } from 'react'
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
  validateRequiredFields,
} from '../../utils/validators'

const fields = [
  { id: 'register-name', label: 'Nombre completo', type: 'text', key: 'name' },
  { id: 'register-email', label: 'Correo', type: 'email', key: 'email' },
  { id: 'register-password', label: 'Contrasena', type: 'password', key: 'password' },
  {
    id: 'register-confirm-password',
    label: 'Confirmar contrasena',
    type: 'password',
    key: 'confirmPassword',
  },
]

const requirements = [
  'Usa un correo valido.',
  'La contrasena debe coincidir.',
  'La cuenta quedara lista para entrar al perfil.',
]

export default function RegisterSection({ onRegister }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const requiredValidation = validateRequiredFields(
      form,
      ['name', 'email', 'password', 'confirmPassword'],
    )
    if (!requiredValidation.ok) {
      setError(requiredValidation.message)
      return
    }

    const nameValidation = validateName(form.name)
    if (!nameValidation.ok) {
      setError(nameValidation.message)
      return
    }

    const emailValidation = validateEmail(form.email)
    if (!emailValidation.ok) {
      setError(emailValidation.message)
      return
    }

    const passwordValidation = validatePassword(form.password)
    if (!passwordValidation.ok) {
      setError(passwordValidation.message)
      return
    }

    const matchValidation = validatePasswordMatch(form.password, form.confirmPassword)
    if (!matchValidation.ok) {
      setError(matchValidation.message)
      return
    }

    const result = onRegister({
      name: form.name,
      email: form.email,
      password: form.password,
    })

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
  }

  return (
    <section className="section-block section-form" aria-labelledby="register-title">
      <h1 id="register-title" className="page-title">Registro</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <input
              id={field.id}
              type={field.type}
              required
              value={form[field.key]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [field.key]: event.target.value }))
              }
            />
          </div>
        ))}

        <button type="submit">Crear cuenta</button>
      </form>

      <div className="section-card" style={{ marginTop: '1rem' }}>
        <h2>Requisitos de registro</h2>
        <p>Solo compradores pueden crear su cuenta desde aqui. Los vendedores se crean en el panel de administrador.</p>
        <ul className="seller-list">
          {requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {error ? <p role="alert">{error}</p> : null}
      </div>
    </section>
  )
}
