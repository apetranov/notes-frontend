import { useState } from "react";
import noteService from '../services/notes'

export default function NoteForm({
  handleSetNotes,
  getUserByUsername,
  user
}) {
  const [newNote, setNewNote] = useState('');
  const addNote = async (event) => {
      event.preventDefault();
      if (!user) {
        alert("no user");
        return;
      }
      const usr = await getUserByUsername(user.username);
      // console.log("user in add Note: ", usr);
      const noteObject = {
        userId: usr.id,
        content: newNote,
        important: true,
      };
  
      const returnedNote = await noteService.create(noteObject);
      handleSetNotes(returnedNote);
      setNewNote("");
  
      // noteService.create(noteObject).then((returnedNote) => {
      //   setNotes(notes.concat(returnedNote));
      //   setNewNote("");
      // });
      // console.log("button clicked", event.target);
    };
  
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };
  return (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  )
}
