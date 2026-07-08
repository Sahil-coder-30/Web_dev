import { io } from 'socket.io-client';

export let socket = null;

export const inializeSocketConnection = () => {
    if (!socket) {
        socket = io("/", {
            withCredentials: true,
            autoConnect: true,
        });

        socket.on("connect", () => {
            console.log("Connected to Socket.io server with ID:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from Socket.io server");
        });
    }
    return socket;
};