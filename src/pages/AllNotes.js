import { Link, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AddNote from './AddNote';
import InsideNote from './InsideNote';
export default function AllNotes({slide, handleNote1}) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {

    fetch('http://localhost:3001/Notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.reverse());
      });
  }, [notes]);
/*  a fuction to truncate and return the shorten text to 50 characterfs.
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    } else {
      return text;
    }
  }*/
return (
  <>
    {slide ? (
      <>
        <Routes>
          <Route path="/AddNote" element={<AddNote />}> </Route>
          <Route path='/InsideNote/:id' element={<InsideNote />}/>
        </Routes>
        <div className={`all-notes ${slide ? 'slide-in' : ''}`}>
          {notes.map((note) => (
            <div key={note.id} className="note-div-all">
              <Link to={`/AllNotes/InsideNote/${note.id}`} className="site-title" onClick={handleNote1}>
                <h3>{note.title}</h3>
                <p className="author-all">
                  Written By: <span>{note.author}</span>
                </p>
              </Link>
            </div>
          ))}
        </div>
      </>
    ) : (
      <Routes>
        <Route path='/' element={<h1 className='no-note'>Select a Note You Want!</h1>} />
        <Route path="/AddNote" element={<AddNote />} />
        <Route path='/InsideNote/:id' element={<InsideNote handleNote1={handleNote1} />}/>
      </Routes>
    )}
  </>
);
}