
const express = require('express');
const cors = require('cors');
const path = require('path');
const DataModel = require('../src/models/Data.model');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post("/data", async (req, res) => {
    const { Name, Age, Email, Phone , Address , Occupation ,Salary, MaritalStatus, Children , Hobbies , Education } = req.body
    const data = await DataModel.create({
        Name,
        Age,
        Email,
        Phone,
        Address,
        Occupation,
        Salary,
        MaritalStatus,
        Children,
        Hobbies,
        Education
    })
    res.status(201).json({
        message: "Data send successfully...",
        Data: data
    })
})

app.get("/data", async (req, res) => {
    const data = await DataModel.find()
    res.status(200).json({
        data
    })
})

app.delete("/data/:id", async (req,res) =>{
    const id = req.params.id;
    await DataModel.findByIdAndDelete(id)
    console.log(id);
    res.status(200).json({
        message:"Note deleted successfully."
    })
})

app.patch("/data/:id",async (req,res)=>{
    const id = req.params.id;
    console.log(req.body.Name);
    const {Name} = req.body;
    await DataModel.findByIdAndUpdate(id,{Name});
    res.status(201).json({
        message:"The Data is updated..."
    })
})

// Serve index.html for any unknown GET routes (SPA support)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
