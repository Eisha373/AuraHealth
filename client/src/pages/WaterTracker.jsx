import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0)
  const [loading, setLoading] = useState(false)
  const GOAL = 8

  const handleSubmit = async () => {
    if (glasses === 0) return toast.error('Add at least 1 glass!')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/water',
        { glasses },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Water intake logged! 💧')
      setGlasses(0)
    } catch (err) {
      toast.error('Failed to save water data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">AuraHealth</h1>
        <Link to="/dashboard" className="text-indigo-600 hover:underline">← Dashboard</Link>
      </nav>

      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Water Tracker</h2>
          <p className="text-gray-500 mb-6">Daily goal: {GOAL} glasses</p>

          {/* Visual glass grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {Array.from({ length: GOAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => setGlasses(i + 1)}
                className={`text-3xl p-3 rounded-xl border-2 transition ${
                  i < glasses
                    ? 'bg-blue-100 border-blue-400'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                🥤
              </button>
            ))}
          </div>

          <p className="text-center text-gray-600 mb-4">
            {glasses === 0
              ? 'Tap a glass to log intake'
              : `${glasses} of ${GOAL} glasses`}
          </p>

          {/* Manual input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or enter manually
            </label>
            <input
              type="number"
              min="1"
              max="20"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Number of glasses"
              value={glasses || ''}
              onChange={(e) => setGlasses(Number(e.target.value))}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Log Water Intake'}
          </button>
        </div>
      </div>
    </div>
  )
}