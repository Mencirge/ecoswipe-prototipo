import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/mercado', label: 'Mercado', icon: 'search' },
  { to: '/publicar', label: 'Publicar', icon: 'plus' },
  { to: '/impacto', label: 'Impacto', icon: 'leaf' },
]

function NavIcon({ icon, active }) {
  const color = active ? '#1E8449' : '#6B6F6A'
  const icons = {
    home: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15C14.4477 21 14 20.5523 14 20V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V20C10 20.5523 9.55228 21 9 21H4C3.44772 21 3 20.5523 3 20V10.5Z" />
      </svg>
    ),
    search: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21L16 16" />
      </svg>
    ),
    plus: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" fill={active ? '#1E8449' : 'none'} stroke={active ? '#1E8449' : color} />
        <path d="M12 8V16" stroke={active ? '#FFFFFF' : color} />
        <path d="M8 12H16" stroke={active ? '#FFFFFF' : color} />
      </svg>
    ),
    leaf: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2C19.5 4.5 19 7 17.9 12.2A7 7 0 0 1 11 20Z" />
        <path d="M11 20C11 16 13 13 18 10" />
      </svg>
    ),
  }
  return icons[icon] || null
}

export default function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-crema text-verde-bosque pb-20 md:pb-0">
      {/* Mobile top bar: barra de 56px con logo a la izquierda */}
      <header className="flex md:hidden items-center h-14 px-4 bg-crema border-b border-menta sticky top-0 z-40">
        <NavLink to="/" className="flex items-center min-w-[96px] h-full py-1.5 hover:opacity-95 transition-opacity" aria-label="EcoSwipe - Ir a inicio">
          <Logo size={42} variant="mobile" />
        </NavLink>
      </header>

      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 lg:px-12 py-3.5 bg-crema border-b border-menta sticky top-0 z-40">
        <NavLink to="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <Logo size={34} />
        </NavLink>
        <nav className="flex items-center gap-1.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-boton font-sans text-sm font-semibold transition-all duration-200 min-h-[44px] flex items-center ${
                  isActive
                    ? 'bg-menta text-verde-bosque shadow-xs'
                    : 'text-gris-calido hover:text-verde-hoja hover:bg-menta/40'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="w-[100px]" />
      </header>

      {/* Main content */}
      <main className="page-enter">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav md:hidden">
        {navItems.map(item => {
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center gap-0.5 py-1 min-h-[44px] justify-center transition-colors text-center"
            >
              <NavIcon icon={item.icon} active={isActive} />
              <span className={`text-[12px] font-semibold leading-tight ${isActive ? 'text-verde-bosque' : 'text-gris-calido'}`}>
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
