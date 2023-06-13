import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  groupName: String,
  groupDescription: String,
  groupLanguage: String,
  ownerId: String,
  ownerData: { type: mongoose.Types.ObjectId, ref: "user" },
  members: Array,
  creatAt: {
    type: Date,
    default: new Date()
  },
  lastLeftTime:Number
});

const Group = mongoose.model("Group", groupSchema);

const userSchema = mongoose.Schema({
  displayName: String,
  blocked: Boolean,
  currentGroup: {
    type: String,
    default: "none"
  },
  email: String,
  uid: String,
  photoURL: String,
  activeRoomId: String,
  joinTime :Number,
  isOnline: Boolean
});

const User = mongoose.model("user", userSchema);

const messageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  senderPic:String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema);

export default { User, Group, Message };
