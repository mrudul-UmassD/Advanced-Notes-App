import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TextNote from './components/TextNote';
import AudioNote from './components/AudioNote';
import ImageNote from './components/ImageNote';
import NotesList from './components/NotesList';
import NoteDetail from './components/NoteDetail';
import { NotesProvider } from './context/NotesContext';
import './App.css';

function App() {
  return (
    <NotesProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/text" element={<TextNote />} />
              <Route path="/audio" element={<AudioNote />} />
              <Route path="/image" element={<ImageNote />} />
              <Route path="/notes" element={<NotesList />} />
              <Route path="/notes/:id" element={<NoteDetail />} />
            </Routes>
          </div>
        </div>
      </Router>
    </NotesProvider>
  );
}

export default App; 