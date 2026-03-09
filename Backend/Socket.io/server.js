import app from './src/app.js';
import { createServer } from "http";
import { Server } from "socket.io";


const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("new connection created ...")

  socket.on("message" , (msg)=>{
    console.log(msg)
  })
  io.emit("abc");
});

httpServer.listen(3000 , ()=>{
    console.log("server is running on port 3000")
});