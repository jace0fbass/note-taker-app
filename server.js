const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");
const app = express();
const PORT = 5500;
const readFile = util.promisify(fs.readfile);
const writeFile = util.promisify(fs.writeFile);


// server


// middleware
app.use(express.static("./public"));


// get
app.get("/api/notes", function(req, res) {
    readFile("./db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});


// post
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFile("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note)
        return notes
    }).then(function(notes) {
        writeFile("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});


// delete
app.delete("/api/note/:id", function(req, res) {
    const deleteId = parseInt(req.params.id);
    readFile("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotes = []
        for (let i = 0; i < notes.length; i++) {
            if(deleteId !== notes[i].id) {
                newNotes.push(notes[i])
            }
        }
        return newNotes
    }).then(function(notes) {
        writeFile("./db/db.json", JSON.stringify(notes))
        res.send("Note saved.");
    })
});


// html


// listen
