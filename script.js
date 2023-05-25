// Selecting elements from the DOM
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");
const addBtn = popupBox.querySelector("button");

// Array of months
const months = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

// Retrieve notes from localStorage or initialize an empty array
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Variable to track whether an update operation is in progress
let isUpdate = false;
let updateId;

// Event listener for "Add Note" button click
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) {
    titleTag.focus();
  }
});

// Event listener for closing the popup
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// Function to display notes
function showNotes() {
  if (!notes) return;

  // Remove existing note elements
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // Loop through each note and create corresponding HTML elements
  notes.forEach((note, id) => {
    // Replace line breaks in description with <br/> tags
    let filterDesc = note.description.replaceAll("\n", "<br/>");

    // Extract date components
    let currentDate = new Date(note.timestamp);
    let month = months[currentDate.getMonth()];
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    let hour = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    // Format the timestamp string
    let timestamp = `${month} ${day}, ${year} ${hour}:${minutes.toString().padStart(2, "0")}`;

    // Create the HTML for a single note
    let liTag = `<li class="note">
                    <div class="details">
                        <p>${note.title}</p>
                        <span>${filterDesc}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${timestamp}</span>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="menu">
                                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </div>
                </li>`;

    // Insert the note HTML after the "Add Note" box
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Call the showNotes function to display existing notes
showNotes();

// Function to show the menu for a note
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Function to delete a note
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Function to update a note
function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll("<br/>", "\r\n");
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

// Event listener for "Add Note" button click
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title = titleTag.value.trim();
  let description = descTag.value.trim();
  if (title || description) {
    let currentDate = new Date();
    let noteInfo = {
      title,
      description,
      timestamp: currentDate.getTime(),
    };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});