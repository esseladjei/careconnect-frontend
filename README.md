# CareConnect Frontend

CareConnect is a telemedicine platform connecting patients with licensed Ghanaian doctors for online consultations with
secure mobile money payments (MTN/Vodafone Momo).

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Backend Connection](#backend-connection)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Setup](#environment-setup)
- [Key Features](#key-features)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Project Overview

CareConnect is a React-based frontend application that provides:

- Patient and provider authentication
- Doctor/provider search and filtering
- Appointment booking system
- Provider onboarding and listing creation
- User profile management
- Referral system
- Payment integration
- Rating and review system

## Tech Stack

### Core Framework

- **React** 19.2.0 - UI library
- **TypeScript** ~5.9.3 - Type safety
- **Vite** 7.2.4 - Build tool and development server

### State & Data Management

- **TanStack Query (React Query)** 5.59.0 - Server state management and data fetching
- **Axios** 1.13.2 - HTTP client

### Styling

- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **@tailwindcss/vite** 4.1.17 - Vite plugin for Tailwind

### Routing

- **React Router DOM** 7.10.0 - Client-side routing

### UI Components & Icons

- **@heroicons/react** 2.2.0 - Icon library
- **react-hot-toast** 2.6.0 - Toast notifications

### Development Tools

- **ESLint** 9.39.1 - Code linting
- **Prettier** 3.8.1 - Code formatting
- **TypeScript ESLint** 8.46.4 - TypeScript linting support

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn** as alternative)
- **Git** for version control
- **Backend API Server** running on `http://localhost:5500` (see [Backend Connection](#backend-connection))

## Installation

### 1. Clone the Repository

```bash
git clone <git@github.com:esseladjei/careconnect-frontend.git>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Verify Installation

```bash
npm run lint
```

## Configuration

### TypeScript Configuration

The project uses a modular TypeScript configuration:

- **tsconfig.json** - Base configuration
- **tsconfig.app.json** - Application-specific configuration
- **tsconfig.node.json** - Node.js related configuration

### Vite Configuration

Configuration file: `vite.config.ts`

Key plugins:

- `@vitejs/plugin-react` - React Fast Refresh support
- `@tailwindcss/vite` - Tailwind CSS integration

### ESLint & Prettier Configuration

Configuration file: `eslint.config.js`

Includes:

- React best practices
- React Hooks validation
- Prettier integration for code formatting

## Backend Connection

### Backend API Base URL

The frontend is configured to connect to a backend API running on:

```
http://localhost:5500/api
```

**Configuration Location:** `src/api/axiosClient.ts`

### Axios Client Setup

The application uses a centralized Axios client with the following features:

#### 1. **Base URL Configuration**

```typescript
baseURL: 'http://localhost:5500/api'
```

#### 2. **Request Interceptor**

- Automatically attaches JWT bearer token from localStorage to all requests
- Token key: `token`
- Header format: `Authorization: Bearer <token>`

#### 3. **Response Interceptor**

- Handles 401 (Unauthorized) errors automatically
- Clears authentication data on token expiration:
    - `token`
    - `userId`
    - `providerId`
    - `patientId`
- Redirects user to `/login` page

### Changing Backend URL

To connect to a different backend server:

1. Edit `src/api/axiosClient.ts`
2. Modify the `baseURL` property:

```typescript
const axiosClient = axios.create({
    baseURL: 'http://your-backend-url:port/api',
});
```

### API Endpoints Used

The application integrates with the following API modules:

#### Authentication APIs

- **`src/api/passwordApi.ts`** - Password management
- **`src/api/forgotPasswordApi.ts`** - Forgot password flow

#### Core Feature APIs

- **`src/api/appointmentsApi.ts`** - Appointment management
- **`src/api/referralsApi.ts`** - Referral system

### Backend Requirements

The backend API must support:

1. **Authentication**
    - User login/registration endpoints
    - JWT token validation
    - Password reset endpoints

2. **Appointments**
    - Create, read, update, delete appointments
    - Fetch availability slots
    - Manage bookings

3. **Referrals**
    - Create referral requests
    - Fetch referral history
    - Accept/reject referrals

4. **Provider Listings**
    - Create/update provider listings
    - Manage specialties and locations
    - Search and filter providers

5. **User Data**
    - Fetch user profiles
    - Update user information
    - Manage provider details

6. **Payments**
    - Process mobile money payments
    - Payment status tracking

## Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── logo.png
│   ├── connect.png
│   ├── telemedicine.jpg
│   ├── theme.css
│   └── social/                      # Social media icons
│       ├── facebook.png
│       ├── instagram.png
│       └── linkedin.png
│
├── src/
│   ├── api/                         # API clients and HTTP configuration
│   │   ├── axiosClient.ts           # Axios instance with interceptors
│   │   ├── appointmentsApi.ts       # Appointment endpoints
│   │   ├── referralsApi.ts          # Referral endpoints
│   │   ├── passwordApi.ts           # Password management endpoints
│   │   └── forgotPasswordApi.ts     # Forgot password endpoints
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── Footer.tsx               # Footer component
│   │   ├── Hero.tsx                 # Hero section
│   │   ├── Spinner.tsx              # Loading spinner
│   │   ├── AppointmentCard.tsx      # Appointment display card
│   │   ├── BenefitCard.tsx          # Feature/benefit cards
│   │   ├── DataCard.tsx             # Generic data card
│   │   ├── SearchFilterPanel.tsx    # Search filter UI
│   │   ├── SearchResultItem.tsx     # Search result item
│   │   ├── SideBarFilter.tsx        # Sidebar filters
│   │   ├── ReferralBanner.tsx       # Referral promotion
│   │   ├── ProfileDetailsForms.tsx  # Profile editing forms
│   │   ├── SecuritySettings.tsx     # Security settings component
│   │   ├── SEO.tsx                  # SEO configuration
│   │   ├── SlotLegend.tsx           # Slot availability legend
│   │   ├── ProviderQuickActions.tsx # Provider action buttons
│   │   │
│   │   └── booking/                 # Booking-specific components
│   │       ├── BookingSideBar.tsx   # Booking sidebar
│   │       ├── DateSelector.tsx     # Date picker
│   │       ├── OverviewTab.tsx      # Booking overview
│   │       ├── ProviderHeader.tsx   # Provider info header
│   │       ├── ProviderTabs.tsx     # Tab navigation
│   │       ├── RatingSummary.tsx    # Rating display
│   │       ├── ReviewList.tsx       # Review listings
│   │       ├── ReviewTab.tsx        # Reviews tab content
│   │       ├── TimeSlotGrid.tsx     # Time slot selection
│   │       └── index.ts             # Barrel export
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Authentication state hook
│   │   ├── useAppointments.ts       # Appointment operations
│   │   ├── useCapitalizeFirst.ts    # String formatting
│   │   ├── useDate.ts               # Date utilities
│   │   ├── useForgotPassword.ts     # Forgot password flow
│   │   ├── useLocations.ts          # Location data
│   │   ├── useReferrals.ts          # Referral operations
│   │   ├── useRegisterUser.ts       # User registration
│   │   ├── useResetPassword.ts      # Password reset flow
│   │   └── useSpecialties.ts        # Specialty data
│   │
│   ├── lib/                         # Utility libraries and config
│   │   └── queryClient.ts           # TanStack Query configuration
│   │
│   ├── pages/                       # Page/route components
│   │   ├── Home.tsx                 # Landing page
│   │   ├── Login.tsx                # Login page
│   │   ├── RegisterUser.tsx         # Registration page
│   │   ├── ForgotPassword.tsx       # Forgot password page
│   │   ├── ResetPassword.tsx        # Password reset page
│   │   ├── Logout.tsx               # Logout handler
│   │   ├── Dashboard.tsx            # User dashboard
│   │   ├── Doctors.tsx              # Doctor listing
│   │   ├── SearchPage.tsx           # Search and filter page
│   │   ├── BookingPage.tsx          # Appointment booking
│   │   ├── CreateListing.tsx        # Provider listing creation
│   │   ├── ProviderOnboarding.tsx   # Provider registration
│   │   ├── UserProfilepage.tsx      # User profile page
│   │   ├── AppointmentPage.tsx      # Appointments management
│   │   ├── PaymentsPages.tsx        # Payment history
│   │   ├── ReferalPage.tsx          # Referral management
│   │   └── NotFoundPage.tsx         # 404 page
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── user.ts                  # User types
│   │   ├── appointment.ts           # Appointment types
│   │   ├── providerListing.ts       # Provider listing types
│   │   ├── referral.ts              # Referral types
│   │   ├── reviews.ts               # Review types
│   │   └── search.ts                # Search filter types
│   │
│   ├── styles/                      # Global styles
│   │   ├── theme-overrides.css      # Custom theme CSS
│   │   └── index.css                # Global styles
│   │
│   ├── App.tsx                      # Main app component with routes
│   ├── App.css                      # App-level styles
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Base styles
│
├── eslint.config.js                 # ESLint configuration
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # Base TypeScript config
├── tsconfig.app.json                # Application TypeScript config
├── tsconfig.node.json               # Node.js TypeScript config
├── package.json                     # Dependencies and scripts
├── index.html                       # HTML entry point
└── README.md                        # This file
```

## Available Scripts

### Development Server

```bash
npm run dev
```

Starts the development server with hot module reloading.

- Access at: `http://localhost:5173` (default Vite port)

### Production Build

```bash
npm run build
```

Builds the application for production with TypeScript compilation.

- Output directory: `dist/`

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Lint Code

```bash
npm run lint
```

Runs ESLint to check code quality and style violations.

## Environment Setup

### Authentication Storage

The application uses **localStorage** to persist authentication data:

- `token` - JWT bearer token
- `userId` - Unique user identifier
- `providerId` - Provider ID (if user is a provider)
- `patientId` - Patient ID (if user is a patient)
- `role` - User role ('patient' or 'provider')

**Note:** This implementation will be refactored to use HTTPS cookies instead of sending tokens with every request.

### Query Client Configuration

TanStack Query is configured in `src/lib/queryClient.ts` with:

- **Stale Time:** 5 minutes
- **Garbage Collection Time:** 10 minutes
- **Auto Retry:** 1 attempt on failure
- **Window Focus Refetch:** Disabled

## Key Features

### 1. **Authentication System**

- User login and registration
- Role-based access (patient/provider)
- Password reset and recovery
- Automatic logout on token expiration

### 2. **Provider Search & Discovery**

- Filter by specialties and locations
- View provider profiles with ratings
- Browse available time slots
- Read patient reviews

### 3. **Appointment Management**

- Book appointments with available providers
- View booking history
- Cancel appointments
- Receive booking confirmations

### 4. **Provider Onboarding**

- Create provider profiles
- Add specialties and locations
- Set availability schedules
- Manage provider listings

### 5. **Referral System**

- Send referrals between providers
- Manage referral requests
- Track referral history
- Accept/reject referrals

### 6. **Payment Integration**

- Mobile money payment support (MTN/Vodafone Momo)
- Payment history tracking
- Transaction status updates

### 7. **User Profiles**

- View and edit profile information
- Manage security settings
- Update contact information
- Profile image management

### 8. **Ratings & Reviews**

- View provider ratings
- Read patient reviews
- Leave reviews after appointments
- Rating summary display

## Authentication

### Login Flow

1. User enters credentials on `/login` page
2. Credentials sent to backend authentication API
3. Backend returns JWT token and user data
4. Token and user info stored in localStorage
5. User redirected to dashboard

### Protected Routes

Routes requiring authentication use the `isLoggedIn` check:

```typescript
{
    isLoggedIn ? <ProtectedPage / > : <Navigate to = "/login" / >
}
```

The `useAuth()` hook provides access to:

- `token` - JWT authentication token
- `userId` - Current user ID
- `providerId` - Provider ID (if applicable)
- `patientId` - Patient ID (if applicable)
- `role` - User role
- `actorId` - Active provider/patient ID based on role
- `isLoggedIn` - Authentication status

### Logout

Logout is handled by:

1. `/logout` route clears all authentication data
2. Redirects to home page
3. On 401 response, automatic logout and redirect to login

## API Integration

### Using the Axios Client

All API calls should use the configured axios client from `src/api/axiosClient.ts`:

```typescript
import axiosClient from '@/api/axiosClient';

// GET request
const data = await axiosClient.get('/endpoint');

// POST request
const response = await axiosClient.post('/endpoint', payload);

// PUT request
const updated = await axiosClient.put('/endpoint/id', payload);

// DELETE request
await axiosClient.delete('/endpoint/id');
```

### Creating API Modules

Follow the pattern in existing API modules:

```typescript
// src/api/exampleApi.ts
import axiosClient from './axiosClient';

export const exampleApi = {
    getItems: () => axiosClient.get('/items'),
    getItem: (id: string) => axiosClient.get(`/items/${id}`),
    createItem: (data: any) => axiosClient.post('/items', data),
    updateItem: (id: string, data: any) => axiosClient.put(`/items/${id}`, data),
    deleteItem: (id: string) => axiosClient.delete(`/items/${id}`),
};
```

### Using React Query Hooks

TanStack Query hooks should wrap API calls:

```typescript
import {useQuery, useMutation} from '@tanstack/react-query';
import {exampleApi} from '@/api/exampleApi';

// Query
const {data, isLoading, error} = useQuery({
    queryKey: ['items'],
    queryFn: exampleApi.getItems,
});

// Mutation
const {mutate} = useMutation({
    mutationFn: exampleApi.createItem,
    onSuccess: () => {
        // Handle success
    },
});
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Create New Components

- Place in `src/components/` or `src/pages/`
- Use TypeScript for type safety
- Follow existing naming conventions

### 3. Create New Pages

- Create file in `src/pages/` directory
- Add route in `src/App.tsx`
- Implement with proper error handling

### 4. Add New API Endpoints

- Create module in `src/api/`
- Use axios client for requests
- Export functions for use in hooks

### 5. Create Custom Hooks

- Place in `src/hooks/` directory
- Use React Query for server state
- Document parameters and return values

### 6. Code Quality

```bash
npm run lint     # Check for issues
npm run build    # Test production build
```

### 7. Type Safety

- Always define types in `src/types/`
- Use TypeScript interfaces for API responses
- Avoid `any` types when possible

## Troubleshooting

### Backend Connection Issues

**Problem:** `Failed to fetch` or CORS errors

**Solutions:**

1. Verify backend is running on `http://localhost:5500`
2. Check CORS configuration on backend
3. Ensure backend API routes exist at `/api/*`
4. Check browser console for detailed error messages

```bash
# Test backend connectivity
curl http://localhost:5500/api/health
```

### Authentication Issues

**Problem:** Stuck on login page or keeps redirecting to login

**Solutions:**

1. Check localStorage for token: `localStorage.getItem('token')`
2. Verify token is being sent in requests (check Network tab)
3. Check backend token validation
4. Clear localStorage and re-login: `localStorage.clear()`

### Build Issues

**Problem:** Build fails with TypeScript errors

**Solutions:**

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Port Already in Use

**Problem:** Cannot start dev server, port 5173 already in use

**Solutions:**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found

**Problem:** Import errors for components or utilities

**Solutions:**

1. Verify file path is correct
2. Check file extension (.tsx, .ts, .css)
3. Ensure barrel exports in index files are correct
4. Restart dev server after adding new files

### Query/Mutation Not Working

**Problem:** Data not loading or mutations failing

**Solutions:**

1. Check Network tab in browser DevTools
2. Verify backend endpoint exists and is correct
3. Check API request/response in Network tab
4. Review error messages in console
5. Ensure token is present in Authorization header

### Styling Issues

**Problem:** Tailwind classes not applying

**Solutions:**

1. Ensure class name is exact (no typos)
2. Check if class is a valid Tailwind utility
3. Verify Tailwind config includes template paths
4. Rebuild CSS: `npm run build`

### Hot Module Reload Not Working

**Problem:** Changes not reflecting in browser

**Solutions:**

1. Save file and wait for compilation
2. Hard refresh browser (Cmd+Shift+R on Mac)
3. Check console for compilation errors
4. Restart dev server: `npm run dev`

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/)

## Support & Contribution

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

**Last Updated:** February 17, 2026

**Version:** 0.0.0
