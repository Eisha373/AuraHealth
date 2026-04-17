import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const api = (route, token) =>
  axios.get(`http://localhost:5000/api/${route}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export default function Dashboard() {
  const navigate   = useNavigate()
  const token      = localStorage.getItem('token')
  const [sleep,  setSleep]  = useState([])
  const [water,  setWater]  = useState([])
  const [mood,   setMood]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return navigate('/login')
    Promise.all([
      api('sleep', token),
      api('water', token),
      api('mood',  token),
    ]).then(([s, w, m]) => {
      setSleep(s.data)
      setWater(w.data)
      setMood(m.data)
    }).finally(() => setLoading(false))
  }, [])

  const latest = (arr) => arr[0] ?? null
  const avgSleep = sleep.length
    ? (sleep.reduce((a, b) => a + b.hours, 0) / sleep.length).toFixed(1)
    : '—'
  const totalWater = water[0]?.glasses ?? '—'
  const latestMood = mood[0]?.mood ?? '—'

  const moodEmoji = { Awful:'😞', Bad:'😕', Neutral:'😐', Good:'🙂', Great:'😄' }

  const cards = [
    {
      title: 'Sleep',
      icon: '😴',
      stat: avgSleep === '—' ? '—' : `${avgSleep}h`,
      sub: 'avg last 7 days',
      link: '/sleep',
      color: 'bg-indigo-50 border-indigo-200',
      btn: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      title: 'Water',
      icon: '💧',
      stat: totalWater === '—' ? '—' : `${totalWater} glasses`,
      sub: 'last entry',
      link: '/water',
      color: 'bg-blue-50 border-blue-200',
      btn: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Mood',
      icon: moodEmoji[latestMood] ?? '🎭',
      stat: latestMood,
      sub: 'last logged mood',
      link: '/mood',
      color: 'bg-purple-50 border-purple-200',
      btn: 'bg-purple-600 hover:bg-purple-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">AuraHealth</h1>
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Your Health Dashboard</h2>
        <p className="text-gray-500 mb-8">Track, log, and improve every day 💪</p>

        {loading ? (
          <div className="text-center text-gray-400 py-20 text-lg">Loading your data...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {cards.map((c) => (
              <div key={c.title} className={`rounded-2xl border p-5 ${c.color} flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="text-lg font-semibold text-gray-700">{c.title}</span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{c.stat}</p>
                  <p className="text-sm text-gray-500">{c.sub}</p>
                </div>
                <Link
                  to={c.link}
                  className={`mt-auto text-center text-white text-sm py-2 rounded-lg font-medium transition ${c.btn}`}
                >
                  Log {c.title}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Recent logs */}
        {!loading && sleep.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Sleep Logs</h3>
            <div className="bg-white rounded-2xl shadow divide-y">
              {sleep.slice(0, 5).map((s) => (
                <div key={s._id} className="flex justify-between px-5 py-3 text-sm text-gray-600">
                  <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                  <span>{s.hours}h — {s.quality}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && mood.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Mood Logs</h3>
            <div className="bg-white rounded-2xl shadow divide-y">
              {mood.slice(0, 5).map((m) => (
                <div key={m._id} className="flex justify-between px-5 py-3 text-sm text-gray-600">
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  <span>{moodEmoji[m.mood]} {m.mood} {m.note && `— ${m.note}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}