import { useMemo, useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomeSection from './components/sections/HomeSection'
import LoginSection from './components/sections/LoginSection'
import RegisterSection from './components/sections/RegisterSection'
import UserProfileSection from './components/sections/UserProfileSection'
import SellerPanelSection from './components/sections/SellerPanelSection'
import { products, sellerProducts, stores } from './data/mockData'
import './App.css'

function App() {
  const [fontSize, setFontSize] = useState(14)
  const [currentSection, setCurrentSection] = useState('home')
  const [user, setUser] = useState(null)

  const sectionContent = useMemo(() => {
    switch (currentSection) {
      case 'login':
        return (
          <LoginSection
            onLogin={(loggedUser) => {
              setUser(loggedUser)
              setCurrentSection('profile')
            }}
            onNavigateToRegister={() => setCurrentSection('register')}
          />
        )
      case 'register':
        return (
          <RegisterSection
            onRegister={() => {
              setCurrentSection('login')
            }}
          />
        )
      case 'profile':
        return (
          <UserProfileSection
            user={user}
            onNavigateToLogin={() => setCurrentSection('login')}
          />
        )
      case 'seller':
        return <SellerPanelSection user={user} sellerProducts={sellerProducts} />
      case 'home':
      default:
        return <HomeSection products={products} stores={stores} onNavigate={setCurrentSection} />
    }
  }, [currentSection, user])

  return (
    <div className="app-shell" style={{ '--base-font-size': `${fontSize}px` }}>
      <Header
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        isLoggedIn={Boolean(user)}
        onLogout={() => {
          setUser(null)
          setCurrentSection('home')
        }}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <main id="maincontent" className="main-content">
        {sectionContent}
      </main>

      <Footer />
    </div>
  )
}

export default App
