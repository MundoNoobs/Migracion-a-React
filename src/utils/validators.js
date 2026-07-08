const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/

export const validateRequiredFields = (values, fields) => {
  for (const field of fields) {
    const value = values[field]

    if (typeof value === 'string' && !value.trim()) {
      return { ok: false, message: `El campo ${field} es obligatorio.` }
    }

    if (value === null || value === undefined) {
      return { ok: false, message: `El campo ${field} es obligatorio.` }
    }
  }

  return { ok: true }
}

export const validateName = (name) => {
  if (!name || name.trim().length < 3) {
    return { ok: false, message: 'El nombre debe tener al menos 3 caracteres.' }
  }

  return { ok: true }
}

export const validateEmail = (email) => {
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: 'El correo no tiene un formato valido.' }
  }

  return { ok: true }
}

export const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    return {
      ok: false,
      message: 'La contrasena debe tener al menos 6 caracteres, una letra y un numero.',
    }
  }

  return { ok: true }
}

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { ok: false, message: 'Las contrasenas no coinciden.' }
  }

  return { ok: true }
}

export const validateProductPayload = (product) => {
  const required = validateRequiredFields(product, ['name', 'price', 'stock', 'image'])
  if (!required.ok) {
    return required
  }

  if (Number(product.price) <= 0) {
    return { ok: false, message: 'El valor del producto debe ser mayor a 0.' }
  }

  if (!Number.isInteger(Number(product.stock)) || Number(product.stock) < 0) {
    return { ok: false, message: 'El stock debe ser un numero entero mayor o igual a 0.' }
  }

  return { ok: true }
}

export const validateOrderStatus = (status) => {
  const allowedStatus = ['en espera', 'empaquetando', 'enviado', 'entregado']

  if (!allowedStatus.includes(status)) {
    return { ok: false, message: 'Estado de pedido no permitido.' }
  }

  return { ok: true }
}

export const validateCartItems = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { ok: false, message: 'El carrito esta vacio.' }
  }

  const invalidItem = cartItems.find(
    (item) => !item?.product?.id || !Number.isInteger(item.quantity) || item.quantity <= 0,
  )

  if (invalidItem) {
    return { ok: false, message: 'Hay productos invalidos en el carrito.' }
  }

  return { ok: true }
}
