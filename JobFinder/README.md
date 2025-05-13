# JobFinder - Job Portal Application

A modern job portal application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (login/register)
- User roles (job seekers and recruiters)
- Job listings with filtering and search
- Job application system
- Save jobs for later
- Post job listings (for recruiters)
- User profiles
- Responsive design

## Tech Stack

### Frontend
- React 19
- React Router v7
- Bootstrap 5
- Axios
- Formik & Yup for form validation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Joi for validation

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobfinder.git
cd jobfinder
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Set up environment variables:
   - Rename `.env.example` to `.env` in the root directory
   - Configure your MongoDB connection string and JWT secret

4. Start the development environment:
```bash
# Run the backend server (from the root directory)
npm run dev

# Run the frontend development server (from the client directory)
cd client
npm run dev
```

5. Access the application:
   - Backend API will be available at: http://localhost:8000
   - Frontend will be available at: http://localhost:5173

## Database Setup

The application will automatically connect to MongoDB using the connection string in your .env file. In development mode, sample data will be seeded automatically.

If you want to manually seed the database:
```bash
npm run seed
```

## Folder Structure

```
jobfinder/
├── client/                  # Frontend React application
│   ├── public/              # Public assets
│   └── src/                 # React source files
│       ├── assets/          # Images, CSS, etc.
│       ├── components/      # Reusable components
│       ├── context/         # Context providers
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Page components
│       └── services/        # API services
├── config/                  # Configuration files
├── controllers/             # Route controllers
├── middleware/              # Express middleware
├── models/                  # Mongoose models
├── routes/                  # API routes
└── utils/                   # Utility functions
```

## Deployment

### Backend Deployment
1. Set NODE_ENV to 'production' in your environment variables
2. Configure a production MongoDB database
3. Deploy to a hosting service like Heroku, Render, or DigitalOcean

### Frontend Deployment
1. Build the frontend for production:
```bash
cd client
npm run build
```
2. Deploy the contents of the `dist` directory to a static hosting service like Netlify, Vercel, or GitHub Pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.