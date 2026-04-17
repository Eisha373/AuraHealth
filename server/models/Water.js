import mongoose from 'mongoose'

const waterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  glasses: { type: Number, required: true },
}, { timestamps: true })

export default mongoose.model('Water', waterSchema)