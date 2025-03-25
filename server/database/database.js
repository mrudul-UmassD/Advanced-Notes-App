const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'notes.db');
const db = new sqlite3.Database(dbPath);

/**
 * Initialize the database by creating required tables if they don't exist
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create notes table
      db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT,
          type TEXT NOT NULL,
          file_path TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating notes table:', err);
          reject(err);
          return;
        }
        
        console.log('Notes table created or already exists');
        resolve();
      });
    });
  });
}

/**
 * Run a query with parameters
 * @param {string} sql - The SQL query to run
 * @param {Array} params - The parameters for the query
 * @returns {Promise} - A promise that resolves with the result
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error running SQL query:', err);
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Get a single row from the database
 * @param {string} sql - The SQL query to run
 * @param {Array} params - The parameters for the query
 * @returns {Promise} - A promise that resolves with the row
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Error getting row:', err);
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

/**
 * Get all rows from the database
 * @param {string} sql - The SQL query to run
 * @param {Array} params - The parameters for the query
 * @returns {Promise} - A promise that resolves with the rows
 */
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error getting all rows:', err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  run,
  get,
  all
}; 