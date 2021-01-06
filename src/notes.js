const fs = require('fs');
const chalk = require('chalk');

//To add new note
const addNote = (title, body, noteID, callback) => {
    const notes = loadNotes();
    duplicateNote = notes.find((note) => note.title === title)
    if (!duplicateNote) {
        notes.push({
            title: title,
            body: body,
            id: noteID
        })
        saveNotes(notes);
        console.log(chalk.green.inverse("New note added!"))
        callback(undefined, "Note added successfully");
        return false;
    } else {
        console.log(chalk.red.inverse("Note Title already taken!"));
        callback(duplicateNote, undefined);
        return false;
    }
}

//To save notes into notes.json file
const saveNotes = (notes) => {
        fs.writeFileSync('./src/notes.json', JSON.stringify(notes));
    }
    //To load notes from notes.json file
const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('./src/notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON)
    } catch (e) {
        return [];
    }
}

//To remove note
const removeNote = (title, callback) => {
    const notes = loadNotes();
    const notesToKeep = notes.filter((note) => note.title !== title);
    if (notes.length > notesToKeep.length) {
        console.log(chalk.green.inverse('Note removed!'))
        saveNotes(notesToKeep)
        callback(undefined, "note removed successfully");
    } else {
        callback("Note does not exist", undefined);
        console.log(chalk.red.inverse('No note found!'))
    }
}

//To list out all notes
const listNotes = () => {
    const notes = loadNotes();
    console.log(chalk.blueBright.inverse('Your notes..'))
    notes.forEach(note => {
        console.log(note.title)
    });
}

//To read note
const readNote = (title) => {
    const notes = loadNotes();
    const requiredNote = notes.find((note) => note.title === title);
    if (requiredNote) {
        console.log(chalk.green.inverse(requiredNote.title));
        console.log(requiredNote.body)
    } else {
        console.log(chalk.red.inverse('No Note found with Name ' + title))
    }
}

//Exporting all functions
module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote,
    loadNotes: loadNotes
}