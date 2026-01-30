// server start karna 
// database se connect karna


const express = require('express');
const { default: mongoose } = require('mongoose');
const noteModel = require("./models/Notes.model");
const app = express();
app.use(express.json());


app.post("/notes", async (req, res) => {
    const { title, description } = req.body;
    const note = await noteModel.create({
        title,
        description
    })
    res.status(201).json({
        message: "Note created successfully.",
        note
    })
})
app.get("/notes",(req,res)=>{
    res.send({
        message:"helloo"
    })
})


module.exports = app;