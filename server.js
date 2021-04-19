//constants required
var notesArray = require("./db/db.json")
const express = require('express')
const path = require('path');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');


// sets up express apż
const app = express()
const PORT = process.env.PORT || 3000;

//sets up data parsing in app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// HTML requests 
app.use(express.static("app/public"))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'app/public/index.html')));
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/public/notes.html'));
});

// API requests 
app.get('/api/notes', (req, res) => res.json(notesArray));

app.post('/api/notes', (req, res) => {
        var newNote = req.body
        newNote.id = uuidv4();
        notesArray.push(newNote)
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
            err ? console.log (err) : console.log('Successfully updated!');
        })
    res.json(notesArray)
})

app.delete('/api/notes/:id', (req, res) => {
    for (let i = 0; i < notesArray.length; i++) {
        const element = notesArray[i];
        if (element.id === req.params.id) {
            notesArray.splice(i,1);
        }
    }
    fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
        err ? console.log (err) : console.log('Successfully updated!');
        })
        res.json('./db/db.json')
    
})

app.listen(PORT, function () {
    console.log("app is listening on port:" + PORT)
})