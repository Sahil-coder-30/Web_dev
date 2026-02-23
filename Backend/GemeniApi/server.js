require('dotenv').config();
const express = require('express');
const app = require('./src/app');

app.listen(8000, ()=>{
    console.log("server is running on the port 8000");
    
})
