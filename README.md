# Notes App

A comprehensive note-taking application that allows users to create and manage text, audio, and image notes. The app is built with React for the frontend and Node.js for the backend, with a self-initializing SQLite database.

## Features

- Create, view, edit, and delete text notes
- Record and save audio notes directly from your browser
- Upload and manage image notes with descriptions
- Filter notes by type (text, audio, image)
- Responsive design that works on desktop and mobile devices
- Automatic database creation and initialization

## Technologies Used

- **Frontend**: React, React Router, Axios, React Icons
- **Backend**: Node.js, Express, SQLite3, Multer
- **Database**: SQLite (automatically created if not present)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/mrudul-UmassD/Advanced-Notes-App.git
   cd notes-app
   ```

2. Install dependencies for both server and client
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

### Running the Application

1. Start the server (in the server directory)
   ```bash
   npm run dev
   ```

2. Start the client (in the client directory)
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
notes-app/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/
│       ├── components/     # React components
│       ├── context/        # Context for state management
│       ├── App.js          # Main App component
│       └── index.js        # Entry point
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── database/           # Database setup and utilities
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── uploads/            # Upload directories for files
│   └── server.js           # Entry point for the server
└── README.md               # Project documentation
```

## API Endpoints

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a specific note by ID
- `GET /api/notes/type/:type` - Get notes by type (text, audio, image)
- `POST /api/notes/text` - Create a new text note
- `POST /api/notes/audio` - Create a new audio note
- `POST /api/notes/image` - Create a new image note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/) 