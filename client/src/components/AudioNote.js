import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import { FaMicrophone, FaStop, FaTrash } from 'react-icons/fa';

const AudioNote = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  
  const { createAudioNote } = useContext(NotesContext);
  const navigate = useNavigate();
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Failed to access microphone. Please check browser permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const discardRecording = () => {
    // Stop recording if it's ongoing
    if (isRecording) {
      stopRecording();
    }
    
    // Clear audio data
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!audioBlob) {
      setError('Please record an audio note');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await createAudioNote(title, audioBlob);
      navigate('/notes');
    } catch (err) {
      setError('Failed to create audio note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      <h2 className="form-heading">Create Audio Note</h2>
      
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
          <label>Audio Recording</label>
          <div className="audio-recorder">
            <div className="audio-recorder-controls">
              {!isRecording && !audioBlob ? (
                <button
                  type="button"
                  className="btn"
                  onClick={startRecording}
                >
                  <FaMicrophone /> Start Recording
                </button>
              ) : isRecording ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={stopRecording}
                >
                  <FaStop /> Stop Recording
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={discardRecording}
                >
                  <FaTrash /> Discard Recording
                </button>
              )}
              
              {isRecording && (
                <span className="audio-time">{formatTime(recordingTime)}</span>
              )}
            </div>
            
            {audioUrl && (
              <audio
                src={audioUrl}
                controls
                className="note-audio"
              />
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className="btn"
          disabled={isSubmitting || !audioBlob}
        >
          {isSubmitting ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
};

export default AudioNote; 