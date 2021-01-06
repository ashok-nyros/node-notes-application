console.log("Client side javascript file is loaded");
window.onload = function() {
    console.log("loaded")
};
//getting inputs
const newbtn = document.getElementById("new");
newbtn.addEventListener("click", openNote);
const noteTitle = document.getElementById("notetitle");
noteTitle.addEventListener("input", limitTitle);
const noteDescription = document.getElementById("notedescription");
noteDescription.addEventListener("input", limitBody)
const saveNotebtn = document.getElementById("saveNote");
saveNotebtn.addEventListener("click", saveNote)
const deleteNotebtn = document.getElementById("deleteNote");
deleteNotebtn.addEventListener("click", onDeleteNote);
let accordion = document.getElementById("accordion");
accordion.addEventListener("click", deleteNote);
const titlelimit = document.getElementById("title-limit");
const bodylimit = document.getElementById("body-limit");
const notexterror = document.getElementById("no-text-error");
var removeNoteTitle = "";

//To open note modal
function openNote() {
    console.log('clicked')
    notetitle.value = "";
    notedescription.value = "";
    titlelimit.innerText = "";
    bodylimit.innerText = "";
    notexterror.innerText = "";
    $('#exampleModal').modal('show');
}
//To save new Note
function saveNote(e) {
    e.preventDefault();
    if (!noteTitle.value) {
        // alert("enter note title");
        notexterror.innerText = "Enter Note title to continue"
        notetitle.focus();
        return false;
    } else if (noteTitle.value.includes('#') || noteTitle.value.includes('&')) {
        // alert("enter note title");
        notexterror.innerText = "Note Title should not contain # or &"
        notetitle.focus();
        return false;
    } else if (!noteDescription.value) {
        // alert("enter some note description please");
        notexterror.innerText = "Enter Note description to continue"
        notedescription.focus();
        return false;
    } else if (noteDescription.value.includes('#') || noteDescription.value.includes('&')) {
        // alert("enter some note description please");
        notexterror.innerText = "Note Description should not contain # or &"
        notedescription.focus();
        return false;
    } else {
        const noteTitleValue = noteTitle.value.trim();
        let id = noteTitle.value.replace(/\W/g, '_');
        fetch(`/addnote?title=${noteTitleValue}&body=${noteDescription.value}&noteID=${id}`).then(
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
                        notetitle.value = "";
                        notedescription.value = "";
                        $('#exampleModal').modal('hide');
                    }
                });
            }
        );
    }
}

//To create notes  list
function createList(data) {
    let noteContent = "";
    data.forEach(note => {
        noteContent += '<div class="card" id="card">' +
            '<div class="card-header">' +
            '<a class="card-link" data-toggle="collapse"  href="#collapse_' + note.id + '">' +
            note.title +
            '</a>' +
            '<div class="btns" style="float: right;">' +
            '<i class="fa fa-trash" style="cursor: pointer;"></i>' +
            '</div>' +
            '</div>' +
            '<div id="collapse_' + note.id + '" class="collapse" data-parent="#accordion">' +
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
        console.log(removeNoteTitle)
        $('#deleteNoteModal').modal('show');
    }
};
//To Delete Note
function onDeleteNote() {
    fetch(`/removenote?title=${removeNoteTitle}`).then((res) => {
        console.log(typeof(res))
        res.json().then((data) => {
            console.log(data);
            if (data.error) {
                console.log("error is" + data.error);
                alert(data.error);
                return false;
            } else {
                showNotification("Notes Deleting update", "Notes Deleted Successfully!")
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
        delay: 1000
    });
    $('.toast').toast('show');

}
// To Limit Note title
function limitTitle(e) {
    bodylimit.innerText = "";
    let maxCharacters = 25;
    console.log(e.target.value)
    if (e.target.value.length <= maxCharacters) {
        titlelimit.innerText = (maxCharacters - (e.target.value.length)) + " characters left"
    }
}
// To limit note body
function limitBody(e) {
    titlelimit.innerText = "";
    let maxCharacters = 250;
    console.log(e.target.value)
    if (e.target.value.length <= maxCharacters) {
        bodylimit.innerText = (maxCharacters - (e.target.value.length)) + " characters left"
    }
}