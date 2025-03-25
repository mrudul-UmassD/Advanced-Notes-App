import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Notes App</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/notes">All Notes</Link></li>
          <li><Link to="/text">Text Note</Link></li>
          <li><Link to="/audio">Audio Note</Link></li>
          <li><Link to="/image">Image Note</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 