const express = require('express');
const fs = require('fs');
const AsyncLock = require('async-lock');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let notes = [];
const lock = new AsyncLock();

// Helper function to save notes to a file
function saveNotesToFile(callback) {
  lock.acquire('notesLock', (done) => {
    fs.writeFile('notes.json', JSON.stringify(notes), (err) => {
      done();
      callback(err);
    });
  });
}

// Read notes from file on server startup
fs.readFile('notes.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read notes file:', err);
  } else {
    notes = JSON.parse(data);
  }
});

// Generate a unique ID for notes
function generateNoteId() {
  return Date.now().toString();
}

// GET endpoint to retrieve all notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// POST endpoint to create a new note
app.post('/notes', (req, res) => {
  const { clientName, taskName, taskLink, taskDescription } = req.body;
  const newNote = {
    id: generateNoteId(),
    clientName,
    taskName,
    taskLink,
    taskDescription,
    updates: [],
  };

  notes.push(newNote);

  saveNotesToFile((err) => {
    if (err) {
      console.error('Failed to save notes:', err);
      res.sendStatus(500);
    } else {
      res.status(201).json(newNote);
    }
  });
});


// PUT endpoint to update a note
app.put('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  const { clientName, taskName, taskLink, taskDescription } = req.body;
  const currentDate = new Date().toISOString().split('T')[0];
  const note = notes.find((note) => note.id === noteId);

  if (note) {
    note.clientName = clientName;
    note.taskName = taskName;
    note.taskLink = taskLink;
    note.taskDescription = taskDescription;

    // Create a new update entry
    const updatedText = `${currentDate}: ${req.body.update}`;
    note.updates.push(updatedText);

    saveNotesToFile((err) => {
      if (err) {
        console.error('Failed to save notes:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(404);
  }
});


// DELETE endpoint to delete a note
app.delete('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  const index = notes.findIndex((note) => note.id === noteId);

  if (index !== -1) {
    notes.splice(index, 1);

    saveNotesToFile((err) => {
      if (err) {
        console.error('Failed to save notes:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(404);
  }
});

// POST endpoint to save updates to a note
app.post('/notes/:noteId/updates', (req, res) => {
  const { noteId } = req.params;
  const { updatesArray } = req.body;
  const note = notes.find((note) => note.id === noteId);

  if (note) {
    // Initialize updates array if it doesn't exist
    note.updates = note.updates || [];

    // Append the updates to the note's updates array
    note.updates.push(...updatesArray);

    saveNotesToFile((err) => {
      if (err) {
        console.error('Failed to save notes:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(404);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
