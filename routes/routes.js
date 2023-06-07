import express from "express";
import ref from "./schemas/schemas.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

const router = express.Router();

// Default route
router.get("/", function(req, res) {
  res.send("Server is running");
});

// User Routes

// Add a new user
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

// Get user by ID
router.post("/get_user", function(req, res) {
  ref.User.findOne({ _id: req.body.uid }).then(e => {
    res.send(e);
  });
});

// Remove user by ID
router.post("/remove_user", function(req, res) {
  ref.User
    .findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body.uid) })
    .then(e => {
      res.send(e);
      console.log("User logged out", e);
    });
});

// Group Routes

// Create a new group
router.post("/create_group", async (req, res) => {
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

// Get group by ID
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

// Get all groups
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

    req.user = user; // Attach the user object to the request for future use
    next();
  } catch (error) {
    console.log("Error finding user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a user as a member of a group
router.post("/add_member", checkGroupMembership, async (req, res) => {
  const groupId = req.body.groupId;
  const { user } = req; // Retrieve the user object from the request

  try {
    const group = await ref.Group.findOne({ _id: groupId, members: user._id });

    if (group) {
      return res
        .status(200)
        .json({ message: "User is already a member of the group" });
    }

    const updatedGroup = await ref.Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: user._id } },
      { new: true }
    );

    await ref.User.findByIdAndUpdate(
      user._id,
      { currentGroup: groupId },
      (err, user) => {
        if (err) {
          console.log("Error updating user:", err);
        }
      }
    );

    return res
      .status(200)
      .json({ message: "User has been added as a member of the group" });
  } catch (error) {
    console.log("Error adding user as group member:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
