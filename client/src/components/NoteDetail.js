import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import { FaArrowLeft, FaTrash, FaEdit, FaSave } from 'react-icons/fa';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNoteById, deleteNote, updateNote } = useContext(NotesContext);
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteData = await getNoteById(id);
        setNote(noteData);
        setEditedTitle(noteData.title);
        setEditedContent(noteData.content || '');
        setError('');
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [id, getNoteById]);
  
  const handleDeleteNote = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        navigate('/notes');
      } catch (err) {
        setError('Failed to delete note');
      }
    }
  };
  
  const handleSaveChanges = async () => {
    if (!editedTitle.trim()) {
      setError('Title is required');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const updatedNote = await updateNote(id, {
        title: editedTitle,
        content: editedContent
      });
      
      setNote(updatedNote);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return <div className="loading">Loading note...</div>;
  }
  
  if (error) {
    return <div className="error-message" style={{ color: 'red' }}>{error}</div>;
  }
  
  if (!note) {
    return <div className="not-found">Note not found</div>;
  }
  
  return (
    <div className="note-detail">
      <div className="note-detail-header">
        <Link to="/notes" className="btn btn-secondary">
          <FaArrowLeft /> Back to Notes
        </Link>
        
        <div>
          {isEditing ? (
            <>
              <button
                className="btn"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
                style={{ marginRight: '0.5rem' }}
              >
                <FaSave /> {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(note.title);
                  setEditedContent(note.content || '');
                  setError('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {(note.type === 'text') && (
                <button
                  className="btn"
                  onClick={() => setIsEditing(true)}
                  style={{ marginRight: '0.5rem' }}
                >
                  <FaEdit /> Edit
                </button>
              )}
              <button
                className="btn btn-danger"
                onClick={handleDeleteNote}
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="form-control"
              rows="10"
            ></textarea>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '2rem' }}>
            <h1 className="note-detail-title">{note.title}</h1>
            <span style={{ color: '#777' }}>Created: {formatDate(note.created_at)}</span>
          </div>
          
          {note.type === 'image' && note.file_path && (
            <img
              src={`/${note.file_path}`}
              alt={note.title}
              className="note-detail-image"
            />
          )}
          
          {note.type === 'audio' && note.file_path && (
            <audio
              src={`/${note.file_path}`}
              controls
              style={{ width: '100%', marginTop: '1rem' }}
            />
          )}
          
          {note.content && (
            <div className="note-detail-content">
              {note.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteDetail; 