import { useState } from "react";
// import noteService from '../services/notes'

export default function NoteForm({
  createNote
}) {
  const [newNote, setNewNote] = useState('');

  const addNote = async (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('');
  }

  
  // const handleNoteChange = (event) => {
  //   console.log(event.target.value);
  //   setNewNote(event.target.value);
  // };
  return (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={event => setNewNote(event.target.value)} />
      <button type="submit">save</button>
    </form>
  )
}
