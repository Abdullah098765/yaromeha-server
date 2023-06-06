import express from "express";
import ref from "./schemas/schemas.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

const router = express.Router();



// app

router.get("/", function(req, res) {
  res.send("Server is running");
});

// User Routes

router.post("/add_user", async function(req, res) {
  try {
    const doc = new ref.User(req.body);
    await doc.save();
    const user = await ref.User.findOne({ uid: req.body.uid });
    res.send(user);
    console.log("User added");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/get_user", function(req, res) {
  ref.User.findOne({ email: req.body.uid }).then(e => {
    res.send(e);
  });
});
router.post("/remove_user", function(req, res) {
  ref.User.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.uid) }).then(e => {
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

// API endpoint to get group data by ID
router.get("/get_group", (req, res) => {
  const groupId = req.query.groupId;
  // Fetch the group data from the database using the group ID
  ref.Group.findById(groupId, (err, group) => {
    if (err) {
      console.error("Error retrieving group data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ group });
    }
  });
});

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

router.post("/add_member", async (req, res) => {
  const groupId = req.body.groupId;
  const userId = req.body.userId; // Assuming you have user authentication and session handling in place

  try {
    const user = await ref.User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await ref.Group.findOne({ _id: groupId, members: userId });

    if (group) {
      // User is already a member, send a response indicating that
      return res
        .status(200)
        .json({ message: "User is already a member of the group" });
    }

    // User is not a member, add their object to the group's member list
    const updatedGroup = await ref.Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: user } },
      { new: true }
    );

    // User successfully added as a member, send a response indicating that
    return res
      .status(200)
      .json({ message: "User has been added as a member of the group" });
  } catch (error) {
    console.log("Error adding user as group member:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.post("/add_member", async (req, res) => {
//   const groupId = req.body.groupId;
//   const userId = req.body.userId; // Assuming you have user authentication and session handling in place

//   try {
//     const user = await ref.User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     ref.Group.findOne({ _id: groupId, members: userId }, async (err, group) => {
//       if (err) {
//         console.log("Error checking group membership:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       if (group) {
//         // User is already a member, send a response indicating that
//         return res
//           .status(200)
//           .json({ message: "User is already a member of the group" });
//       }

//       // User is not a member, add their object to the group's member list
//       const updatedGroup = await ref.Group.findByIdAndUpdate(
//         groupId,
//         { $addToSet: { members: user } },
//         { new: true }
//       );

//       // User successfully added as a member, send a response indicating that
//       return res
//         .status(200)
//         .json({ message: "User has been added as a member of the group" });
//     });
//   } catch (error) {
//     console.log("Error adding user as group member:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
