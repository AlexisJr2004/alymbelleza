import { Routes, Route } from 'react-router-dom'

function Placeholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="text-center">
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
          Bella Beauty
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Panel de administración (React)</h1>
        <p className="text-sm text-gray-500 mt-2">En construcción — sub-fase 0 del plan de migración.</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Placeholder />} />
    </Routes>
  )
}

export default App
