import { error, log } from "console";
import { Server } from "socket.io";

let io;

export const initSocket = async (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  console.log("socket io server is ready...");
  

  io.on("connection", (socket) => {
    console.log("A user connected : ", socket.id);
  });
};

export function getId() {
  if (!io) {
    throw new error("Socket.io not initiated...");
  }
  return io;
}
