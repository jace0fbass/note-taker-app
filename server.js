const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");
const app = express();
const PORT = 3000;
const readFile = util.promisify(fs.readfile);
const writeFile = util.promisify(fs.writeFile);


// server
app.use(express.json());

// middleware
app.use(express.static("./public"));


// get
app.get("/api/notes", (req, res) => {
    readFile("./db/db.json", "utf8").then((data) => {
        let notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});


// post
app.post("/api/notes", (req, res) => {
    const note = req.body;
    readFile("./db/db.json", "utf8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note)
        return notes
    }).then((notes) => {
        writeFile("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});


// delete
app.delete("/api/note/:id", (req, res) => {
    const deleteId = parseInt(req.params.id);
    readFile("./db/db.json", "utf8").then((data) =>{
        const notes = [].concat(JSON.parse(data));
        const newNotes = []
        for (let i = 0; i < notes.length; i++) {
            if(deleteId !== notes[i].id) {
                newNotes.push(notes[i]);
            }
        }
        return newNotes
    }).then((notes) => {
        writeFile("./db/db.json", JSON.stringify(notes));
        res.send("Note saved.");
    })
});


// html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// listen
app.listen(PORT, () => {
    console.log(`Application running on PORT " + ${PORT}`);
});