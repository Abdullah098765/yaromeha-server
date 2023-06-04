import express from "express";
import ref from "./schemas/schemas.js";
import mongoose from "mongoose";

const router = express.Router();

// app

router.get("/", function(req, res) {
  res.send("Server is running");
});

// User Routes

router.post("/add_user", function(req, res) {
  const doc = new ref.User(req.body);

  doc.save();

  ref.User.find().then(e => {
    res.send(e);
    console.log("User added", e);
  });
});

router.post("/get_user", function(req, res) {
  ref.User.findOne({ email: req.body.uid }).then(e => {
    res.send(e);
  });
});
router.post("/remove_user", function(req, res) {
  ref.User.findOneAndDelete({ email: req.body.uid }).then(e => {
    res.send(e);
    console.log("user logged out", e);
  });
});

// Group Routes

// router.post('/groups', function (req, res) {
//   const doc = new ref.Group(req.body)
//   doc.save().then(e => {
//     res.send(e._id)
//   })
// // console.log(req.body);
//   ref.Group.where()
//     .populate('ownerData')
//     .find()
//     .then(e => {
//       // res.send(e)
//     })
// })

router.post("/create-group", async (req, res) => {
  try {
    const { groupName, groupDescription, ownerId, members } = req.body;

    const existingGroup = await ref.Group.findOne({ ownerId });

    if (existingGroup) {
      return res
        .status(400)
        .json({ error: "User has already created a group" });
    }

    const group = await ref.Group.create({
      groupName,
      groupDescription,
      ownerId,
      members
    });

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create group" });
  }
});

router.post("/get_group", function(req, res) {
  ref.Group
    .where({ _id: req.body.id })
    .populate("ownerData")
    .findOne()
    .then(e => {
      res.send(e);
    });
});

// Backend API endpoint to retrieve group data
router.get("/get_groups", async (req, res) => {
  try {
    // Fetch group data from the database
    const groups = await ref.Group.find();

    const formattedGroups = groups.map(group => {
      return {
        _id: group._id,
        groupName: group.groupName,
        groupDescription: group.groupDescription,
        members: group.members
        // Add other necessary properties
      };
    });

    // Send the formatted group data as the response
    res.json(formattedGroups);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving groups data:", error);
    res.status(500).json({ error: "Failed to retrieve groups data" });
  }
});

// ref.Group.where().populate("ownerData").find().then(e => {
//   console.log(e);
// });

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

export default router;
