import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
})

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    enum: ['CS', 'EC', 'ME', 'CE', 'EE', 'Other'],
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Quiz = mongoose.model('Quiz', quizSchema)
export default Quiz