import { Server } from "socket.io";
import ref from "../routes/schemas/schemas.js";
import mongoose from "mongoose";

export const socketIO = server => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const changeStream = ref.Group.watch();

  changeStream.on("change", change => {
    if (change.documentKey._id) {
      const groupId = change.documentKey._id.toString();
      io.emit(groupId, change);
      console.log(change);
    }
  });

  io.on("connection", socket => {
    console.log("A user connected");

    // Handle disconnect event
    socket.on("disconnect", async () => {
      console.log("A user disconnected");

      const { groupId, memberId } = socket.handshake.query;
      console.log(groupId, memberId);
      if (groupId && memberId) {
        const updatedGroup = await ref.Group.findByIdAndUpdate(
          groupId,
          { $pull: { members: { _id: mongoose.Types.ObjectId(memberId) } } },
          { new: true }
        );

        try {
          await ref.User.findByIdAndUpdate(memberId, { currentGroup: "none" });
          console.log("User currentGroup updated to none");
        } catch (error) {
          console.log("Error updating user:", error);
        }
      }

      // Clean up any necessary resources
    });
  });

  // io.on('connection', socket => {
  //   console.log(
  //     'a user connected'
  //     // socket.handshake.query
  //   )
  //   var member = {}

  //   socket.on('disconnect', () => {
  //     console.log('user disconnected')
  //     // ref.Group.where({ _id: socket.handshake.query.roomId })
  //     //   .updateOne(
  //     //     { _id: socket.handshake.query.roomId },
  //     //     { $pull: { members: { email: member.email } } }
  //     //     // { upsert: true, multi: false }
  //     //   )
  //     //   .then(e => {
  //     //     ref.Group.find().then(e => {
  //     //       console.log(e)
  //     //     })
  //     //   })
  //   })
  // })
};

// setInterval(() => {
//   ref.Group.find().then(e => {
//     console.log(e)
//   })
// }, 1000)
