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
  }
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
  isOnline: Boolean
});

const User = mongoose.model("user", userSchema);

export default { User, Group };
