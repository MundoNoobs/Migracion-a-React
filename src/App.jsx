import { useState } from 'react'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import StoreList from './components/StoreList'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [fontSize, setFontSize] = useState(14)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Datos de ejemplo de productos
  const products = [
    {
      id: '69dece3d2945a6c44d8084d4',
      name: 'Lavadora Samsung - EDIT',
      price: 150000,
      image: 'https://via.placeholder.com/300x300?text=Lavadora+Samsung',
    },
    {
      id: '1',
      name: 'Refrigerador LG',
      price: 450000,
      image: 'https://via.placeholder.com/300x300?text=Refrigerador+LG',
    },
    {
      id: '2',
      name: 'Horno Electrolux',
      price: 250000,
      image: 'https://via.placeholder.com/300x300?text=Horno+Electrolux',
    },
  ]

  // Datos de ejemplo de tiendas
  const stores = [
    {
      id: 1,
      name: 'Lavadoras y más',
      image: 'https://via.placeholder.com/300x200?text=Lavadoras+y+mas',
    },
    {
      id: 2,
      name: 'Electrodomésticos Central',
      image: 'https://via.placeholder.com/300x200?text=Electrodomesticos',
    },
    {
      id: 3,
      name: 'Centro Técnico',
      image: 'https://via.placeholder.com/300x200?text=Centro+Tecnico',
    },
  ]

  const handleFontSizeChange = (size) => {
    setFontSize(size)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div style={{ '--base-font-size': `${fontSize}px` }}>
      <Header 
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        onLogin={handleLogin}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <main id="maincontent">
        <h1 className="page-title">Bienvenido a Zofri</h1>
        
        <ProductGrid products={products} />
        
        <StoreList stores={stores} />
      </main>

      <Footer />
    </div>
  )
}

export default App
