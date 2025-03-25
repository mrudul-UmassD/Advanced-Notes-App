import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaMicrophone, FaImage } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Notes App</h1>
      <p>
        A simple application to create and manage your notes.
        You can create text notes, record audio notes, or save images with notes.
      </p>
      
      <div className="note-types">
        <div className="note-type-card">
          <div className="note-type-icon">
            <FaFileAlt />
          </div>
          <h3>Text Notes</h3>
          <p>Create and manage simple text notes for your ideas, thoughts, and tasks.</p>
          <Link to="/text" className="btn">Create Text Note</Link>
        </div>
        
        <div className="note-type-card">
          <div className="note-type-icon">
            <FaMicrophone />
          </div>
          <h3>Audio Notes</h3>
          <p>Record your voice memos, meetings, or any audio you want to save.</p>
          <Link to="/audio" className="btn">Create Audio Note</Link>
        </div>
        
        <div className="note-type-card">
          <div className="note-type-icon">
            <FaImage />
          </div>
          <h3>Image Notes</h3>
          <p>Save images with descriptions to remember important visual information.</p>
          <Link to="/image" className="btn">Create Image Note</Link>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/notes" className="btn btn-secondary">View All Notes</Link>
      </div>
    </div>
  );
};

export default Home; 