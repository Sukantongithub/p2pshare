# 📁 P2P File Share

A simple and secure peer-to-peer file sharing application that uses 6-digit access codes for easy file distribution.

## 🌟 Features

- **📤 Upload Files**: Upload files up to 500MB
- **🔢 6-Digit Access Codes**: Automatically generated unique codes for each upload
- **🌍 Global Access**: Download files from anywhere in the world using just the code
- **⏱️ Auto-Expiry**: Files automatically expire after 24 hours
- **👤 User Accounts**: Track your uploads and manage files
- **🔒 Secure**: Local file storage with access code protection

## 🚀 How It Works

### As a Sender:

1. Register or login to your account
2. Upload your file (max 500MB)
3. Receive a unique 6-digit access code
4. Share the code with your recipient

### As a Receiver:

1. Get the 6-digit code from sender
2. Visit the download section
3. Enter the code
4. Download the file instantly

## 🛠️ Tech Stack

### Backend

- Node.js & Express
- MongoDB (Database)
- Multer (File uploads)
- JWT (Authentication)
- bcrypt (Password hashing)

### Frontend

- React with Vite
- React Router
- Axios
- Tailwind CSS

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd P2Pshare
```

2. Install server dependencies

```bash
cd server
npm install
```

3. Install client dependencies

```bash
cd ../client
npm install
```

4. Configure environment variables

Create `.env` file in the `server` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/p2pshare
JWT_SECRET=your_secret_key_here
```

Create `.env` file in the `client` directory:

```
VITE_API_URL=http://localhost:5000/api
```

5. Start MongoDB

```bash
mongod
```

6. Start the server

```bash
cd server
npm start
```

7. Start the client

```bash
cd client
npm run dev
```

8. Open your browser and navigate to `http://localhost:3000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Files

- `POST /api/files/upload` - Upload file (requires auth)
- `GET /api/files` - Get user's files (requires auth)
- `GET /api/files/info/:code` - Get file info by code (no auth)
- `GET /api/files/download/:code` - Download file by code (no auth)
- `DELETE /api/files/:fileId` - Delete file (requires auth)

### User

- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)

## 🗂️ Project Structure

```
P2Pshare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (auth)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── uploads/          # Uploaded files directory
│   └── server.js         # Server entry point
│
└── README.md
```

## 🔑 Key Features Explained

### 6-Digit Access Code System

- Unique codes are generated for each upload
- Codes are validated against the database for uniqueness
- Files can be accessed by anyone with the code
- No authentication required for downloads

### File Expiration

- Files automatically expire 24 hours after upload
- Expired files cannot be accessed or downloaded
- Helps maintain server storage efficiency

### Security

- Passwords are hashed using bcrypt
- JWT tokens for authenticated sessions
- File access protected by unique codes
- User files isolated by account

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, please open an issue in the GitHub repository.
