import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./App.css";

const App = () => {


  const [Notes, setNotes] = useState([]);

  

  const fetchNotes = () => {
    axios.get("http://localhost:3000/api/notes").then((res) => {
      setNotes(res.data.note);
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handelSubmit = (e)=>{
    e.preventDefault();
    const {title , description} = e.target.elements;
    console.log(`Title:${title.value} and Description: ${description.value}`);
    axios.post("http://localhost:3000/api/notes",{
        title:title.value,
        description:description.value
    })
    .then(res => {
        console.log(res.data);
        fetchNotes()
    })
  }

  return (
    <div className="main-div app">
        <div className="form_div sidebar">
            <form className="form_box form" onSubmit={handelSubmit}>
                <input name="title" className="input" type="text" placeholder="Enter Title" />
                <input name="description" className="input" type="text" placeholder="Enter description" />
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>

      <div className="Notes_div notes-grid">
        {Notes.map((note, idx) => {
          return (
            <div className="Title_box note-card" key={idx}>
              <h1 className="note-title">Title : {note.title} </h1>
              <h1 className="note-body">Description : {note.description} </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
