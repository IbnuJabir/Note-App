import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; 
import Picker from '@emoji-mart/react';

export default function InsideNote() {
  const [notes, setNotes] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [isShowEdit, setShowEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [body, setBody] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/Notes/${id}`)
      .then(res => res.json())
      .then(data => {
        setNotes(data);
      });
  }, [id])
/* ContentEditable div and emoji */
 const handleInput = (e) => {
    setBody(e.target.textContent);
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

/* Show edit */
  const showEdit = () => {
    setShowEdit(true);
    setTitle(notes.title);
    setBody(notes.body);
    setContent(notes.body);
    setAuthor(notes.author);
  };

  const hideEdit = () => {
    setShowEdit(false);
  };/*
    const handleChange = (e) => {
        setBody(e.target.value);
        setContent(e.target.value);
    }*/
const editNote = (e) => {
    e.preventDefault();

    const updatedNote = {
      title,
      body,
      author
    };

    fetch(`http://localhost:3001/Notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedNote)
    })
      .then(response => {
        if (response.ok) {
          console.log(`Note with ID ${id} updated successfully`);
          setNotes(updatedNote);
          setShowEdit(false);
        } else {
          console.error('Failed to update note');
        }
      });
  };


  const deleteNote = () => {
    fetch(`http://localhost:3001/Notes/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log(`Note with ID ${id} deleted successfully`);
          navigate('/AllNotes');
        } else {
          console.error('Failed to delete note');
        }
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
  };
return (
  <>
    {isShowEdit ? (
      <div className="edit-note">
        <form onSubmit={editNote} className="note-form">
          {notes.title && notes.body && (
            <>
              <input
                type="text"
                name="title"
                placeholder={notes.title}
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
            required />
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
              <div className="edit-btns">
                <button onClick={hideEdit}>Cancel</button>
                <button type="submit">Update</button>
              </div>
            </>
          )}
        </form>
      </div>
    ) : (
      <section className="note-detail">
        <div className="note-div">
          <h3>{notes.title}</h3>
          <p className="author"> Written By:<span> {notes.author}</span> 
          </p>
          <p>{notes.body}</p>
        </div>
        <div className="modify-note">
          <button onClick={deleteNote}className="delete-btn">Delete</button>
          <button onClick={showEdit}>Edit</button>
        </div>
      </section>
    )}
  </>
);

}
