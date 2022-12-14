import mongoose from 'mongoose'

const groupSchema = mongoose.Schema({
  groupName: String,
  groupLanguage: String,
  comment: String,
  ownerName: String,
  ownerData: { type: mongoose.Types.ObjectId, ref: 'user' },
  members: Array,
  tage: [String],
  selectFile: String,
  likeCount: {
    type: Number,
    default: 0
  },
  creatAt: {
    type: Date,
    default: new Date()
  }
})

const Group = mongoose.model('Group', groupSchema)

const userSchema = mongoose.Schema({
  displayName: String,
  blocked: Boolean,
  email: String,
  uid: String,
  photoURL: String,
  activeRoomId: String,
  isOnline: Boolean
})

const User = mongoose.model('user', userSchema)

export default { User, Group }
