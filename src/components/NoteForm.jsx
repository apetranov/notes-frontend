import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import noteService from '../services/notes'

export default function NoteForm({
  createNote
}) {
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  const addNote = async (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true
    })

    navigate('/notes');
    setNewNote('');
  };
  return (
    <form onSubmit={addNote}>
      <input 
        value={newNote} 
        onChange={event => setNewNote(event.target.value)} 
        placeholder="write note content here"
      />
      <button type="submit">save</button>
    </form>
  )
}
