import { useState, useEffect } from "react";
import Note from "./components/Note";
import axios from "axios";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import Togglable from "./components/Togglable";
import userService from './services/users'

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  const handleSetNotes = (returnedNote) => {
    setNotes(notes.concat(returnedNote));
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      console.log("user: ", user);
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 500);
    }
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        // alert(`the note '${note.content}' was already deleted from server`)
        setErrorMessage(
          `Note '${note.content}' was already removed from server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // useEffect(() => {
  //   const getAllUsers = async () => {
  //     const users = await userService.getAll();
  //     console.log("users:",users);
  //     return users;
  //   }
  //   const getByUsername = async () => {
  //     const user = await userService.getByUsername("lex");
  //     console.log("user:", user);
  //     return user;
  //   }
  //   getAllUsers();
  //   getByUsername();
  // })

  const createNote = async (note) => {
      // event.preventDefault();
      if (!user) {
        alert("no user");
        return;
      }
      const usr = await getUserByUsername(user.username);
      // console.log("user in add Note: ", usr);
      const noteObject = {
        userId: usr.id,
        content: note.content,
        important: note.important,
      };
  
      const returnedNote = await noteService.create(noteObject);
      setNotes(notes.concat(returnedNote));
      setNewNote("");
  
      // noteService.create(noteObject).then((returnedNote) => {
      //   setNotes(notes.concat(returnedNote));
      //   setNewNote("");
      // });
      // console.log("button clicked", event.target);
    };
  

  useEffect(() => {

    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  if (!notes) return null;
  console.log("render", notes.length, "notes");

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  const getUserByUsername = async (username) => {
    const user = await userService.getByUsername(username);
    return user;
  }
  

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };
  

  // const handleLogin = (event) => {
  //   event.preventDefault();
  //   console.log('logging in with', username, password);
  // }

  // const loginForm = () => (
  //   <form onSubmit={handleLogin}>
  //     <div>
  //       <label>
  //         username
  //         <input
  //           type="text"
  //           value={username}
  //           onChange={({ target }) => setUsername(target.value)}
  //         />
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         password
  //         <input
  //           type="text"
  //           value={password}
  //           onChange={({ target }) => setPassword(target.value)}
  //         />
  //       </label>
  //     </div>
  //     <button type="submit">login</button>
  //   </form>
  // )

  // const noteForm = () => (
  //   <form onSubmit={addNote}>
  //     <input value={newNote} onChange={handleNoteChange} />
  //     <button type="submit">save</button>
  //   </form>
  // )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {/* 
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input 
              type="text" 
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input 
              type="password" 
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form> */}

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
          <p>{user.username} loggen in</p>
          <button
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            logout
          </button>
          <Togglable buttonLabel="new note">
              <NoteForm
              // addNote={addNote}
              // newNote={newNote}
              // // handleNoteChange={handleNoteChange}
              // handleSetNotes={handleSetNotes}
              // getUserByUsername={getUserByUsername}
              // user={user}
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
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      {/* <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form> */}

      <Footer />
    </div>
  );
};

export default App;
