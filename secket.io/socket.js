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

  // Import the necessary dependencies

  // io.on('connection', (socket) => {
  //   console.log('Socket connected:', socket.id);

  //   // Listen for the 'userConnect' event
  //   socket.on('userConnect', ({ userId }) => {
  //     console.log('User connected:', userId);

  //   });

  //   // Listen for the 'disconnect' event
  //   socket.on('disconnect', () => {
  //     console.log('Socket disconnected:', socket.id);

  //   });
  // });

  const changeStream = ref.Group.watch();
  const changeUserStream = ref.User.watch();

  changeStream.on("change", change => {
    if (change.documentKey._id) {
      const groupId = change.documentKey._id.toString();
      io.emit(groupId, change);
      console.log(change);
    }
  });
  changeUserStream.on("change", change => {
    if (change.documentKey._id) {
      const userId = change.documentKey._id.toString();

      ref.User.findOne({ _id: mongoose.Types.ObjectId(userId) }).then(e => {
        // console.log(e);
        io.emit(userId, e);
      });
    }
  });

  io.on("connection", async socket => {
    console.log("A user connected");

    // On the server side

    // Import the necessary modules and models

    // Listen for the incoming data
    socket.on("send-message", async message => {
      try {
        // Parse and validate the incoming data
        const { groupId, senderId, content, timestamp, senderPic } = message;
        console.log(message);
        // Perform validation checks on the data

        // Create a new message instance
        const newMessage = new ref.Message({
          groupId,
          senderId,
          content,
          timestamp,
          senderPic
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        // Perform additional processing or actions based on the message
        // ...
        const messages = await ref.Message.find({ groupId: savedMessage.groupId });

        // Send a response back to the frontend (optional)
        io.emit("message-received" + savedMessage.groupId, {
          status: "success",
          message: "Message received and saved",
          messages
        });
      } catch (error) {
        console.error("Error handling message:", error);

        // Send an error response back to the frontend (optional)
        // socket.emit("message-received", {
        //   status: "error",
        //   message: "Error handling the message"
        // });
      }
    });



    // Handle disconnect event
    socket.on("disconnect", async () => {
      console.log("A user disconnected");

      const { groupId, memberId } = socket.handshake.query;
      console.log(groupId, memberId);
      if (memberId !== null) {
        const updatedGroup = await ref.Group.findByIdAndUpdate(
          groupId,
          { $pull: { members: { _id: mongoose.Types.ObjectId(memberId) } } },
          { new: true }
        );
      }

      try {
        if (memberId !== null) {
          await ref.User.findByIdAndUpdate(memberId, { currentGroup: "none" });
          console.log("User currentGroup updated to none");
        }
      } catch (error) {
        console.log("Error updating user:", error);
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
