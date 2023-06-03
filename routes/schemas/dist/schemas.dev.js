"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var groupSchema = _mongoose["default"].Schema({
  groupName: String,
  groupLanguage: String,
  comment: String,
  ownerName: String,
  ownerData: {
    type: _mongoose["default"].Types.ObjectId,
    ref: 'user'
  },
  members: Array,
  tage: [String],
  selectFile: String,
  likeCount: {
    type: Number,
    "default": 0
  },
  creatAt: {
    type: Date,
    "default": new Date()
  }
});

var Group = _mongoose["default"].model('Group', groupSchema);

var userSchema = _mongoose["default"].Schema({
  displayName: String,
  blocked: Boolean,
  email: String,
  uid: String,
  photoURL: String,
  activeRoomId: String,
  isOnline: Boolean
});

var User = _mongoose["default"].model('user', userSchema);

var _default = {
  User: User,
  Group: Group
};
exports["default"] = _default;