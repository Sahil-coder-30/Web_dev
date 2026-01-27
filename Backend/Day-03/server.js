const express = require('express');


const app = express();
app.use(express.json());
const notes = [

]
app.get("/",(req,res) =>{
    res.send("hi there");
})
console.log("hi there.");

app.post("/notes",(req,res)=>{
    notes.push(req.body);
})

app.get("/notes",(req,res)=>{
    res.send(notes);
})

app.listen(3000,()=>{
    console.log("Server is ready for use");
    
});