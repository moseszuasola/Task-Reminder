document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const noteList = document.getElementById('note-list');

  // Helper function to create a list item representing a note
  function createNoteItem(note) {
    const listItem = document.createElement('div');
      const currentDate = new Date().toISOString().split('T')[0];
    listItem.innerHTML = `
      <div class="note">
        <h3><strong>Client Name:</strong> <span class="client-name">${note.clientName}</span><br></h3>
        <h4><strong>Task Name:</strong> <span class="task-name">${note.taskName}</span><br></h4>
        <a href:"${note.taskLink}" target="_blank" class="task-link">${note.taskLink}</a><br>
        <p class="task-description">${note.taskDescription}</p><br><br>
        <button class="edit-button" data-note-id="${note.id}">Edit</button>
        <button class="delete-button" data-note-id="${note.id}">Delete</button>
        <button class="update-button" data-note-id="${note.id}">Update</button>
      </div>
    `;
    return listItem;
  }

  // Helper function to clear the note form
  function clearNoteForm() {
    noteForm.reset();
  }

  // Helper function to fetch and display notes from the server
  function fetchNotes() {
    // Make a GET request to retrieve the notes from the server
    fetch('/notes')
      .then(response => response.json())
      .then(data => {
        // Clear the existing notes
        noteList.innerHTML = '';

        // Loop through the notes and create elements for each note
        data.forEach(note => {
          const noteId = note.id;
          const clientName = note.clientName;
          const taskName = note.taskName;
          const taskLink = note.taskLink;
          const taskDescription = note.taskDescription;
          const updates = note.updates || []; // Handle cases where updates array is missing

            const currentDate = new Date().toISOString().split('T')[0];
            
            // Create HTML elements for the note
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');

            //Client Name
            const clientNameElement = document.createElement('h3');
            const CNstrongElement = document.createElement('strong');
            CNstrongElement.textContent = 'Client Name: ';
            const CNspanElement = document.createElement('span');
            CNspanElement.classList.add('client-name'); 
            CNspanElement.textContent = clientName;
            
            clientNameElement.appendChild(CNstrongElement);
            clientNameElement.appendChild(CNspanElement);
            
            //task name
            const taskNameElement = document.createElement('h4');
            const TNstrongElement = document.createElement('strong');
            TNstrongElement.textContent = 'Task Name: ';
            const TNspanElement = document.createElement('span');
            TNspanElement.classList.add('task-name');
            TNspanElement.textContent = taskName;
    
            taskNameElement.appendChild(TNstrongElement);
            taskNameElement.appendChild(TNspanElement);

            //task link
            const taskLinkElement = document.createElement('a');
            taskLinkElement.classList.add('task-link');
            taskLinkElement.textContent = taskLink;
            taskLinkElement.href = taskLink;
            taskLinkElement.target = '_blank';
            
            //task description or notes
            const taskDescriptionElement = document.createElement('p');
            taskDescriptionElement.textContent = taskDescription;
            taskDescriptionElement.classList.add('task-description');

          const updateHeading = document.createElement('h4');
          updateHeading.textContent = 'Updates:';

          const updateList = document.createElement('ul');
          updateList.classList.add('update-list');
            updateList.id = noteId;

          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.classList.add('edit-button');
           editButton.setAttribute('data-note-id', noteId);

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('delete-button');
          deleteButton.id = noteId;

          const updateButton = document.createElement('button');
          updateButton.textContent = 'Update';
          updateButton.classList.add('update-button');
          updateButton.id = noteId;

          // Create list items for each update
          updates.forEach(update => {
            const updateItem = document.createElement('li');
            updateItem.textContent = update;
            updateList.appendChild(updateItem);
            
              
          });
            
           
          // Append all elements to the note div
          noteDiv.appendChild(clientNameElement);
          noteDiv.appendChild(taskNameElement);
          noteDiv.appendChild(taskLinkElement);
          noteDiv.appendChild(taskDescriptionElement);
          
          noteDiv.appendChild(updateHeading);
          noteDiv.appendChild(updateList);

          // Append Edit, Delete, and Update buttons
          noteDiv.appendChild(editButton);
          noteDiv.appendChild(deleteButton);
          noteDiv.appendChild(updateButton);

          // Append the note div to the note list section
          noteList.appendChild(noteDiv);
            
            
          // Event listener for edit button
        editButton.addEventListener('click', () => {
            const noteId = editButton.getAttribute('data-note-id');
          const listItem = noteDiv.parentNode; // Get the parent note list item

          // Retrieve the note data from the list item
          const clientName = listItem.querySelector('.client-name').textContent;
          const taskName = listItem.querySelector('.task-name').textContent;
          const taskLink = listItem.querySelector('.task-link').textContent;
          const taskDescription = listItem.querySelector('.task-description').textContent;

          // Pre-fill the form with the note data
          document.getElementById('client-name').value = clientName;
          document.getElementById('task-name').value = taskName;
          document.getElementById('task-link').value = taskLink;
          document.getElementById('task-description').value = taskDescription;

          // Add a hidden input field to store the note ID
          const noteIdInput = document.createElement('input');
          noteIdInput.type = 'hidden';
          noteIdInput.name = 'noteId';
          noteIdInput.value = noteId;
          noteForm.appendChild(noteIdInput);

          // Change the form submit button text to "Update Note"
          const submitButton = document.querySelector('button[type="submit"]');
          submitButton.textContent = 'Update Note';

          // Create a cancel button
          const cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.classList.add('cancel-button');

          // Append the cancel button to the note form
          noteForm.appendChild(cancelButton);

          // Event listener for the cancel button
          cancelButton.addEventListener('click', () => {
            // Clear the form fields
            document.getElementById('client-name').value = '';
            document.getElementById('task-name').value = '';
            document.getElementById('task-link').value = '';
            document.getElementById('task-description').value = '';

            // Remove the note ID input field
            noteForm.removeChild(noteIdInput);

            // Change the form submit button text back to "Add Note"
            submitButton.textContent = 'Add Note';

            // Remove the cancel button
            noteForm.removeChild(cancelButton);
          });
        
        });
            
        // Add event listener for delete button
        updateButton.addEventListener('click', (event) => {
          updateNoteById(noteId, noteDiv);
            // Disable the update button while the update is being entered
            updateButton.disabled = true;
            });
        
                    
        // Add event listener for delete button
        deleteButton.addEventListener('click', (event) => {
          deleteNoteById(noteId, noteDiv);
            });
        
        });
      })
      .catch(error => {
        console.error('Failed to fetch notes:', error);
      });
  }
    
    
    
