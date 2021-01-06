console.log("Client side javascript file is loaded");
window.onload = function() {
    console.log("loaded")
};

const newbtn = document.getElementById("new");
newbtn.addEventListener("click", openNote);
const noteTitle = document.getElementById("notetitle");
const noteDescription = document.getElementById("notedescription");
const saveNotebtn = document.getElementById("saveNote");
saveNotebtn.addEventListener("click", saveNote)
const deleteNotebtn = document.getElementById("deleteNote");
deleteNotebtn.addEventListener("click", onDeleteNote);
let accordion = document.getElementById("accordion");
accordion.addEventListener("click", deleteNote);
var removeNoteTitle = "";
//To open note modal
function openNote() {
    console.log('clicked')
    $('#exampleModal').modal('show');
}
//To save new Note
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
                        showNotification("Notes Adding Update", "Note Added Successfully!")
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

//To create notes  list
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

//To open delete note alert
function deleteNote(e) {
    if (e.target.classList.contains('fa-trash')) {
        console.log(e.target.offsetParent.children[0].children[0].innerText);
        removeNoteTitle = e.target.offsetParent.children[0].children[0].innerText;
        $('#deleteNoteModal').modal('show');
    }
};
//To Delete Note
function onDeleteNote() {
    fetch(`/removenote?title=${removeNoteTitle}`).then((res) => {
        console.log(typeof(res))
        res.json().then((data) => {
            showNotification("Notes Deleting update", "Notes Deleted Successfully!")
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
};

//To show Notification
function showNotification(message, type) {
    let toast = document.getElementById('toast');
    let toastContent = '<div class="toast-header">' +
        message +
        '</div>' +
        ' <div class="toast-body">' +
        type +
        '</div>'
    toast.innerHTML = toastContent;
    $('.toast').toast({
        animation: false,
        delay: 5000
    });
    $('.toast').toast('show');

}