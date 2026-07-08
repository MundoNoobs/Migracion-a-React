const STORAGE_KEYS = {
  users: 'zofri-users',
  products: 'zofri-products',
  orders: 'zofri-orders',
  session: 'zofri-session',
}

const seedUsers = [
  {
    id: 'admin-1',
    name: 'Administrador Zofri',
    email: 'admin@zofri.cl',
    password: 'Admin123*',
    role: 'admin',
  },
]

const seedProducts = [
  {
    id: 'product-1',
    ownerEmail: 'admin@zofri.cl',
    name: 'Lavadora Samsung - EDIT',
    price: 150000,
    stock: 10,
    image: 'https://via.placeholder.com/300x300?text=Lavadora+Samsung',
  },
  {
    id: 'product-2',
    ownerEmail: 'admin@zofri.cl',
    name: 'Refrigerador LG',
    price: 450000,
    stock: 6,
    image: 'https://via.placeholder.com/300x300?text=Refrigerador+LG',
  },
  {
    id: 'product-3',
    ownerEmail: 'admin@zofri.cl',
    name: 'Horno Electrolux',
    price: 250000,
    stock: 8,
    image: 'https://via.placeholder.com/300x300?text=Horno+Electrolux',
  },
]

const seedStores = [
  {
    id: 1,
    name: 'Lavadoras y mas',
    image: 'https://via.placeholder.com/300x200?text=Lavadoras+y+mas',
  },
  {
    id: 2,
    name: 'Electrodomesticos Central',
    image: 'https://via.placeholder.com/300x200?text=Electrodomesticos',
  },
  {
    id: 3,
    name: 'Centro Tecnico',
    image: 'https://via.placeholder.com/300x200?text=Centro+Tecnico',
  },
]

const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  const raw = window.localStorage.getItem(key)
  return raw ? safeParse(raw, fallback) : fallback
}

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

const removeStorage = (key) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(key)
}

export const initializeAppStorage = () => {
  const existingUsers = readStorage(STORAGE_KEYS.users, null)
  const users = existingUsers ?? seedUsers
  const products = readStorage(STORAGE_KEYS.products, null) ?? seedProducts
  const orders = readStorage(STORAGE_KEYS.orders, [])
  const session = readStorage(STORAGE_KEYS.session, null)

  if (!existingUsers) {
    writeStorage(STORAGE_KEYS.users, users)
  }

  if (!readStorage(STORAGE_KEYS.products, null)) {
    writeStorage(STORAGE_KEYS.products, products)
  }

  if (!readStorage(STORAGE_KEYS.orders, null)) {
    writeStorage(STORAGE_KEYS.orders, orders)
  }

  return {
    users,
    products,
    orders,
    session,
    stores: seedStores,
  }
}

export const storageApi = {
  keys: STORAGE_KEYS,
  readStorage,
  writeStorage,
  removeStorage,
}
