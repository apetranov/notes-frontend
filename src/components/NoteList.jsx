import Note from "./Note";
import LoginForm from "./LoginForm";
import Togglable from "./Togglable";
import NoteForm from "./NoteForm";
import Notification from "./Notification";
import { Link } from "react-router-dom";

const NoteList = ({ 
    notes, showAll, setShowAll, errorMessage, 
    user, handleLogin, username, setUsername,
    password, setPassword, noteFormRef, createNote,
    toggleImportanceOf
}) => {
    const notesToShow = showAll ? notes : notes.filter((note) => note.important);
    return (
        <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          <p>{user.username} logged in</p>
          <button
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            logout
          </button>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
              <NoteForm
              createNote={createNote}
            />
          </Togglable>
          
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </div>
    )
}

export default NoteList;