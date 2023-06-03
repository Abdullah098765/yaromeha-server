"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cors = _interopRequireDefault(require("cors"));

var _socket = require("socket.io");

var _routes = _interopRequireDefault(require("./routes/routes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json({
  limit: '30mb',
  extanded: true
}));
app.use((0, _cors["default"])());
app.use('/', _routes["default"]);
var CONNECTION_URL = 'mongodb+srv://yaromeha:zkAN6SOY0X4e7vq7@cluster0.lszh2gd.mongodb.net/?retryWrites=true&w=majority';
var PORT = process.env.PORT || 5000;

_mongoose["default"].connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopoLogy: true
}).then(function (e) {})["catch"](function (err) {
  console.log(err);
});

var server = app.listen(PORT, function (a) {
  return console.log("Server running on port: ".concat(PORT));
});
var io = new _socket.Server(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST']
  }
});
io.on('connection', function (socket) {
  console.log('a user connected');
});