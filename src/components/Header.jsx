import { useState } from 'react';
import '../styles/Header.css';

export default function Header({ fontSize, onFontSizeChange, onLogin, isLoggedIn, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Aquí se puede implementar búsqueda
    console.log('Searching for:', searchQuery);
  };

  const handleFontChange = (size) => {
    onFontSizeChange(size);
  };

  return (
    <>
      <a href="#maincontent" className="skip-link">Saltar al contenido</a>
      
      <header className="topbar" style={{ '--base-font-size': `${fontSize}px` }}>
        <div className="left">
          <a href="/">Zofri</a>
        </div>
        
        <div className="center">
          <form onSubmit={handleSearch}>
            <input
              id="search"
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="right">
          <button
            id="userMenu"
            className="user-button"
            onClick={() => setShowAuthModal(!showAuthModal)}
          >
            {isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
          </button>
          
          <div 
            className="font-controls" 
            role="group" 
            aria-label="Controles de tamaño de fuente"
          >
            <button
              id="decreaseFont"
              aria-label="Disminuir tamaño de letra"
              data-size="small"
              aria-pressed={fontSize === 12}
              onClick={() => handleFontChange(12)}
            >
              A-
            </button>
            <button
              id="resetFont"
              aria-label="Tamaño normal"
              data-size="medium"
              aria-pressed={fontSize === 14}
              onClick={() => handleFontChange(14)}
            >
              A
            </button>
            <button
              id="increaseFont"
              aria-label="Aumentar tamaño de letra"
              data-size="large"
              aria-pressed={fontSize === 16}
              onClick={() => handleFontChange(16)}
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            {!isLoggedIn ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                onLogin();
                setShowAuthModal(false);
              }}>
                <h2>Iniciar sesión</h2>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Contraseña" required />
                <button type="submit">Iniciar sesión</button>
              </form>
            ) : (
              <div>
                <h2>Sesión activa</h2>
                <button onClick={() => {
                  onLogout();
                  setShowAuthModal(false);
                }}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
