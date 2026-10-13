import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/mercado', label: 'Mercado', icon: 'search' },
  { to: '/publicar', label: 'Publicar', icon: 'plus' },
  { to: '/impacto', label: 'Impacto', icon: 'leaf' },
]

function NavIcon({ icon, active }) {
  const color = active ? '#2D6A4F' : '#9CA3AF'
  const icons = {
    home: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    search: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill={active ? '#2D6A4F' : 'none'} stroke={active ? '#2D6A4F' : color}/><line x1="12" y1="8" x2="12" y2="16" stroke={active ? 'white' : color}/><line x1="8" y1="12" x2="16" y2="12" stroke={active ? 'white' : color}/></svg>,
    leaf: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82L7 21l1-1 1 1 1-1 1 1 .5-.5M17 8c3-1.56 5-4 5-8-4 0-6.44 2-8 5m3 3c-2.44 2.44-5.56 4.06-8 4"/></svg>,
  }
  return icons[icon] || null
}

export default function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 lg:px-12 py-3 bg-white border-b border-neutral-100 sticky top-0 z-40">
        <NavLink to="/" className="flex items-center gap-2">
          <Logo size={32} />
        </NavLink>
        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:text-brand-500 hover:bg-neutral-50'
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
              className="flex flex-col items-center gap-0.5 py-1 min-w-[44px] min-h-[44px] justify-center"
            >
              <NavIcon icon={item.icon} active={isActive} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-brand-500' : 'text-neutral-400'}`}>
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

