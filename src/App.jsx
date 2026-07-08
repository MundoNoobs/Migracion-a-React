import { useEffect, useMemo, useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomeSection from './components/sections/HomeSection'
import LoginSection from './components/sections/LoginSection'
import RegisterSection from './components/sections/RegisterSection'
import UserProfileSection from './components/sections/UserProfileSection'
import SellerPanelSection from './components/sections/SellerPanelSection'
import AdminPanelSection from './components/sections/AdminPanelSection'
import { initializeAppStorage, storageApi } from './data/storage'
import {
  validateCartItems,
  validateEmail,
  validateName,
  validateOrderStatus,
  validatePassword,
  validateProductPayload,
  validateRequiredFields,
} from './utils/validators'
import './App.css'

function App() {
  const [bootstrap] = useState(() => initializeAppStorage())
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState(() => storageApi.readStorage(storageApi.keys.theme, 'light'))
  const [currentSection, setCurrentSection] = useState('home')
  const [users, setUsers] = useState(bootstrap.users)
  const [products, setProducts] = useState(bootstrap.products)
  const [orders, setOrders] = useState(bootstrap.orders)
  const [sessionEmail, setSessionEmail] = useState(bootstrap.session?.email ?? null)
  const [rememberMe, setRememberMe] = useState(Boolean(bootstrap.session?.remember))

  const currentUser = useMemo(
    () => users.find((candidate) => candidate.email === sessionEmail) ?? null,
    [sessionEmail, users],
  )

  useEffect(() => {
    storageApi.writeStorage(storageApi.keys.users, users)
    storageApi.writeStorage(storageApi.keys.products, products)
    storageApi.writeStorage(storageApi.keys.orders, orders)
  }, [orders, products, users])

  useEffect(() => {
    if (sessionEmail) {
      storageApi.writeSession(
        {
          email: sessionEmail,
          remember: rememberMe,
        },
        rememberMe,
      )
      return
    }

    storageApi.clearSession()
  }, [rememberMe, sessionEmail])

  useEffect(() => {
    storageApi.writeStorage(storageApi.keys.theme, theme)
  }, [theme])

  const navigateToSection = (section) => {
    if (currentUser && (section === 'login' || section === 'register')) {
      setCurrentSection('profile')
      return
    }

    if ((section === 'seller' || section === 'admin') && !currentUser) {
      setCurrentSection('login')
      return
    }

    if (section === 'seller' && currentUser?.role !== 'seller') {
      setCurrentSection('profile')
      return
    }

    if (section === 'admin' && currentUser?.role !== 'admin') {
      setCurrentSection('home')
      return
    }

    setCurrentSection(section)
  }

  const handleLogin = ({ email, password, remember }) => {
    const requiredValidation = validateRequiredFields({ email, password }, ['email', 'password'])
    if (!requiredValidation.ok) {
      return requiredValidation
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.ok) {
      return emailValidation
    }

    const foundUser = users.find((candidate) => candidate.email === email)

    if (!foundUser) {
      return { ok: false, message: 'El usuario no existe en el registro local.' }
    }

    if (foundUser.password !== password) {
      return { ok: false, message: 'La contrasena no coincide.' }
    }

    setSessionEmail(foundUser.email)
    setRememberMe(remember)
    setCurrentSection('home')

    return { ok: true, user: foundUser }
  }

  const handleLogout = () => {
    setSessionEmail(null)
    setRememberMe(false)
    storageApi.clearSession()
    setCurrentSection('home')
  }

  const handleRegisterBuyer = ({ name, email, password }) => {
    const requiredValidation = validateRequiredFields(
      { name, email, password },
      ['name', 'email', 'password'],
    )
    if (!requiredValidation.ok) {
      return requiredValidation
    }

    const nameValidation = validateName(name)
    if (!nameValidation.ok) {
      return nameValidation
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.ok) {
      return emailValidation
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.ok) {
      return passwordValidation
    }

    const emailExists = users.some((candidate) => candidate.email === email)

    if (emailExists) {
      return { ok: false, message: 'Ya existe una cuenta con ese correo.' }
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'buyer',
      profileImage: '',
    }

    setUsers((previous) => [...previous, newUser])
    setCurrentSection('login')

    return { ok: true, message: 'Cuenta creada. Ahora puedes iniciar sesion.' }
  }

  const handleCreateSeller = ({ name, email, password, profileImage }) => {
    if (currentUser?.role !== 'admin') {
      return { ok: false, message: 'Solo un administrador puede crear vendedores.' }
    }

    const requiredValidation = validateRequiredFields(
      { name, email, password },
      ['name', 'email', 'password'],
    )
    if (!requiredValidation.ok) {
      return requiredValidation
    }

    const nameValidation = validateName(name)
    if (!nameValidation.ok) {
      return nameValidation
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.ok) {
      return emailValidation
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.ok) {
      return passwordValidation
    }

    if (users.some((candidate) => candidate.email === email)) {
      return { ok: false, message: 'Ese correo ya esta registrado.' }
    }

    const newSeller = {
      id: `seller-${Date.now()}`,
      name,
      email,
      password,
      role: 'seller',
      profileImage:
        profileImage || `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`,
    }

    setUsers((previous) => [...previous, newSeller])

    return { ok: true, message: 'Vendedor creado correctamente.' }
  }

  const handleUpdateProfile = ({ name, email, password, profileImage }) => {
    if (!currentUser) {
      return { ok: false, message: 'Debes iniciar sesion.' }
    }

    const requiredValidation = validateRequiredFields(
      { name, email, password },
      ['name', 'email', 'password'],
    )
    if (!requiredValidation.ok) {
      return requiredValidation
    }

    const nameValidation = validateName(name)
    if (!nameValidation.ok) {
      return nameValidation
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.ok) {
      return emailValidation
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.ok) {
      return passwordValidation
    }

    if (users.some((candidate) => candidate.email === email && candidate.id !== currentUser.id)) {
      return { ok: false, message: 'Ya existe otro usuario con ese correo.' }
    }

    setUsers((previous) =>
      previous.map((candidate) =>
        candidate.id === currentUser.id
          ? {
              ...candidate,
              name,
              email,
              password,
              profileImage: profileImage ?? candidate.profileImage ?? '',
            }
          : candidate,
      ),
    )

    setSessionEmail(email)
    return { ok: true, message: 'Perfil actualizado.' }
  }

  const handleCheckout = (cartItems) => {
    if (!currentUser) {
      return { ok: false, message: 'Debes iniciar sesion para comprar.' }
    }

    const cartValidation = validateCartItems(cartItems)
    if (!cartValidation.ok) {
      return cartValidation
    }

    const stockIssue = cartItems.find((cartItem) => {
      const currentProduct = products.find((product) => product.id === cartItem.product.id)
      return !currentProduct || currentProduct.stock < cartItem.quantity
    })

    if (stockIssue) {
      return { ok: false, message: 'No hay stock suficiente para completar la compra.' }
    }

    const groupedOrders = cartItems.reduce((accumulator, cartItem) => {
      const sellerEmail = cartItem.product.ownerEmail
      const totalPrice = cartItem.quantity * cartItem.product.price

      if (!accumulator[sellerEmail]) {
        accumulator[sellerEmail] = []
      }

      accumulator[sellerEmail].push({
        productId: cartItem.product.id,
        name: cartItem.product.name,
        quantity: cartItem.quantity,
        unitPrice: cartItem.product.price,
        lineTotal: totalPrice,
      })

      return accumulator
    }, {})

    setProducts((previous) =>
      previous.map((product) => {
        const cartItem = cartItems.find((item) => item.product.id === product.id)

        if (!cartItem) {
          return product
        }

        return {
          ...product,
          stock: product.stock - cartItem.quantity,
        }
      }),
    )

    const now = new Date().toISOString()
    const newOrders = Object.entries(groupedOrders).map(([sellerEmail, items]) => ({
      id: `order-${Date.now()}-${sellerEmail}`,
      customerEmail: currentUser.email,
      customerName: currentUser.name,
      sellerEmail,
      items,
      total: items.reduce((sum, item) => sum + item.lineTotal, 0),
      status: 'en espera',
      createdAt: now,
      updatedAt: now,
    }))

    setOrders((previous) => [...newOrders, ...previous])
    return { ok: true, message: 'Compra realizada y guardada al instante.' }
  }

  const handleUpdateOrderStatus = (orderId, status) => {
    const statusValidation = validateOrderStatus(status)
    if (!statusValidation.ok) {
      return statusValidation
    }

    setOrders((previous) =>
      previous.map((order) => {
        const canEditOrder =
          currentUser?.role === 'admin' ||
          (currentUser?.role === 'seller' && order.sellerEmail === currentUser.email)

        if (order.id !== orderId || !canEditOrder) {
          return order
        }

        return {
          ...order,
          status,
          updatedAt: new Date().toISOString(),
        }
      }),
    )

    return { ok: true }
  }

  const handleMarkDelivered = (orderId) => {
    const statusValidation = validateOrderStatus('entregado')
    if (!statusValidation.ok) {
      return statusValidation
    }

    setOrders((previous) =>
      previous.map((order) => {
        if (order.id !== orderId || order.customerEmail !== currentUser?.email) {
          return order
        }

        return {
          ...order,
          status: 'entregado',
          updatedAt: new Date().toISOString(),
        }
      }),
    )

    return { ok: true }
  }

  const handleCreateProduct = ({ product, productId }) => {
    if (!currentUser || currentUser.role !== 'seller') {
      return { ok: false, message: 'No tienes permisos para publicar productos.' }
    }

    const productValidation = validateProductPayload(product)
    if (!productValidation.ok) {
      return productValidation
    }

    if (productId) {
      setProducts((previous) =>
        previous.map((candidate) =>
          candidate.id === productId && candidate.ownerEmail === currentUser.email
            ? { ...candidate, ...product }
            : candidate,
        ),
      )

      return { ok: true, message: 'Producto actualizado.' }
    }

    setProducts((previous) => [
      ...previous,
      {
        id: `product-${Date.now()}`,
        ownerEmail: currentUser.email,
        ...product,
      },
    ])

    return { ok: true, message: 'Producto publicado.' }
  }

  const handleDeleteProduct = (productId) => {
    setProducts((previous) =>
      previous.filter(
        (product) => product.id !== productId || product.ownerEmail !== currentUser?.email,
      ),
    )

    return { ok: true, message: 'Producto eliminado.' }
  }

  const currentUserOrders = useMemo(
    () => orders.filter((order) => order.customerEmail === currentUser?.email),
    [currentUser?.email, orders],
  )

  const sellerUserMap = useMemo(
    () =>
      users
        .filter((user) => user.role === 'seller')
        .reduce((accumulator, seller) => {
          accumulator[seller.email] = seller
          return accumulator
        }, {}),
    [users],
  )

  const homeProducts = useMemo(
    () =>
      products
        .filter((product) => Boolean(sellerUserMap[product.ownerEmail]))
        .map((product) => ({
          ...product,
          sellerName: sellerUserMap[product.ownerEmail]?.name ?? 'Vendedor',
        })),
    [products, sellerUserMap],
  )

  const sellerStores = useMemo(
    () =>
      users
        .filter((user) => user.role === 'seller')
        .map((seller) => ({
          id: seller.id,
          name: seller.name,
          image:
            seller.profileImage ||
            `https://via.placeholder.com/300x200?text=${encodeURIComponent(seller.name)}`,
          email: seller.email,
        }))
        .filter((seller) => !bootstrap.legacyStoreNames?.includes(seller.name)),
    [bootstrap.legacyStoreNames, users],
  )

  const sellerOrders = useMemo(
    () => orders.filter((order) => order.sellerEmail === currentUser?.email),
    [currentUser?.email, orders],
  )

  const sellerProducts = useMemo(
    () => products.filter((product) => product.ownerEmail === currentUser?.email),
    [currentUser?.email, products],
  )

  const sectionContent = (() => {
    switch (currentSection) {
      case 'login':
        return (
          <LoginSection
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentSection('register')}
          />
        )
      case 'register':
        return <RegisterSection onRegister={handleRegisterBuyer} />
      case 'profile':
        return (
          <UserProfileSection
            user={currentUser}
            orders={currentUserOrders}
            onNavigateToLogin={() => setCurrentSection('login')}
            onSaveProfile={handleUpdateProfile}
            onMarkDelivered={handleMarkDelivered}
          />
        )
      case 'seller':
        return (
          <SellerPanelSection
            user={currentUser}
            sellerProducts={sellerProducts}
            sellerOrders={sellerOrders}
            onCreateProduct={handleCreateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )
      case 'admin':
        return <AdminPanelSection users={users} onCreateSeller={handleCreateSeller} />
      case 'home':
      default:
        return (
          <HomeSection
            products={homeProducts}
            stores={sellerStores}
            currentUser={currentUser}
            onNavigate={navigateToSection}
            onCheckout={handleCheckout}
          />
        )
    }
  })()

  return (
    <div
      className={`app-shell${theme === 'dark' ? ' dark' : ''}`}
      style={{ '--base-font-size': `${fontSize}px` }}
    >
      <Header
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        theme={theme}
        onToggleTheme={() => setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))}
        isLoggedIn={Boolean(currentUser)}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentSection={currentSection}
        onSectionChange={navigateToSection}
      />

      <main id="maincontent" className="main-content">
        {sectionContent}
      </main>

      <Footer />
    </div>
  )
}

export default App
