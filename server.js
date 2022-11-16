const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;



// server
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// middleware
app.use(express.static("./public"));


// get
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", function(err, data) {
        res.json(JSON.parse(data));
    })
});


// post
app.post("/api/notes", (req, res) => {
    const {title, text} = req.body;
    if (!title || !text){
        res.status(400).json({error: "Required field empty."})
        return
    }
    const nextNote = {
        ...req.body,
    id:Math.floor(Math.random() * 2000)
    };
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", function(err, data) {
        if (err) {
            res.status(500).json(err)
            return
        }
        const noteData = JSON.parse(data)
        noteData.push(nextNote)
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(noteData), function(err) {
            if (err) {
                res.status(500).json(err);
                return
            }
            res.status(200).json(nextNote);
        });
    });
});


// delete
app.delete("/api/notes/:id", (req, res) => {
    const deleteId = parseInt(req.params.id);
    console.log(deleteId)
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf-8", function(err, data) {
        const notes = [].concat(JSON.parse(data));
        const keepNotes = []
        for (let i = 0; i < notes.length; i++) {
            if(deleteId !== notes[i].id) {
                keepNotes.push(notes[i]);
            }
        }
        console.log(keepNotes)
        fs.writeFile("./db/db.json", JSON.stringify(keepNotes), function(err, data){

            res.send("Note saved.");
        });
    })
});


// html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// listen
app.listen(PORT, () => 
    console.log(`Application running on PORT " + ${PORT}`)
);

