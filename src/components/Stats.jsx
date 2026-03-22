import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'

function Stats({ library, onBack }) {
  const leidos = library.library.filter(b => b.status === 'leído')
  const leyendo = library.library.filter(b => b.status === 'leyendo')
  const quiero = library.library.filter(b => b.status === 'quiero_leer')
  const conNota = leidos.filter(b => b.rating)
  const notaMedia = conNota.length
    ? (conNota.reduce((acc, b) => acc + b.rating, 0) / conNota.length).toFixed(1)
    : '-'
  const mejorLibro = conNota.length
    ? conNota.reduce((a, b) => a.rating > b.rating ? a : b)
    : null

  const distribucionNotas = Array.from({ length: 10 }, (_, i) => ({
    nota: `${i + 1}`,
    libros: conNota.filter(b => b.rating === i + 1).length
  }))

  const librosPorMes = (() => {
    const meses = {}
    library.library.forEach(b => {
      const fecha = new Date(b.addedAt)
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      const label = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
      if (!meses[key]) meses[key] = { label, libros: 0 }
      meses[key].libros++
    })
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
  })()

  const topAutores = (() => {
    const autores = {}
    library.library.forEach(b => {
      const autor = b.author_name?.[0] ?? 'Desconocido'
      autores[autor] = (autores[autor] || 0) + 1
    })
    return Object.entries(autores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([autor, libros]) => ({ autor: autor.split(' ').slice(-1)[0], libros, nombreCompleto: autor }))
  })()

  const topGeneros = (() => {
    const EXCLUIR = ['award', 'series', 'winner', 'hugo', 'nebula', 'prize', 'fiction/', 'nonfiction/']
    const generos = {}
    library.library.forEach(b => {
      if (b.subjects) {
        b.subjects
          .filter(g =>
            !g.includes(':') &&
            !g.includes('_') &&
            !g.includes('/') &&
            !g.match(/^\d/) &&
            g.length < 40 &&
            !EXCLUIR.some(e => g.toLowerCase().includes(e))
          )
          .slice(0, 3)
          .forEach(g => {
            const clean = g.charAt(0).toUpperCase() + g.slice(1)
            generos[clean] = (generos[clean] || 0) + 1
          })
      }
    })
    return Object.entries(generos)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genero, libros]) => ({
        genero: genero.length > 20 ? genero.slice(0, 20) + '…' : genero,
        libros
      }))
  })()

  const tooltipStyle = {
    backgroundColor: '#1f2937',
    border: '0.5px solid #374151',
    borderRadius: '8px',
    color: '#f9fafb',
    fontSize: '12px'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          ← Volver
        </button>

        <h1 className="text-4xl font-bold text-center mb-10">📊 Mis Estadísticas</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total en biblioteca', value: library.library.length },
            { label: 'Leídos', value: leidos.length },
            { label: 'Leyendo', value: leyendo.length },
            { label: 'Pendientes', value: quiero.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-800 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Nota media</p>
            <p className="text-4xl font-bold text-amber-400">{notaMedia}<span className="text-lg text-gray-500">/10</span></p>
          </div>
          {mejorLibro && (
            <div className="bg-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Mejor valorado</p>
              <p className="text-lg font-semibold line-clamp-1">{mejorLibro.title}</p>
              <p className="text-sm text-amber-400 mt-1">{'★'.repeat(mejorLibro.rating)} {mejorLibro.rating}/10</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Distribución de notas</p>
            {conNota.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aún no has valorado ningún libro</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distribucionNotas} barSize={20}>
                  <XAxis dataKey="nota" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#374151' }} />
                  <Bar dataKey="libros" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Libros" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Libros añadidos por mes</p>
            {librosPorMes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aún no hay datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={librosPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="libros" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Libros" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Top autores</p>
            {topAutores.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aún no hay datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topAutores} layout="vertical" barSize={16}>
                  <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="autor" stroke="#6b7280" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#374151' }}
                    formatter={(value, _, props) => [value, props.payload.nombreCompleto]}
                  />
                  <Bar dataKey="libros" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Libros" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Géneros más leídos</p>
            {topGeneros.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aún no hay datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topGeneros} layout="vertical" barSize={16}>
                  <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="genero" stroke="#6b7280" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#374151' }} />
                  <Bar dataKey="libros" fill="#10b981" radius={[0, 4, 4, 0]} name="Libros" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Stats