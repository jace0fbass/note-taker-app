const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");
const app = express();
const PORT = 5500;

// read/write


// server


// middleware
app.use(express.static("./public"));


// get
app.get("/api/notes", function (req, res) {
    
    res.json(notes);
});


// post
app.post("/api/notes", function (req, res) {

    res.json(note);
});


// delete
app.delete("/api/note/:id", function (req, res) {

    res.send();
});


// html


// listen
