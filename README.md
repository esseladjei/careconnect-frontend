# 🏥 CareConnect Frontend

> **A modern telemedicine platform connecting patients with licensed Ghanaian healthcare providers**

CareConnect is a comprehensive healthcare platform built with React, TypeScript, and modern web technologies. It enables
secure online consultations, appointment booking, provider reviews, referrals, and integrated mobile money payments (
MTN/Vodafone).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Key Libraries & Tools](#-key-libraries--tools)
- [Available Scripts](#-available-scripts)
- [Core Features Guide](#-core-features-guide)
- [Development Guidelines](#-development-guidelines)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### For Patients

- 🔐 **Secure Authentication** with MFA (Multi-Factor Authentication) support
- 🔍 **Provider Search & Discovery** with advanced filters (specialty, location, rating, price)
- 📅 **Appointment Booking** with real-time slot availability
- 💰 **Mobile Money Payments** (MTN/Vodafone integration)
- ⭐ **Review & Rating System** - Rate providers across 4 categories
- 📊 **Analytics Dashboard** - Track appointment history and health metrics
- 🔗 **Referral Management** - Receive and track provider referrals
- 👤 **Profile Management** with insurance information

### For Providers

- 📋 **Provider Onboarding** with license verification
- 🗓️ **Availability Management** - Create and manage consultation slots
- 👥 **Patient Management** - View and manage appointments
- 🚩 **Issue Reporting** - Flag problematic appointments (private, admin-only)
- 💼 **Practice Listings** - Create and update service offerings
- 📈 **Analytics Dashboard** - Revenue tracking, patient metrics, and performance insights
- 🔗 **Referral System** - Send patients to specialists
- ⭐ **Rating Display** - Public rating badges on profile

### Platform-Wide

- 🔒 **Session Management** with automatic token refresh
- 🔔 **Real-time Notifications** via React Hot Toast
- 📱 **Responsive Design** - Mobile-first Tailwind CSS styling
- ♿ **SEO Optimized** with meta tags and semantic HTML
- 🎨 **Modern UI/UX** with Heroicons and custom theming

---

## 🛠 Tech Stack

### Core Framework

- **React 19.2.0** - UI library with latest features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Fast build tool and dev server

### Routing & State Management

- **React Router DOM 7.10.0** - Client-side routing
- **TanStack Query 5.59.0** - Server state management, caching, and synchronization

### Styling

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite integration for Tailwind
- **Custom Theme Overrides** - Brand-specific styling

### Data Visualization

- **Chart.js 4.4.0** - Interactive charts
- **react-chartjs-2 5.2.0** - React wrapper for Chart.js

### HTTP & API

- **Axios 1.13.2** - HTTP client with interceptors
- **Custom Axios Client** - Session management, token refresh, error handling

### UI Components & Icons

- **@heroicons/react 2.2.0** - Beautiful hand-crafted SVG icons
- **React Hot Toast 2.6.0** - Elegant toast notifications

### Code Quality

- **ESLint 9.39.1** - Code linting
- **Prettier 3.8.1** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

### Backend Requirement

The frontend requires the CareConnect backend API running on `http://localhost:5500/api`. Ensure the backend is set up
and running before starting the frontend.

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/esseladjei/careconnect-frontend.git
   cd careconnect/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list --depth=0
   ```

---

## ⚙️ Configuration

### TypeScript Configuration

The project uses a composite TypeScript setup with three configuration files:

#### `tsconfig.json` (Root)

```json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

#### `tsconfig.app.json` (Application Code)

- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (React 17+ transform)
- **Strict mode**: Enabled with all strict type-checking options
- **Linting**: Unused locals/parameters detection enabled

#### `tsconfig.node.json` (Build Tools)

Configuration for Vite and other Node.js build tools.

### Vite Configuration

```typescript
// vite.config.ts
import {defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),        // React Fast Refresh
        tailwindcss(),  // Tailwind CSS v4 integration
    ],
})
```

### ESLint Configuration

The project uses the new flat config format (`eslint.config.js`):

- **Plugins**: React Hooks, React Refresh, Prettier
- **Parser**: TypeScript ESLint
- **Rules**: Prettier errors, React best practices
- **Ignored**: `dist` folder

### TanStack Query Configuration

```typescript
// src/lib/queryClient.ts
{
    queries: {
        staleTime: 5
        minutes,
            gcTime
    :
        10
        minutes,
            retry
    :
        1,
            refetchOnWindowFocus
    :
        false,
    }
,
    mutations: {
        retry: 1,
    }
}
```

### Axios Client Configuration

- **Base URL**: `http://localhost:5500/api`
- **Credentials**: Enabled (cookies sent with requests)
- **Interceptors**:
    - Response interceptor for 401 handling
    - Automatic token refresh on session expiration
    - Request queuing during token refresh

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

- Starts Vite dev server on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- React Fast Refresh for instant updates

### Production Build

```bash
npm run build
```

- TypeScript compilation check
- Optimized production build
- Output to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

- Serves the production build locally
- Test production optimizations

### Linting

```bash
npm run lint
```

- Runs ESLint on all TypeScript/TSX files
- Checks for code quality and style issues

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── logo.png              # Application logo
│   ├── connect.png           # Marketing assets
│   ├── telemedicine.jpg      # Hero images
│   ├── theme.css             # Global theme variables
│   └── social/               # Social media icons
├── src/
│   ├── api/                  # API client and endpoints
│   │   ├── axiosClient.ts    # Axios instance with interceptors
│   │   ├── authApi.ts        # Authentication endpoints
│   │   ├── appointmentsApi.ts
│   │   ├── analyticsApi.ts
│   │   ├── reviewsApi.ts
│   │   ├── referralsApi.ts
│   │   └── ...
│   ├── components/           # Reusable UI components
│   │   ├── analytics/        # Analytics dashboard components
│   │   ├── booking/          # Appointment booking flow
│   │   ├── charts/           # Data visualization
│   │   ├── reviews/          # Review system components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MFASettings.tsx
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication state
│   │   ├── useAppointments.ts
│   │   ├── useAnalytics.ts
│   │   ├── useReviews.ts
│   │   └── ...
│   ├── lib/                  # Third-party library configurations
│   │   └── queryClient.ts    # TanStack Query setup
│   ├── pages/                # Route components (page-level)
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SearchPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── AppointmentReviewPage.tsx
│   │   └── ...
│   ├── types/                # TypeScript type definitions
│   │   ├── user.ts
│   │   ├── appointment.ts
│   │   ├── analytics.ts
│   │   ├── reviews.ts
│   │   └── ...
│   ├── utils/                # Utility functions
│   │   └── analyticsUtils.ts
│   ├── styles/               # Additional stylesheets
│   │   └── theme-overrides.css
│   ├── App.tsx               # Root component with routing
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles + Tailwind imports
│   └── App.css               # App-specific styles
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript root config
├── tsconfig.app.json         # App TypeScript config
├── eslint.config.js          # ESLint flat config
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## 🔑 Key Libraries & Tools

### 1. **TanStack Query (React Query)**

- **Purpose**: Server state management
- **Features**: Automatic caching, background updates, optimistic updates
- **Usage**: All API calls in custom hooks (`useAuth`, `useAppointments`, etc.)

### 2. **Axios**

- **Purpose**: HTTP client
- **Custom Setup**:
    - Automatic session refresh on 401 errors
    - Request/response interceptors
    - Cookie-based authentication
- **Location**: `src/api/axiosClient.ts`

### 3. **React Router DOM v7**

- **Purpose**: Client-side routing
- **Features**: Protected routes, nested routing, URL parameters
- **Implementation**: Route guards check `isLoggedIn` status

### 4. **Chart.js with React**

- **Purpose**: Data visualization
- **Used In**: Analytics dashboards for patients and providers
- **Charts**: Line charts (appointments over time), bar charts (revenue), pie charts (distribution)

### 5. **Tailwind CSS v4**

- **Purpose**: Utility-first styling
- **Integration**: Vite plugin for optimal performance
- **Customization**: `theme.css` and `theme-overrides.css`

### 6. **React Hot Toast**

- **Purpose**: Notification system
- **Features**: Success, error, loading states
- **Position**: Top-right corner
- **Usage**: User feedback for all actions

### 7. **Heroicons**

- **Purpose**: SVG icon library
- **Variants**: Outline and solid icons
- **Usage**: Throughout UI (navigation, buttons, status indicators)

---

## 📜 Available Scripts

| Script    | Command                | Description                         |
|-----------|------------------------|-------------------------------------|
| `dev`     | `vite`                 | Start development server with HMR   |
| `build`   | `tsc -b && vite build` | Type-check and build for production |
| `lint`    | `eslint .`             | Run ESLint on all files             |
| `preview` | `vite preview`         | Preview production build locally    |

---

## 🎯 Core Features Guide

### Authentication & Security

#### Session Management

- Cookie-based authentication with HTTP-only cookies
- Automatic token refresh on expiration
- MFA support (email codes)
- Session verification on app load

#### Protected Routes

```typescript
// Example from App.tsx
<Route
    path = "/dashboard/:userId"
element = {isLoggedIn ? <Dashboard / > : <Navigate to = "/login" / >}
/>
```

### Review System

#### For Patients

- **Route**: `/appointments/:appointmentId/review`
- **Eligibility**: Completed appointments with payment
- **Rating Categories**:
    - Communication
    - Professionalism
    - Diagnosis Accuracy
    - Overall Experience
- **Privacy**: Reviews are anonymous to providers

#### For Providers

- **Display**: Public rating badges on search results and profile pages
- **Calculation**: Average across all 4 categories
- **Badge Logic**: "New Provider" badge when reviews < 3
- **Flags**: Private issue reporting for admins only

### Appointment Booking Flow

1. **Search** → Filter providers by specialty, location, price range
2. **Provider Profile** → View ratings, reviews, availability
3. **Select Time Slot** → Choose from available appointment times
4. **Payment** → MTN/Vodafone mobile money integration
5. **Confirmation** → Email/SMS notification sent

### Analytics Dashboards

#### Patient Dashboard

- Appointment history and trends
- Health metrics visualization
- Spending overview
- Provider ratings

#### Provider Dashboard

- Revenue tracking (daily, weekly, monthly)
- Patient volume metrics
- Rating trends
- Appointment status distribution

### Referral System

- **Provider to Patient**: Send referrals to specialists
- **Tracking**: Monitor referral status
- **Routes**:
    - `/referral/provider/:userId` (provider view)
    - `/referral/patient/:userId` (patient view)

---

## 👨‍💻 Development Guidelines

### Code Style

- Follow ESLint and Prettier rules
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use named exports for components

### API Integration

1. Create API functions in `src/api/` directory
2. Wrap in custom hooks using TanStack Query
3. Handle loading/error states in components
4. Use toast notifications for user feedback

### Component Pattern

```typescript
// Good example
export function MyComponent() {
    const {data, isLoading, error} = useCustomHook();

    if (isLoading) return <Spinner / >;
    if (error) return <ErrorMessage error = {error}
    />;

    return <div>{/* Component JSX */} < /div>;
}
```

### Type Safety

- Define interfaces in `src/types/`
- Export and reuse types across the application
- Avoid `any` type; use `unknown` if necessary
- Leverage TypeScript's type inference

---

## 🌍 Environment Variables

Currently, the API base URL is hardcoded in `axiosClient.ts`:

```typescript
baseURL: 'http://localhost:5500/api'
```

### To Use Environment Variables (Recommended)

1. Create `.env` file in root:
   ```env
   VITE_API_BASE_URL=http://localhost:5500/api
   ```

2. Update `axiosClient.ts`:
   ```typescript
   baseURL: import.meta.env.VITE_API_BASE_URL
   ```

3. Add to `.gitignore`:
   ```
   .env
   .env.local
   ```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to backend"

- Ensure backend is running on `http://localhost:5500`
- Check CORS configuration in backend
- Verify `withCredentials: true` in axios config

#### 2. "Session expired" errors

- Check refresh token endpoint is working
- Verify cookies are being sent
- Clear localStorage and try logging in again

#### 3. "Module not found" errors

- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and run `npm install` again
- Check import paths are correct

#### 4. TypeScript errors

- Run `npm run build` to see all type errors
- Ensure all types are properly defined
- Check `tsconfig.app.json` settings

#### 5. Styling not loading

- Verify Tailwind CSS plugin is in `vite.config.ts`
- Check `index.css` imports Tailwind directives
- Clear Vite cache: `rm -rf node_modules/.vite`

### Getting Help

- Check the console for detailed error messages
- Review network tab for API errors
- Verify backend logs for server-side issues

---

## 📝 Notes

- **Public Pages**: Never display review comments publicly
- **Provider Flags**: Only visible to admins, not patients
- **Rating Source**: `GET /reviews/provider/:providerId/rating`
- **Session Storage**: Uses `localStorage` for user metadata
- **Cookie Security**: HTTP-only cookies for tokens

---

## 🏗️ Future Enhancements

- [ ] Real-time chat during consultations
- [ ] Video conferencing integration
- [ ] Push notifications (PWA)
- [ ] Prescription management
- [ ] Health records storage
- [ ] Multi-language support
- [ ] Dark mode theme

---

## 📄 License

Copyright © 2026 KOADEL Group. All rights reserved.

---

## 🤝 Contributing

This is a private project. For contribution guidelines, please contact the development team.

---

**Built with ❤️ by KOADEL Group**
