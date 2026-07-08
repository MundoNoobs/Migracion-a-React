const STORAGE_KEYS = {
  users: 'zofri-users',
  products: 'zofri-products',
  orders: 'zofri-orders',
  session: 'zofri-session',
  sessionTemp: 'zofri-session-temp',
  theme: 'zofri-theme',
}

const seedUsers = [
  {
    id: 'admin-1',
    name: 'Administrador Zofri',
    email: 'admin@zofri.cl',
    password: 'Admin123*',
    role: 'admin',
    profileImage: 'https://via.placeholder.com/300x200?text=Administrador',
  },
]

const seedProducts = []

const LEGACY_PRODUCT_NAMES = [
  'Lavadora Samsung - EDIT',
  'Refrigerador LG',
  'Horno Electrolux',
]

const LEGACY_STORE_NAMES = [
  'Lavadoras y más',
  'Lavadoras y mas',
  'Electrodosmeticos central',
  'Electrodomésticos Central',
  'Electrodomesticos Central',
  'Centro tecnico',
  'Centro Tecnico',
]

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value)
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
  const users = Array.isArray(existingUsers) ? existingUsers : seedUsers

  const existingProducts = readStorage(STORAGE_KEYS.products, null)
  const rawProducts = Array.isArray(existingProducts) ? existingProducts : seedProducts
  const products = rawProducts.filter((product) => !LEGACY_PRODUCT_NAMES.includes(product.name))
  const existingOrders = readStorage(STORAGE_KEYS.orders, [])
  const orders = Array.isArray(existingOrders) ? existingOrders : []

  const persistentSession = readStorage(STORAGE_KEYS.session, null)
  const temporarySession =
    typeof window !== 'undefined'
      ? safeParse(window.sessionStorage.getItem(STORAGE_KEYS.sessionTemp), null)
      : null
  const session = persistentSession || temporarySession

  if (!existingUsers) {
    writeStorage(STORAGE_KEYS.users, users)
  }

  writeStorage(STORAGE_KEYS.products, products)

  if (!readStorage(STORAGE_KEYS.orders, null)) {
    writeStorage(STORAGE_KEYS.orders, orders)
  }

  return {
    users,
    products,
    orders,
    session,
    stores: [],
    legacyStoreNames: LEGACY_STORE_NAMES,
  }
}

export const storageApi = {
  keys: STORAGE_KEYS,
  readStorage,
  writeStorage,
  removeStorage,
  writeSession: (session, remember) => {
    if (typeof window === 'undefined') {
      return
    }

    if (remember) {
      writeStorage(STORAGE_KEYS.session, session)
      window.sessionStorage.removeItem(STORAGE_KEYS.sessionTemp)
      return
    }

    removeStorage(STORAGE_KEYS.session)
    window.sessionStorage.setItem(STORAGE_KEYS.sessionTemp, JSON.stringify(session))
  },
  clearSession: () => {
    if (typeof window === 'undefined') {
      return
    }

    removeStorage(STORAGE_KEYS.session)
    window.sessionStorage.removeItem(STORAGE_KEYS.sessionTemp)
  },
}
