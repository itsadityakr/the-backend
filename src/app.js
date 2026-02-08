// create server

const express = require("express");

const app = express();

app.use(express.json());

const notes = [];

app.post("/notes", (req, res) => {
    console.log("Note received", req.body);
    notes.push(req.body);
    res.status(201).json({
        message: "Note received",
    });
});

app.get("/notes", (req, res) => {
    res.status(200).json({
        message: "Notes Fetched Successfully",
        notes: notes,
    });
});

app.delete("/notes/:index", (req, res) => {
    const index = req.params.index;
    console.log("Index", index);

    delete notes[index];

    res.status(200).json({
        message: "Notes Deleted Successfully",
        notes: notes,
    });
});

app.patch("/notes/:index", (req, res) => {
    const index = req.params.index;
    console.log("Index", index);

    // notes[index].title = req.body.title;
    notes[index].description = req.body.description;

    res.status(200).json({
        message: "Notes Updated Successfully",
        notes: notes,
    });
});

module.exports = app;
