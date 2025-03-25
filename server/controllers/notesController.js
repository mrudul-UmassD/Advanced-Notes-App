const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');

/**
 * Get all notes
 */
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.getAll();
    res.json(notes);
  } catch (error) {
    console.error('Error getting all notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a note by ID
 */
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.getById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Error getting note by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new text note
 */
exports.createTextNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const noteData = {
      title,
      content,
      type: 'text',
      filePath: null
    };
    
    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating text note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new audio note
 */
exports.createAudioNote = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Audio file is required' });
    }
    
    const noteData = {
      title,
      content: null,
      type: 'audio',
      filePath: req.file.path.replace(/\\/g, '/')
    };
    
    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating audio note:', error);
    // Remove uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new image note
 */
exports.createImageNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    
    const noteData = {
      title,
      content,
      type: 'image',
      filePath: req.file.path.replace(/\\/g, '/')
    };
    
    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating image note:', error);
    // Remove uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a note
 */
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;
    
    const existingNote = await Note.getById(noteId);
    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    const updateData = {
      title: title || existingNote.title,
      content: content !== undefined ? content : existingNote.content
    };
    
    const updatedNote = await Note.update(noteId, updateData);
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a note
 */
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    
    const note = await Note.getById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Delete file if note has one
    if (note.file_path) {
      const filePath = path.join(__dirname, '..', note.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Note.delete(noteId);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get notes by type
 */
exports.getNotesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['text', 'audio', 'image'].includes(type)) {
      return res.status(400).json({ message: 'Invalid note type' });
    }
    
    const notes = await Note.getByType(type);
    res.json(notes);
  } catch (error) {
    console.error('Error getting notes by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 