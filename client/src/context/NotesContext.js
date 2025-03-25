import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes by type
  const fetchNotesByType = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/notes/type/${type}`);
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch ${type} notes`);
      console.error(`Error fetching ${type} notes:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Create a text note
  const createTextNote = async (noteData) => {
    try {
      const response = await axios.post('/api/notes/text', noteData);
      setNotes([response.data, ...notes]);
      return response.data;
    } catch (err) {
      setError('Failed to create text note');
      console.error('Error creating text note:', err);
      throw err;
    }
  };

  // Create an audio note
  const createAudioNote = async (title, audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('audio', audioBlob);

      const response = await axios.post('/api/notes/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNotes([response.data, ...notes]);
      return response.data;
    } catch (err) {
      setError('Failed to create audio note');
      console.error('Error creating audio note:', err);
      throw err;
    }
  };

  // Create an image note
  const createImageNote = async (title, content, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (content) formData.append('content', content);
      formData.append('image', imageFile);

      const response = await axios.post('/api/notes/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNotes([response.data, ...notes]);
      return response.data;
    } catch (err) {
      setError('Failed to create image note');
      console.error('Error creating image note:', err);
      throw err;
    }
  };

  // Update a note
  const updateNote = async (id, noteData) => {
    try {
      const response = await axios.put(`/api/notes/${id}`, noteData);
      setNotes(notes.map(note => note.id === id ? response.data : note));
      return response.data;
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      throw err;
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  // Fetch a note by ID
  const getNoteById = async (id) => {
    try {
      const response = await axios.get(`/api/notes/${id}`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch note');
      console.error('Error fetching note:', err);
      throw err;
    }
  };

  // Load notes when component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        fetchNotes,
        fetchNotesByType,
        createTextNote,
        createAudioNote,
        createImageNote,
        updateNote,
        deleteNote,
        getNoteById
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}; 