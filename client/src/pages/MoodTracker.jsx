import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const moods = [
  { emoji: '😄', label: 'Great', value: 5 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '😔', label: 'Bad', value: 2 },
  { emoji: '😢', label: 'Awful', value: 1 },
]

export default function MoodTracker() {
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selected) return toast.error('Please select a mood!')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/mood', 
        { mood: selected.value, label: selected.label, note },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Mood logged! 🎉')
      setSelected(null)
      setNote('')
    } catch (err) {
      toast.error('Failed to save mood')
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">How are you feeling?</h2>
          <p className="text-gray-500 mb-6">Track your mood daily for better insights</p>

          <div className="flex justify-between mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelected(mood)}
                className={`flex flex-col items-center p-3 rounded-xl transition ${
                  selected?.value === mood.value
                    ? 'bg-indigo-100 ring-2 ring-indigo-400'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs text-gray-500 mt-1">{mood.label}</span>
              </button>
            ))}
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
            placeholder="Add a note (optional)..."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Log Mood'}
          </button>
        </div>
      </div>
    </div>
  )
}