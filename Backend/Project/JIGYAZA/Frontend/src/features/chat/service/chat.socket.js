import {io} from 'socket.io-client';

export const inializeSocketConnection = ()=>{
    const socket = io("http://localhost:3000");


    socket.on("connect" , ()=>{
        console.log("connected to Socket io server ...");
        
    })
}