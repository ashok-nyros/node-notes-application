console.log("Client side javascript file is loaded");
window.onload = function() {
    listNotes();
};

function listNotes() {
    console.log('list called')
    fetch(`/get`).then((res) => {
        console.log(res)
        res.json().then((data) => {
            if (data.error) {
                console.log("error is" + data.error);
                alert(data.error);
                return false;
            } else {
                console.log(data);
                this.allNotes = data;
                console.log(allNotes)
            }
        });
    });
}

const newbtn = document.getElementById("new");
newbtn.addEventListener("click", openNote);

const noteTitle = document.getElementById("notetitle");
const noteDescription = document.getElementById("notedescription");
const saveNotebtn = document.getElementById("saveNote");
saveNotebtn.addEventListener("click", saveNote)
let accordion = document.getElementById("accordion");
// ul.addEventListener("click", deleteNote);
accordion.addEventListener("click", deleteNote);
// var noteContent = "";

function openNote() {
    console.log('clicked')
    $('#exampleModal').modal('show');
}

function saveNote(e) {
    e.preventDefault();
    if (!noteTitle.value) {
        alert("enter note title");
        notetitle.focus();
        return false;
    } else if (!noteDescription.value) {
        alert("enter some note description please");
        notedescription.focus();
        return false;
    } else {
        let id = noteTitle.value.split(" ").join("")
        fetch(`/addnote?title=${noteTitle.value}&body=${noteDescription.value}&noteID=${id}`).then(
            (res) => {
                console.log(res);
                res.json().then((data) => {
                    if (data.error) {
                        console.log("error is" + data.error);
                        alert(data.error);
                        return false;
                    } else {
                        console.log(data);
                        createList(data);
                    }
                });
            }
        );
        notetitle.value = "";
        notedescription.value = "";
        $('#exampleModal').modal('hide');
    }
}


function createList(data) {
    let noteContent = "";
    data.forEach(note => {
        noteContent += '<div class="card" id="card">' +
            '<div class="card-header">' +
            '<a class="card-link" data-toggle="collapse" data-parent="#accordion" href="#collapse_' + note.id + '">' +
            note.title +
            '</a>' +
            '<div class="btns" style="float: right;">' +
            '<i class="fa fa-trash" style="cursor: pointer;"></i>' +
            '</div>' +
            '</div>' +
            '<div id="collapse_' + note.id + '" class="collapse">' +
            '<div class="card-body">' +
            note.body +
            '</div>' +
            '</div>'
    });
    accordion.innerHTML = noteContent;

}

function deleteNote(e) {
    if (e.target.classList.contains('fa-trash')) {
        console.log(e.target.offsetParent.children[0].children[0].innerText);
        removeNoteTitle = e.target.offsetParent.children[0].children[0].innerText;
        fetch(`/removenote?title=${removeNoteTitle}`).then(
            (res) => {
                console.log(typeof(res))
                    // console.log(res.json());
                res.json().then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        createList(data);
                    }
                    if (data.length === 0) {
                        console.log("it is empty");
                        accordion.innerHTML =
                            ` <div class="no-notes">
                                <p>No Notes Available.</p>
                              </div>`
                    }

                });
            });
    }
}