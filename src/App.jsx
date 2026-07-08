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
import './App.css'

function App() {
  const [bootstrap] = useState(() => initializeAppStorage())
  const [fontSize, setFontSize] = useState(14)
  const [currentSection, setCurrentSection] = useState('home')
  const [users, setUsers] = useState(bootstrap.users)
  const [products, setProducts] = useState(bootstrap.products)
  const [orders, setOrders] = useState(bootstrap.orders)
  const [stores] = useState(bootstrap.stores)
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
    if (sessionEmail && rememberMe) {
      storageApi.writeStorage(storageApi.keys.session, {
        email: sessionEmail,
        remember: rememberMe,
      })
      return
    }

    storageApi.removeStorage(storageApi.keys.session)
  }, [rememberMe, sessionEmail])

  const navigateToSection = (section) => {
    if ((section === 'seller' || section === 'admin') && !currentUser) {
      setCurrentSection('login')
      return
    }

    if (section === 'seller' && !['seller', 'admin'].includes(currentUser?.role)) {
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
    const foundUser = users.find((candidate) => candidate.email === email)

    if (!foundUser) {
      return { ok: false, message: 'El usuario no existe en el registro local.' }
    }

    if (foundUser.password !== password) {
      return { ok: false, message: 'La contrasena no coincide.' }
    }

    setSessionEmail(foundUser.email)
    setRememberMe(remember)
    setCurrentSection(foundUser.role === 'admin' ? 'admin' : foundUser.role === 'seller' ? 'seller' : 'profile')

    return { ok: true, user: foundUser }
  }

  const handleLogout = () => {
    setSessionEmail(null)
    setRememberMe(false)
    setCurrentSection('home')
  }

  const handleRegisterBuyer = ({ name, email, password }) => {
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
    }

    setUsers((previous) => [...previous, newUser])
    setCurrentSection('login')

    return { ok: true, message: 'Cuenta creada. Ahora puedes iniciar sesion.' }
  }

  const handleCreateSeller = ({ name, email, password }) => {
    if (currentUser?.role !== 'admin') {
      return { ok: false, message: 'Solo un administrador puede crear vendedores.' }
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
    }

    setUsers((previous) => [...previous, newSeller])

    return { ok: true, message: 'Vendedor creado correctamente.' }
  }

  const handleUpdateProfile = ({ name, email, password }) => {
    if (!currentUser) {
      return { ok: false, message: 'Debes iniciar sesion.' }
    }

    if (users.some((candidate) => candidate.email === email && candidate.id !== currentUser.id)) {
      return { ok: false, message: 'Ya existe otro usuario con ese correo.' }
    }

    setUsers((previous) =>
      previous.map((candidate) =>
        candidate.id === currentUser.id
          ? { ...candidate, name, email, password }
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

    if (!cartItems.length) {
      return { ok: false, message: 'El carrito esta vacio.' }
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
    if (!currentUser || !['seller', 'admin'].includes(currentUser.role)) {
      return { ok: false, message: 'No tienes permisos para publicar productos.' }
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
        return (
          <AdminPanelSection users={users} onCreateSeller={handleCreateSeller} />
        )
      case 'home':
      default:
        return (
          <HomeSection
            products={products}
            stores={stores}
            currentUser={currentUser}
            onNavigate={navigateToSection}
            onCheckout={handleCheckout}
          />
        )
    }
  })()

  return (
    <div className="app-shell" style={{ '--base-font-size': `${fontSize}px` }}>
      <Header
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
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
