const express = import("express");
const { notes } = import("./db/db.json");
const fs = import("fs");
const util = import("util");
const path = import("path");
const app = express();
const PORT = process.env.PORT || 3001;
const readFiles = util.promisify(fs.readfile);
const writeFiles = util.promisify(fs.writeFile);


// server
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// middleware
app.use(express.static("./public"));


// get
app.get("/api/notes", (req, res) => {
    fs.readFiles("./db/db.json", "utf8").then((data) => {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});


// post
app.post("/api/notes", (req, res) => {
    const note = req.body;
    fs.readFiles("./db/db.json", "utf8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note)
        return notes
    }).then((notes) => {
        writeFiles("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});


// delete
app.delete("/api/notes/:id", (req, res) => {
    const deleteId = parseInt(req.params.id);
    fs.readFiles("./db/db.json", "utf8").then((data) =>{
        const notes = [].concat(JSON.parse(data));
        const newNotes = []
        for (let i = 0; i < notes.length; i++) {
            if(deleteId !== notes[i].id) {
                newNotes.push(notes[i]);
            }
        }
        return newNotes
    }).then((notes) => {
        fs.writeFiles("./db/db.json", JSON.stringify(notes));
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
app.listen(PORT, () => 
    console.log(`Application running on PORT " + ${PORT}`)
);

