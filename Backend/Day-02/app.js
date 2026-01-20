const express = require('express');

const app = express(); // server instance create krna

app.get('/',(req,res) =>{
    res.send("Hello World i am here how are you");

})

app.listen(5173); // server start karna