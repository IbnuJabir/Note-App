import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; 
import Picker from '@emoji-mart/react';
// import data from '@emoji-mart/data';

export default function AddNote() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [notes, setNotes] = useState({});
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  
/*
  const handleSelection = () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const start = range.startOffset;
  const end = range.endOffset;

  };*/

  const handleInput = (e) => {
    setBody(e.target.textContent);
  };

  const handleSelect = (emoji) => {
  const selectedEmoji = emoji.native;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const currentPos = range.startOffset;
  const endPos = range.endOffset;

  const textBeforeCursor = body.substring(0, currentPos);
  const textAfterCursor = body.substring(endPos);

  const newContent = textBeforeCursor + selectedEmoji + textAfterCursor;
  setContent(newContent);
  setBody(newContent);

  setShowEmojiPicker(false);
};


  useEffect(() => {
    fetch('http://localhost:3001/Notes')
      .then((res) => res.json())
      .then((data) => {
        setNotes(data);
      });
 
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    const newNote = { title, author, body };

    fetch('http://localhost:3001/Notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes([newNote, ...notes]);
        navigate('/AllNotes');
      })
      .catch((error) => {
        console.error('Error adding note:', error);
      });
  };
  
  const theme = 'snow';

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
    ],
  };

  const placeholder = 'Content...';

  const formats = ['bold', 'italic', 'underline'];

  const { quillRef } = useQuill({ theme, modules, formats, placeholder });

  return (
    <div className="Add-note-container">
      <header>
        <h1 className="note-header">Add a Note</h1>
      </header>
      <div className="Add-note-input">
        <form onSubmit={addNote} className="note-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <section className="div-emoji-container">
        <div ref={quillRef} 
        contentEditable
        className="content-editable" 
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        />
            <i class="fa fa-smile-o" aria-hidden="true" onClick={() => setShowEmojiPicker(!showEmojiPicker)}></i>
            </section>
          <div className="emoji-container">
            {showEmojiPicker && (
          <div className="emoji">
            <Picker
              set="apple"
              previewPosition="none"
              showPreview={true}
              showSkinTones={true}
              onEmojiSelect={handleSelect}
            />
          </div>
        )}
          </div>
          <button type="submit">Add Note</button>
        </form>
      </div>
    </div>
  );
}
