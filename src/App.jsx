import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import axios from "axios";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import Togglable from "./components/Togglable";
import Home from "./components/Home";
import userService from './services/users'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom';

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);

  const noteFormRef = useRef();

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={createNote} />
    </Togglable>
  )

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
      
      // noteFormRef.current.toggleVisibility();
      const returnedNote = await noteService.create(noteObject);
      setNotes(notes.concat(returnedNote));
      setNewNote("");
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

  const padding = {
    padding: 5
  }

  return (
    
    <div>
      <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div>

      <Routes>
        <Route path="/notes/:id" element={
          <Note notes={notes} toggleImportanceOf={toggleImportanceOf} />
        } />
        <Route path="/notes" element={
          <NoteList notes={notes}
            showAll={showAll}
            setShowAll={setShowAll}
            errorMessage={errorMessage}
            user={user}
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            noteFormRef={noteFormRef}
            createNote={createNote}
            toggleImportanceOf={toggleImportanceOf}
          />
        } />
        <Route path="/create" element={
          <NoteForm createNote={createNote} />
        } />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
    <Footer />
    </div>
  );
};

export default App;
