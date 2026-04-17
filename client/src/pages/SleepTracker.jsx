import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function SleepTracker() {
  const [formData, setFormData] = useState({ hours: '', quality: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.hours || !formData.quality) return toast.error('Please fill all fields!')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/sleep',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Sleep logged! 😴')
      setFormData({ hours: '', quality: '' })
    } catch (err) {
      toast.error('Failed to save sleep data')
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Sleep Tracker</h2>
          <p className="text-gray-500 mb-6">Log your sleep for better rest insights</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours Slept
              </label>
              <input
                type="number"
                min="1"
                max="24"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. 7"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Poor', 'Fair', 'Good', 'Great', 'Excellent'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setFormData({ ...formData, quality: q })}
                    className={`py-2 rounded-lg border text-sm font-medium transition ${
                      formData.quality === q
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Log Sleep'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}