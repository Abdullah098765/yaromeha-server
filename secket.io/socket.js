import { Server } from "socket.io";
import ref from "../routes/schemas/schemas.js";
import mongoose from "mongoose";

export const socketIO = server => {
  const io = new Server(server, {
    cors: {
      origin: "https://yaromeha-nymd.vercel.app",
      methods: ["GET", "POST"]
    }
  });

  const changeStream = ref.Group.watch();

  changeStream.on("change", change => {
    const groupId = change.documentKey._id.toString();
    io.emit(groupId, change);
  });

  io.on("connection", socket => {
    console.log("A user connected");

    // Handle disconnect event
    socket.on("disconnect", async () => {
      console.log("A user disconnected");

      const { groupId, memberId } = socket.handshake.query;
      console.log(groupId, memberId);

      const updatedGroup = await ref.Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: { _id: mongoose.Types.ObjectId(memberId) } } },
        { new: true }
      );

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
