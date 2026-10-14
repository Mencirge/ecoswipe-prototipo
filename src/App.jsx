import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Mercado from './pages/Mercado'
import DetalleLote from './pages/DetalleLote'
import PerfilVendedor from './pages/PerfilVendedor'
import PublicarLote from './pages/PublicarLote'
import Impacto from './pages/Impacto'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <div className="sample-badge">Datos de ejemplo</div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/mercado" element={<Mercado />} />
          <Route path="/lote/:id" element={<DetalleLote />} />
          <Route path="/tienda/:id" element={<PerfilVendedor />} />
          <Route path="/publicar" element={<PublicarLote />} />
          <Route path="/impacto" element={<Impacto />} />
        </Route>
      </Routes>
    </>
  )
}
