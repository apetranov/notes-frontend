import { useParams } from "react-router-dom";

const Note = ({ notes, toggleImportanceOf }) => {
  const id = useParams().id;
  const note = notes.find(n => n.id === id);

  const label = note.important ? 
  'make not important' : 'make important'
  
  return (
    <li className='note'>
      <span>{note.content}</span>
      <button onClick={() => toggleImportanceOf(id)}>{label}</button>
    </li>
  )
}

export default Note