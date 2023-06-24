import express from "express";
import ref from "./schemas/schemas.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cron from 'node-cron';

const router = express.Router();

// app

router.get("/", function (req, res) {
  res.send("Server is running");
});

// User Routes

router.post("/add_user", async function (req, res) {
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

router.post("/get_user", function (req, res) {
  ref.User.findOne({ _id: mongoose.Types.ObjectId(req.body.uid) }).then(e => {
    res.send(e);
  });
});
router.post("/remove_user", function (req, res) {
  ref.User
    .findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.uid) })
    .then(e => {
      res.send(e);
      console.log("user logged out", e);
    });
});

// Group Routes

router.post("/create-group", async (req, res) => {
  try {
    const { groupName, groupDescription, ownerId, members } = req.body;

    const existingGroup = await ref.Group.findOne({ ownerId });
    console.log("User has already created a group", ownerId);


    if (existingGroup !== null) {
      // console.log(existingGroup, "User has already created a group", ownerId);
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
        _id: group._id || "",
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

// Middleware function to check if the user is already a member of a group
const checkGroupMembership = async (req, res, next) => {
  const userId = req.body.userId;

  try {
    if (userId) {

      const user = await ref.User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.currentGroup !== "none") {
        console.log("You are already a member of another group.");
        return res.status(403).json({
          message:
            "You are already a member of another group. Please leave the current group before joining a new one."
        });
      }
      next();


    }



    // User is not a member of any group, proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error finding user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/add_member", checkGroupMembership, async (req, res) => {
  const groupId = req.body.groupId;
  const userId = req.body.userId;

  try {
    const user = await ref.User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await ref.Group.findOne({ _id: groupId, members: user });

    if (group) {
      return res
        .status(200)
        .json({ message: "User is already a member of the group" });
    }

    const updatedGroup = await ref.Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: user } },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    await ref.User.findByIdAndUpdate(userId, {
      currentGroup: groupId,
      joinTime: Date.now()
    });

    return res
      .status(200)
      .json({ message: "User has been added as a member of the group" });
  } catch (error) {
    console.log("Error adding user as group member:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the deletion function
const deleteEmptyGroups = async () => {
  try {
    // Find groups with empty member arrays or no members
    const groupsToDelete = await ref.Group.find({
      $or: [{ members: [] }, { members: { $exists: false } }]
    });

    // Delete groups and their messages
    for (const group of groupsToDelete) {
      // Delete messages for the group
      await ref.Message.deleteMany({ groupId: group._id });

      // Delete the group
      await ref.Group.findByIdAndDelete(group._id);
    }

    console.log("Empty groups and their messages have been deleted.");
  } catch (error) {
    console.error("Error deleting empty groups:", error);
  }
};

// Schedule the deletion function to run every 5 minutes
cron.schedule("* * * * *", deleteEmptyGroups);
export default router;


setTimeout(async () => {
  const existingGroup = await ref.Group.findOne({ ownerId: '649578fd2a19696eabaca720' });
  // if (existingGroup) {
  console.log(existingGroup);


  // }
}, 5000);