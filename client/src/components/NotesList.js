import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import { FaFileAlt, FaMicrophone, FaImage, FaTrash, FaEye } from 'react-icons/fa';

const NotesList = () => {
  const { notes, loading, error, fetchNotes, fetchNotesByType, deleteNote } = useContext(NotesContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Initial fetch of all notes is done by the context
  }, []);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      fetchNotes();
    } else {
      fetchNotesByType(filter);
    }
  };
  
  const handleDeleteNote = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      try {
        await deleteNote(id);
      } catch (err) {
        console.error('Error deleting note:', err);
      } finally {
        setIsDeleting(false);
      }
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
  
  const getNoteIcon = (type) => {
    switch (type) {
      case 'text':
        return <FaFileAlt />;
      case 'audio':
        return <FaMicrophone />;
      case 'image':
        return <FaImage />;
      default:
        return <FaFileAlt />;
    }
  };
  
  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }
  
  if (error) {
    return <div className="error-message" style={{ color: 'red' }}>{error}</div>;
  }
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="form-heading">Your Notes</h2>
        <div className="filter-buttons">
          <button
            className={`btn ${activeFilter === 'all' ? '' : 'btn-secondary'}`}
            onClick={() => handleFilterChange('all')}
            style={{ marginRight: '0.5rem' }}
          >
            All
          </button>
          <button
            className={`btn ${activeFilter === 'text' ? '' : 'btn-secondary'}`}
            onClick={() => handleFilterChange('text')}
            style={{ marginRight: '0.5rem' }}
          >
            Text
          </button>
          <button
            className={`btn ${activeFilter === 'audio' ? '' : 'btn-secondary'}`}
            onClick={() => handleFilterChange('audio')}
            style={{ marginRight: '0.5rem' }}
          >
            Audio
          </button>
          <button
            className={`btn ${activeFilter === 'image' ? '' : 'btn-secondary'}`}
            onClick={() => handleFilterChange('image')}
          >
            Image
          </button>
        </div>
      </div>
      
      {notes.length === 0 ? (
        <div className="no-notes" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h3>No notes found</h3>
          <p>Start by creating your first note</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div key={note.id} className="note-card">
              {note.type === 'image' && note.file_path && (
                <img 
                  src={`/${note.file_path}`} 
                  alt={note.title} 
                  className="note-image"
                />
              )}
              
              <div className="note-content">
                <span className={`note-badge ${note.type}`}>
                  {getNoteIcon(note.type)} {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                </span>
                <h3 className="note-title">{note.title}</h3>
                
                {note.type === 'text' && (
                  <p className="note-text">{note.content}</p>
                )}
                
                {note.type === 'audio' && note.file_path && (
                  <audio 
                    src={`/${note.file_path}`} 
                    controls 
                    className="note-audio"
                  />
                )}
                
                <p className="note-date">{formatDate(note.created_at)}</p>
                
                <div className="note-actions">
                  <Link to={`/notes/${note.id}`} className="btn" style={{ padding: '0.4rem 0.8rem' }}>
                    <FaEye /> View
                  </Link>
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="btn btn-danger"
                    disabled={isDeleting}
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList; 