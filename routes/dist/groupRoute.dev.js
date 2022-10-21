"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _schemas = _interopRequireDefault(require("./schemas/schemas.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/post_group', function (req, res) {
  var doc = new _schemas["default"](req.body);
  doc.save();

  _schemas["default"].find().then(function (e) {
    console.log(e);
    res.send(e);
  });
});
router.get('/get_posts', function (req, res) {});
var _default = router;
exports["default"] = _default;