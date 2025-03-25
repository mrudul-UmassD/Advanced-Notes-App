import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import { FaImage, FaTrash } from 'react-icons/fa';

const ImageNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createImageNote } = useContext(NotesContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!imageFile) {
      setError('Please upload an image');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await createImageNote(title, content, imageFile);
      navigate('/notes');
    } catch (err) {
      setError('Failed to create image note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      <h2 className="form-heading">Create Image Note</h2>
      
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Description (Optional)</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note description"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Image</label>
          <div
            style={{
              border: '2px dashed #ccc',
              padding: '2rem',
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!imagePreview ? (
              <div>
                <FaImage style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
                <p>Drag and drop an image here, or click to select a file</p>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    marginBottom: '1rem',
                    borderRadius: '4px'
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="btn btn-danger"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '0.4rem',
                    borderRadius: '50%'
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="btn"
          disabled={isSubmitting || !imageFile}
        >
          {isSubmitting ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
};

export default ImageNote; 