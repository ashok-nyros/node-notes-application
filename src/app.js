const path = require('path');
const express = require('express');
const hbs = require('hbs');
const notes = require("./notes");


const app = express();
const port = process.env.PORT || 3000

let allNotes = [];

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))
console.log(notes.loadNotes())
app.get('', (req, res) => {
    res.render('index', {
        title: 'Notes App',
        name: 'Ashok',
        allNotes: notes.loadNotes(),
    })
})

app.get("/addnote", (req, res) => {
    if (!req.query.title) {
        return res.send({
            error: "please provide note title",
        });
    }
    if (!req.query.body) {
        return res.send({
            error: "please provide body",
        });
    } else {
        notes.addNote(req.query.title, req.query.body, req.query.noteID, (err) => {
            if (err) {
                return res.send({
                    error: "Note exists! - please choose another",
                });
            } else {
                console.log("reached else");
                allNotes = notes.loadNotes();
                console.log(JSON.stringify(allNotes));
                return res.send(JSON.stringify(allNotes));
            }
        });
    }
});

app.get("/get", (req, res) => {
    allNotes = notes.loadNotes();
    return res.send((JSON.stringify(allNotes)));
})

app.get("/removenote", (req, res) => {
    if (!req.query.title) {
        return res.send({
            error: "please provide note title",
        });
    } else {
        notes.removeNote(req.query.title, (err) => {
            if (err) {
                return res.send({
                    error: "Note does not exist",
                });
            } else {
                allNotes = notes.loadNotes();
                console.log(JSON.stringify(allNotes));
                return res.send(JSON.stringify(allNotes));
            }
        });
    }
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
        createdBy: "Ashok",
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "About",
        createdBy: "Ashok",
    });
})


app.listen(port, () => {
    console.log('server is up on port 3000.')
})