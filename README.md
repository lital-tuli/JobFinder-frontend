# JobFinder Frontend - React Application

The frontend client for the JobFinder job portal application, built with React 19, Vite, and Bootstrap.

## Features

- User authentication (login/register)
- User roles (job seekers and recruiters)
- Job listings with filtering and search
- Job application system
- Save jobs for later
- Post job listings (for recruiters)
- User profiles with file uploads
- Responsive design for all devices

## Tech Stack

### Frontend
- React 19
- React Router v7
- Bootstrap 5 + React Bootstrap
- Axios for API calls
- Formik & Yup for form validation
- Vite for build tooling
- Material-UI Icons

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd JobFinder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in this directory with:
   ```env
   VITE_API_URL=http://localhost:8000/api
   NODE_ENV=development
   ```

4. Start the development server:
```bash
npm run dev
```

5. Access the application:
   - Frontend will be available at: http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/          # Images, CSS, and static files
├── components/      # Reusable React components
│   ├── common/      # Shared components (Header, Footer, etc.)
│   ├── forms/       # Form components
│   └── layout/      # Layout components
├── context/         # React context providers
│   └── AuthContext.jsx  # Authentication context
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   ├── auth/        # Login, Register pages
│   ├── jobs/        # Job-related pages
│   ├── profile/     # User profile pages
│   └── admin/       # Admin dashboard pages
├── services/        # API service functions
│   ├── userService.js   # User API calls
│   ├── jobService.js    # Job API calls
│   └── adminService.js  # Admin API calls
└── main.jsx         # Application entry point
```

## Environment Variables

Required environment variables:

- `VITE_API_URL` - Backend API URL (e.g., http://localhost:8000/api)
- `NODE_ENV` - Environment (development/production)

## API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: Login, register, logout, check auth status
- **User Management**: Profile CRUD, file uploads, job applications
- **Job Management**: Job listings, search, filtering, applications
- **Admin**: User management, system analytics

## Authentication

Uses JWT tokens stored in localStorage with automatic:
- Token inclusion in API requests
- Redirect on unauthorized access
- Auto-logout on token expiration

## Form Validation

All forms use Formik + Yup with:
- Client-side validation
- Real-time feedback
- Password strength requirements:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least 4 numbers
  - At least one special character from: !@%$#^&*-_*
  - Minimum 8 characters total

## Responsive Design

Fully responsive design supporting:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop computers (1200px+)

Uses Bootstrap breakpoints and custom CSS for optimal user experience.

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The `dist` folder will contain the production-ready files

3. Deploy to any static hosting service (Netlify, Vercel, etc.)

## Configuration for Production

Update environment variables for production:
```env
VITE_API_URL=https://your-api-domain.com/api
NODE_ENV=production
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `VITE_API_URL` is correct
   - Check backend server is running
   - Verify CORS settings

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check for ESLint errors: `npm run lint`

3. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Check token expiration
   - Verify API endpoints

## Contributing

1. Follow the existing code style
2. Run linting before commits: `npm run lint`
3. Test all functionality before submitting PRs
4. Update documentation for new features