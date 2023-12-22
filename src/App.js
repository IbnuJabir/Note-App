import { useState} from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';
import AllNotes from './pages/AllNotes';
import NoPage from './pages/NoPage';

function App() {
  const [slide, setSlide] = useState(true);

  function handleNote() {
    setSlide(!slide);
  }
  function handleNote1() {
     setSlide(false);
   }

  return (
    <div className="App">
     
        <header className="App-header">
          <section className="nav-links">
            <Link to="/AllNotes" className="site-title" onClick={handleNote}>
              <h1>
                <i className="fa fa-bars" aria-hidden="true"></i>
              </h1>
            </Link>
            <Link to="/AllNotes/AddNote" className="add-note" onClick={handleNote1}>
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </Link>
          </section>
        </header>
                <Routes> 
                    <Route  path="/AllNotes/*" element={<AllNotes slide={slide} handleNote1={handleNote1}/>}/>
                    <Route path="*" element={<NoPage />}/>
                </Routes>
    </div>
  );
}

export default App;