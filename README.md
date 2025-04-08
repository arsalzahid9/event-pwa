
---

# Event PWA

A Progressive Web Application (PWA) for managing events, guides, and check-ins. This project is built using modern web technologies including React, TypeScript, Vite, and Tailwind CSS. The application is structured to offer a smooth and responsive experience on both desktop and mobile devices.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Responsive Design:** PWA is optimized for mobile and desktop devices.
- **Event Management:** View, create, update, and delete events.
- **Guide Management:** Manage event guides with dedicated APIs.
- **Authentication:** User login, password reset, and OTP verification.
- **Real-time Check-In:** Enable event check-in functionality.
- **Admin Dashboard:** Comprehensive admin view to manage events and guides.

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **APIs:** RESTful endpoints organized under `/src/api/`
  - **Admin APIs:** For managing guides and events.
  - **Guide APIs:** User-specific endpoints including authentication and check-in functionality.
- **Build Tools:** Vite for fast development and bundling
- **Linting & Formatting:** ESLint for code quality and consistency
- **Styles:** PostCSS for advanced CSS processing

## Project Structure

```
event-pwa/
├── README.md                # Project overview, setup, and instructions
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML file for the application
├── package-lock.json        # Dependency lock file
├── package.json             # Project metadata and dependencies
├── postcss.config.js        # PostCSS configuration
├── public/                  # Static files to be served
│   ├── assets/
│   │   └── logo.png         # Project logo
│   ├── icons/               # Icons and manifest for PWA
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── site.webmanifest
│   ├── index.html           # Secondary HTML file (if required)
│   └── site.webmanifest     # Web manifest for PWA configuration
├── src/                     # Application source code
│   ├── App.tsx              # Main App component
│   ├── api/                 # API endpoints separated by concerns
│   │   ├── Admin/           # APIs for event and guide administration
│   │   │   ├── UpdateGuideName.ts
│   │   │   ├── createGuide.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── deleteGuide.ts
│   │   │   ├── getAllEventDetail.ts
│   │   │   ├── getAllEvents.ts
│   │   │   ├── getEditDetail.ts
│   │   │   ├── getEventDropdown.ts
│   │   │   ├── getGuide.ts
│   │   │   ├── getGuideDropdown.ts
│   │   │   ├── getGuideEditDetail.ts
│   │   │   ├── updateEditDetail.ts
│   │   │   └── updateGuideEditDetail.ts
│   │   └── Guide/           # User-related APIs and authentication
│   │       ├── eventCheckin.ts
│   │       ├── eventDetail.ts
│   │       ├── events.ts
│   │       ├── forgotPassword.ts
│   │       ├── getProfile.ts
│   │       ├── login.ts
│   │       ├── logout.ts
│   │       ├── resetPassword.ts
│   │       └── verifyOtp.ts
│   ├── components/          # Reusable React components
│   │   ├── AdminBottomNav.tsx
│   │   ├── BottomNav.tsx
│   │   ├── EventCard.tsx
│   │   ├── Loader.tsx
│   │   └── ProtectedRoute.tsx
│   ├── index.css            # Global styles
│   ├── main.tsx             # Application entry point
│   ├── pages/               # Page-level components for routing
│   │   ├── Admin/
│   │   │   ├── AddGuide.tsx
│   │   │   ├── AllEvent.tsx
│   │   │   ├── AllEventDetail.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DeleteGuide.tsx
│   │   │   ├── EditGuide.tsx
│   │   │   └── Guides.tsx
│   │   ├── EventDetails.tsx
│   │   ├── Events.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── HelpSupport.tsx
│   │   ├── Login.tsx
│   │   ├── OtpVerification.tsx
│   │   ├── PersonalSettings.tsx
│   │   ├── PrivacySecurity.tsx
│   │   ├── ResetPassword.tsx
│   │   └── Settings.tsx
│   ├── store/               # State management (e.g., authentication)
│   │   └── authStore.ts
│   ├── types/               # TypeScript types and interfaces
│   │   └── index.ts
│   └── vite-env.d.ts        # Vite-specific TypeScript definitions
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.app.json        # TypeScript configuration for the app
├── tsconfig.json            # Root TypeScript configuration
├── tsconfig.node.json       # TypeScript configuration for Node
└── vite.config.ts           # Vite configuration for bundling
```

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/event-pwa.git
   cd event-pwa
   ```

2. **Install Dependencies**

   Make sure you have [Node.js](https://nodejs.org/) installed. Then, install the project dependencies:

   ```bash
   npm install
   ```

## Development

To start the development server with hot reloading:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port specified by Vite) to view the application.

## Build & Deployment

1. **Build for Production**

   To build the application for production, run:

   ```bash
   npm run build
   ```

   The output files will be placed in the `dist/` folder.

2. **Previewing Production Build**

   You can preview the production build locally:

   ```bash
   npm run preview
   ```

3. **Deployment**

   - **Static Hosting:** The built `dist/` folder can be deployed to any static hosting service (e.g., Netlify, Vercel, GitHub Pages).
   - **PWA Considerations:** Make sure the `public/` folder is served correctly so that assets, icons, and the `site.webmanifest` file are accessible for a complete PWA experience.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

### Steps to Contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear commit messages.
4. Push your branch and create a pull request.



---
