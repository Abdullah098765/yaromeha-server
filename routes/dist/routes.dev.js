"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _schemas = _interopRequireDefault(require("./schemas/schemas.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // User Routes


router.post('/add_user', function (req, res) {
  var doc = new _schemas["default"].User(req.body);
  doc.save();

  _schemas["default"].User.find().then(function (e) {
    res.send(e);
  });
});
router.post('/get_user', function (req, res) {
  _schemas["default"].User.findOne({
    photoURL: req.body.uid
  }).then(function (e) {
    res.send(e);
  });
}); // Group Routes

router.post('/post_group', function (req, res) {
  var doc = new _schemas["default"].Group(req.body);
  doc.save().then(function (e) {
    res.send(e._id);
  });

  _schemas["default"].Group.where().populate('ownerData').find().then(function (e) {// console.log(e)
    // res.send(e)
  });
});
router.post('/get_group', function (req, res) {
  _schemas["default"].Group.where({
    _id: req.body.id
  }).populate('ownerData').findOne().then(function (e) {
    res.send(e);
  });
});
router.post('/get_groups', function (req, res) {
  _schemas["default"].Group.where().populate('ownerData').find().then(function (e) {
    res.send(e);
    console.log(e);
  });
});
var _default = router;
exports["default"] = _default;