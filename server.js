const express=require('express')
const http=require('http')
const socketIo=require('socket.io')
const path=require('path')

const app=express()
const server=http.createServer(app)
const io=socketIo(server,{
  cors:{
    origin:'http://localhost:5173',
    methods:['GET','POST']
  }
})

const PORT=5000;

io.on('connection',(socket) =>{
  console.log(`Client Connected: ${socket.id}`)

  socket.on('joinRoom',(room) =>{
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`)

    const clientInRoom=io.sockets.adapter.rooms.get(room)
    console.log(`Clients in room ${room}`, clientInRoom)
  })

  socket.on('documentChange',({room,data}) =>{
    console.log(`Document change in room ${room}`,data)
    socket.to(room).emit('documentChange',data)
  })

  socket.on('disconnect',() =>{
    console.log(`Client disconnected ${socket.id}`)
  })
})



server.listen(PORT,() =>{
  console.log(`Server is running on port ${PORT}`)
})