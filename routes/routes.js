import express from 'express'
import ref from './schemas/schemas.js'
import mongoose from 'mongoose'

const router = express.Router()

// app

router.get('/', function (req, res) {
  res.send('Server is running')
})

// User Routes

router.post('/add_user', function (req, res) {
  const doc = new ref.User(req.body)
  
  doc.save()

  ref.User.find().then(e => {
    res.send(e)
  console.log('User added' ,e);

  })
})

router.post('/get_user', function (req, res) {
  ref.User.findOne({ email: req.body.uid }).then(e => {
    res.send(e)
  })
})
router.post('/remove_user', function (req, res) {
  ref.User.findOneAndDelete({ email: req.body.uid }).then(e => {
    res.send(e)
    console.log('user logged out', e)
  })
  
})

// Group Routes

router.post('/post_group', function (req, res) {
  const doc = new ref.Group(req.body)
  doc.save().then(e => {
    res.send(e._id)
  })

  ref.Group.where()
    .populate('ownerData')
    .find()
    .then(e => {
      // res.send(e)
    })
})

router.post('/get_group', function (req, res) {
  ref.Group.where({ _id: req.body.id })
    .populate('ownerData')
    .findOne()
    .then(e => {
      res.send(e)
    })
})

router.post('/get_groups', function (req, res) {
  ref.Group.where()
    .populate('ownerData')
    .find()
    .then(e => {
      res.send(e)
    })
})
ref.Group.where()
.populate('ownerData')
.find()
.then(e => {
  console.log(e);
})

// router.post('/add_member', function (req, res) {

//   ref.Group.where({ members: { $in: req.body.member } }).findOne(
//     (err, data) => {
//       // console.log(data);
//       if (data === null) {
//         ref.Group.updateOne(
//           { _id: req.body.groupID },
//           { $push: { members: req.body.member } }
//         ).then(e => {})
//       }
//     }
//   )
// })
// router.post('/delete_member', function (req, res) {
//   console.log(req.body);
//     ref.Group.updateOne(
//       { _id: req.body.id },
//       { $pull: { members: req.body.user } }
//     ).then(e => {

//       console.log(e);
//     })

// })

export default router
