import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-verde-bosque/40 transition-opacity" style={{ animation: 'fadeIn 0.2s ease' }} />
      <div
        className="relative bg-white rounded-t-tarjeta md:rounded-tarjeta w-full md:max-w-lg max-h-[85vh] overflow-y-auto shadow-modal page-enter border-t md:border border-menta"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-crema px-6 py-4 border-b border-menta flex items-center justify-between z-10">
          <h3 className="text-xl font-fredoka font-semibold text-verde-bosque">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-menta text-gris-calido hover:text-verde-bosque transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-6 text-verde-bosque">{children}</div>
      </div>
    </div>
  )
}
