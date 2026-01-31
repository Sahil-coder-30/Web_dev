const express = require("express");
const NoteModel = require("./models/Note.model");
const { default: mongoose } = require("mongoose");
const app = express();
app.use(express.json());


// post /api/notes
// create new note and save in database
// const {title, description} = req.body

app.post("/api/notes",async (req,res)=>{
    const {title , description} = req.body;
    const note = await NoteModel.create({
        title,
        description
    })
    res.status(201).json({
        message:"Note created successfully.",
        note
    })
})

/**
 * get data 
 * /api/notes
 * get data form mongo db database
 * and send onto frontend
 */

app.get("/api/notes",async (req,res)=>{
    const note = await NoteModel.find();
    res.status(200).json({
        note
    })
})

/**
 * Delete api 
 * delete note with only params.id
 */

app.delete("/api/notes/:id",async (req,res)=>{
    const id = req.params.id;
    await NoteModel.findByIdAndDelete(id)
    console.log(id);
    res.status(200).json({
        message:"Note deleted successfully."
    })
})

/**
 * - PATCH /api/notes/:id
 * - update the data of the notes
 * - req.body = {description}
 */

app.patch("/api/notes/:id",async (req,res) =>{
    const id = req.params.id;
    const {description} = req.body
    await NoteModel.findByIdAndUpdate(id, {description})
    res.status(200).json({
        message:"Note Updated successfully."
    })
})
module.exports = app;