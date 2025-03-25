const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../database/database');

class Note {
  /**
   * Create a new note
   * @param {Object} noteData - The note data
   * @returns {Promise} - A promise that resolves with the created note
   */
  static async create(noteData) {
    const id = uuidv4();
    const { title, content, type, filePath } = noteData;
    
    const sql = `
      INSERT INTO notes (id, title, content, type, file_path)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await run(sql, [id, title, content, type, filePath]);
    return this.getById(id);
  }
  
  /**
   * Get a note by ID
   * @param {string} id - The note ID
   * @returns {Promise} - A promise that resolves with the note
   */
  static async getById(id) {
    const sql = `SELECT * FROM notes WHERE id = ?`;
    return get(sql, [id]);
  }
  
  /**
   * Get all notes
   * @returns {Promise} - A promise that resolves with all notes
   */
  static async getAll() {
    const sql = `SELECT * FROM notes ORDER BY updated_at DESC`;
    return all(sql);
  }
  
  /**
   * Update a note
   * @param {string} id - The note ID
   * @param {Object} noteData - The updated note data
   * @returns {Promise} - A promise that resolves with the updated note
   */
  static async update(id, noteData) {
    const { title, content } = noteData;
    
    const sql = `
      UPDATE notes
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await run(sql, [title, content, id]);
    return this.getById(id);
  }
  
  /**
   * Delete a note
   * @param {string} id - The note ID
   * @returns {Promise} - A promise that resolves with the delete result
   */
  static async delete(id) {
    const sql = `DELETE FROM notes WHERE id = ?`;
    return run(sql, [id]);
  }
  
  /**
   * Get notes by type
   * @param {string} type - The note type (text, audio, image)
   * @returns {Promise} - A promise that resolves with notes of the specified type
   */
  static async getByType(type) {
    const sql = `SELECT * FROM notes WHERE type = ? ORDER BY updated_at DESC`;
    return all(sql, [type]);
  }
}

module.exports = Note; 