// Function to delete a note by ID
function deleteNoteById(noteId, noteDiv) {
  // Make a DELETE request to delete the note
  fetch(`/notes/${noteId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        // Note deleted successfully, remove the note div from the DOM
        noteDiv.remove();
      } else {
        console.error('Failed to delete note:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error deleting note:', error);
    });
}

  // Event listener for form submission
  noteForm.addEventListener('submit', event => {
    event.preventDefault();

      
    const clientName = document.getElementById('client-name').value;
    const taskName = document.getElementById('task-name').value;
    const taskLink = document.getElementById('task-link').value;
    const taskDescription = document.getElementById('task-description').value;
  

    const noteIdInput = document.querySelector('input[name="noteId"]');
    let url = '/notes';
    let method = 'POST';

    if (noteIdInput) {
      // If the hidden input field exists, it means we're updating a note
      const noteId = noteIdInput.value;
      url = `/notes/${noteId}`;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName,
        taskName,
        taskLink,
        taskDescription,
      }),
    })
      .then(response => {
        if (response.ok) {
          clearNoteForm();
          fetchNotes();
        } else {
          console.error('Failed to add/update note:', response.statusText);
        }
      })
      .catch(error => console.error('Error adding/updating note:', error))
      .finally(() => {
        // Reset the form and remove the noteId input field
        clearNoteForm();
        if (noteIdInput) {
          noteIdInput.parentNode.removeChild(noteIdInput);
          // Change the form submit button text back to "Add Note"
          const submitButton = document.querySelector('button[type="submit"]');
          submitButton.textContent = 'Add Note';
            $('.cancel-button').remove();
        }
      });
  });

    
        // Update button clicked function
    function updateNoteById(noteId, noteDiv) {
        
        const taskDescriptionElement = noteDiv.querySelector('.task-description');
        const updateList = noteDiv.querySelector('.update-list');

        // Create a <br> element
        const lineBreak = document.createElement('br');

        // Create a <div> element to wrap the input
        const updateDiv = document.createElement('div');
        updateDiv.classList.add('update-div');

        // Create a temporary input box for entering the new update
        const updateInput = document.createElement('input');
        updateInput.type = 'text';
        updateInput.placeholder = 'Enter new update';
        updateInput.id = noteId;

        // Append the input to the update div
        updateDiv.appendChild(updateInput);

        // Append the <br> element and update div to the task description element
        taskDescriptionElement.appendChild(lineBreak);
        taskDescriptionElement.appendChild(updateDiv);

        // Create a button container div
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Create a button to submit the update
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.classList.add('submit-button');

        // Create a button to cancel the update
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('cancel-button');

        // Append the submit and cancel buttons to the button container
        buttonContainer.appendChild(submitButton);
        buttonContainer.appendChild(cancelButton);

        // Append the button container to the task description element
        taskDescriptionElement.appendChild(buttonContainer);

// Event listener for the submit button
submitButton.addEventListener('click', (event) => {
    const newUpdate = updateInput.value;

    if (newUpdate) {
        
        // Create a new list item for the update
        const updateItem = document.createElement('li');
        updateItem.textContent = newUpdate;
        updateList.appendChild(updateItem);

        // Enable the update button
        $('#note-list').find('.update-button').prop('disabled', false);

        //New update from input update
        const updateInput = document.getElementById(noteId);
        const newTextUpdate = updateInput.value;
        
        // Send the array of values to the server
        fetch(`/notes/${noteId}`, {
            method: 'PUT',
            headers: {
            
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            updates: [newTextUpdate],
            }),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to save to database:', response.statusText);
            }
        })
        .catch(error => console.error('Error saving to database:', error));
        }
    
        // Remove the temporary input box and buttons
        taskDescriptionElement.removeChild(lineBreak);
        taskDescriptionElement.removeChild(updateDiv);
        taskDescriptionElement.removeChild(buttonContainer);
    
});

        // Event listener for the cancel button
        cancelButton.addEventListener('click', () => {
          // Remove the temporary input box and buttons
          taskDescriptionElement.removeChild(lineBreak);
          taskDescriptionElement.removeChild(updateDiv);
          taskDescriptionElement.removeChild(buttonContainer);

          // Enable the update button
          $('#note-list').find('.update-button').prop('disabled', false);
        });
    }

  // Fetch and display the initial notes
  fetchNotes();
});
