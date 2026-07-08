import '../../styles/Header.css'

export default function Header({
  fontSize,
  theme,
  isLoggedIn,
  currentUser,
  onFontSizeChange,
  onToggleTheme,
  onLogout,
  currentSection,
  onSectionChange,
}) {
  const navigationSections = [{ key: 'home', label: 'Inicio' }]

  if (!isLoggedIn) {
    navigationSections.push({ key: 'login', label: 'Login' })
    navigationSections.push({ key: 'register', label: 'Registro' })
  }

  if (isLoggedIn) {
    navigationSections.push({ key: 'profile', label: 'Perfil de usuario' })
  }

  if (currentUser?.role === 'seller') {
    navigationSections.push({ key: 'seller', label: 'Panel vendedor' })
  }

  if (currentUser?.role === 'admin') {
    navigationSections.push({ key: 'admin', label: 'Panel administrador' })
  }

  return (
    <>
      <a href="#maincontent" className="skip-link">Saltar al contenido</a>

      <header className="topbar" style={{ '--base-font-size': `${fontSize}px` }}>
        <div className="left">
          <button type="button" className="brand-link" onClick={() => onSectionChange('home')}>
            Zofri
          </button>
        </div>

        <nav className="main-nav" aria-label="Secciones principales">
          {navigationSections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={`nav-button${currentSection === section.key ? ' is-active' : ''}`}
              onClick={() => onSectionChange(section.key)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="right">
          <button
            id="userMenu"
            type="button"
            className="user-button"
            onClick={() => (isLoggedIn ? onLogout() : onSectionChange('login'))}
          >
            {isLoggedIn ? 'Cerrar sesion' : 'Iniciar sesion'}
          </button>

          <div className="font-controls" role="group" aria-label="Controles de tamano de fuente">
            <button
              type="button"
              aria-label="Disminuir tamano de letra"
              aria-pressed={fontSize === 12}
              onClick={() => onFontSizeChange(12)}
            >
              A-
            </button>
            <button
              type="button"
              aria-label="Tamano normal"
              aria-pressed={fontSize === 14}
              onClick={() => onFontSizeChange(14)}
            >
              A
            </button>
            <button
              type="button"
              aria-label="Aumentar tamano de letra"
              aria-pressed={fontSize === 16}
              onClick={() => onFontSizeChange(16)}
            >
              A+
            </button>
            <button
              type="button"
              aria-label="Activar modo oscuro"
              aria-pressed={theme === 'dark'}
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
