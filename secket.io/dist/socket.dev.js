"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socketIO = void 0;

var _socket = require("socket.io");

var _schemas = _interopRequireDefault(require("../routes/schemas/schemas.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var socketIO = function socketIO(server) {
  var io = new _socket.Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  }); // io.on('connection', socket => {
  //   console.log(
  //     'a user connected'
  //     // socket.handshake.query
  //   )
  //   var member = {}
  //   // ref.User.findOneAndUpdate(
  //   //   { email: socket.handshake.query.userId },
  //   //   { activeRoomId: socket.handshake.query.roomId }
  //   // ).then(e => {
  //   //   console.log(e)
  //   // })
  //   ref.User.findOne({ email: socket.handshake.query.userId }).then(member => {
  //     member = member
  //     ref.Group.where({ _id: socket.handshake.query.roomId })
  //       .updateOne({ $push: { members: member } })
  //       .then(e => {
  //         ref.Group.find().then(e => {
  //           console.log(e)
  //         })
  //       })
  //   })
  //   //   socket.emit('sending', 'Hi User')
  //   //   socket.on('recieving', data => {
  //   //   console.log(data, 'recieved')
  //   // })
  //   socket.on('disconnect', () => {
  //     ref.Group.where({ _id: socket.handshake.query.roomId })
  //       .updateOne(
  //         { _id: socket.handshake.query.roomId },
  //         { $pull: { members: member } },
  //         { upsert: true, multi: false }
  //       )
  //       .then(e => {
  //         ref.Group.find().then(e => {
  //           console.log(e)
  //         })
  //       })
  //     console.log('user disconnected')
  //   })
  // })
};

exports.socketIO = socketIO;
var o = 1;
setTimeout(function () {
  o++;

  _schemas["default"].Group.where({
    _id: '6362c1330140ac812c08a406'
  }).updateOne({
    $pull: {
      members: {
        a: 'aghjgsd'
      }
    }
  }).then(function (e) {
    _schemas["default"].Group.find().then(function (e) {
      console.log(e);
    });
  });
}, 3000);