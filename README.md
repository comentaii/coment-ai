# CodileAI - Clean Project Structure
   
## Overview
This project has been cleaned up and restructured according to the `.cursor` rules. All page content has been removed while keeping the core infrastructure and configurations intact.

## Project Structure

```
codile-ai/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale layout
│   │   └── page.tsx       # Home page
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── layout.tsx         # Root layout
│   └── metadata.ts        # App metadata
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix-based)
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── forms/            # Form components (Formik + Yup)
│   └── modals/           # Modal components
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   └── use-theme.ts      # Theme management hook
├── lib/                  # Utility functions & configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── utils.ts          # Utility functions
│   └── validation-schemas.ts # Yup validation schemas
├── store/                # Redux store & slices
│   ├── index.ts          # Store configuration
│   └── features/         # Redux Toolkit slices
│       └── globalSettingsSlice.ts # Global settings (language, theme)
├── types/                # TypeScript type definitions
│   ├── auth.d.ts         # Authentication types
│   └── global.d.ts       # Global type declarations
├── services/             # API services & database
│   ├── api/              # RTK Query services
│   │   └── base-api.ts   # Base API configuration
│   └── db/               # Database services
│       └── base.service.ts # Base service class
├── socket/               # Socket.io server
│   └── server.ts         # Socket server setup
├── utils/                # General utilities
│   └── response-handler.ts # API response utilities
├── schemas/              # Database schemas (to be added)
├── contexts/             # React contexts (to be added)
├── i18n/                 # Internationalization
│   ├── locales/          # Translation files
│   │   ├── tr/           # Turkish translations
│   │   └── en/           # English translations
│   └── request.ts        # i18n request handler
└── public/               # Static assets
```

## Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **UI**: Radix UI + Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Internationalization**: next-intl
- **Form Validation**: Formik + Yup
- **API Management**: RTK Query

## Key Features Implemented

### 1. Clean Architecture
- Separated concerns with proper directory structure
- Feature-based organization
- Clear separation between UI, logic, and data layers

### 2. Authentication & Authorization
- NextAuth.js integration
- Role-based access control (RBAC)
- Type-safe authentication with TypeScript

### 3. State Management
- Redux Toolkit for global state
- Redux Persist for state persistence
- RTK Query for API state management

### 4. Form Handling
- Formik + Yup for form validation
- Reusable form components
- Type-safe form schemas

### 5. Internationalization
- next-intl for multi-language support
- Turkish and English translations
- Locale-based routing

### 6. UI Components
- Radix UI primitives
- Tailwind CSS for styling
- Dark/light theme support
- Responsive design

### 7. Database Services
- Inheritance-based service architecture
- Error handling wrapper
- Type-safe database operations

## Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase with `.d.ts` extension (e.g., `auth.d.ts`)
- **API Routes**: kebab-case (e.g., `user-settings/route.ts`)
- **Services**: camelCase with `.service.ts` extension (e.g., `user.service.ts`)

### Import Organization
```typescript
// 1. React and Next.js imports
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party library imports
import { Formik, Form } from 'formik'
import { toast } from 'sonner'

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { userApi } from '@/services/api'

// 4. Relative imports
import { UserCard } from './UserCard'
import { userTypes } from './types'
```

## Next Steps

The project is now ready for development with a clean, scalable architecture. You can start adding:

1. **Feature-specific components** in `components/[feature-name]/`
2. **API endpoints** in `app/api/[feature-name]/`
3. **Database services** extending `BaseService`
4. **RTK Query services** in `services/api/`
5. **Custom hooks** in `hooks/`
6. **Type definitions** in `types/`
7. **Validation schemas** in `lib/validation-schemas.ts`

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`

The project structure follows the `.cursor` rules and is ready for the CodileAI platform development. 
