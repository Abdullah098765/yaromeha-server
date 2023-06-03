import { Server } from 'socket.io'
import ref from '../routes/schemas/schemas.js'

export const socketIO = server => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', socket => {
    console.log(
      'a user connected'
      // socket.handshake.query
    )
    var member = {}

    // ref.User.findOneAndUpdate(
    //   { email: socket.handshake.query.userId },
    //   { activeRoomId: socket.handshake.query.roomId }
    // ).then(e => {
    //   console.log(e)
    // })

    ref.User.findOne({ email: socket.handshake.query.userId }).then(member => {
      member = member
      console.log(member)
      ref.Group.where({ _id: socket.handshake.query.roomId })
        .updateOne({ $push: { members: member } })
        .then(e => {
          ref.Group.find().then(e => {
            console.log(e)
            setTimeout(() => {}, 5000)
          })
        })
    })

    //   socket.emit('sending', 'Hi User')
    //   socket.on('recieving', data => {
    //   console.log(data, 'recieved')
    // })

    socket.on('disconnect', () => {
      console.log('user disconnected')
      ref.Group.where({ _id: socket.handshake.query.roomId })
        .updateOne(
          { _id: socket.handshake.query.roomId },
          { $pull: { members: { email: member.email } } }
          // { upsert: true, multi: false }
        )
        .then(e => {
          ref.Group.find().then(e => {
            console.log(e)
          })
        })
    })
  })
}

// setInterval(() => {
//   ref.Group.find().then(e => {
//     console.log(e)
//   })
// }, 1000)
