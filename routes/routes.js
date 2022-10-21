import express from 'express'
import ref from './schemas/schemas.js'
import mongoose from 'mongoose'

const router = express.Router()

// User Routes

router.post('/add_user', function (req, res) {

  const doc = new ref.User(req.body)
  doc.save()

  ref.User.find().then(e => {
    res.send(e)
  })
})
router.post('/get_user', function (req, res) {
  ref.User.findOne({ photoURL: req.body.uid }).then(e => {
    res.send(e)
  })
})

// Group Routes

router.post('/post_group', function (req, res) {
  const doc = new ref.Group(req.body)
  doc.save().then((e)=>{
    res.send(e._id)
    
  })

  ref.Group.where()
    .populate('ownerData')
    .find()
    .then(e => {
      // console.log(e)
      // res.send(e)
    })
})

router.post('/get_group', function (req, res) {

ref.Group.where({_id:req.body.id})
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
    console.log(e);
  })
  })
export default router
