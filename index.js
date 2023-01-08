import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { Server } from 'socket.io'
import groupRouter from './routes/routes.js'
import { socketIO } from './secket.io/socket.js'

const app = express()
app.use(bodyParser.json({ limit: '30mb', extanded: true }))
app.use(cors())

app.use('/', groupRouter)

const CONNECTION_URL =
  'mongodb+srv://yaromeha:zkAN6SOY0X4e7vq7@cluster0.lszh2gd.mongodb.net/?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopoLogy: true })
  .then(e => {})
  .catch(err => {
    console.log(err)
  })

const server = app.listen(PORT, a =>
  console.log(`Server running on port: ${PORT}`)
)

socketIO(server)
