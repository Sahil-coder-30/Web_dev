# Frontend Architecture & Folder Structure Reference

This document serves as referential documentation for the default architectural pattern and folder structure used in this React (Vite) application.

## Core Stack
- **Framework:** React + Vite
- **Language:** JavaScript (`.jsx` and `.js`)
- **Routing:** React Router (`react-router`)
- **Styling:** SCSS (`sass`)
- **HTTP Client:** Base `axios`
- **State Management:** React Context API

## Architectural Pattern: Feature-Driven Design
The application is structured using a **Feature-Driven Architecture** (sometimes known as Domain-Driven or Modular architecture). Instead of grouping items by technical type (e.g., placing all hooks together, all services together, etc. for the entire app), logic is co-located by *feature areas* (e.g., Auth, Post, Profile). 

This grouping ensures that everything related to a specific domain lives in one place, making the codebase scalable and much easier to navigate.

---

## High-Level Structure Overview

```text
Frontend/
├── DESIGN_SYSTEM.md        # Reference for design layouts
├── index.html              # Entry HTML template
├── package.json            # Project dependencies and configs
├── vite.config.js          # Vite configuration
└── src/
    ├── App.jsx             # Main App layout/wrapper
    ├── main.jsx            # Application entry point (ReactDOM rendering)
    ├── routes.jsx          # Top-level routing logic
    ├── style.scss          # Global SCSS styles
    ├── components/         # Global shared components
    └── features/           # Feature modules (Domain-driven logic)
```

---

## Detailed Directory Guide

### 1. Global Components (`src/components/`)
This directory contains fully generic, reusable components that don't belong to any specific feature. 
- **Route Guards:** Components like `AuthRoute.jsx` or `ProtectedRoute.jsx` used for handling authenticated navigation.
- **Shared UI Elements:** Loading spinners (`Loader/`), `Skeletons/`, generic buttons, inputs, modals, etc.

### 2. Feature Modules (`src/features/`)
Each sub-folder represents an independent vertical slice of the application (e.g., `Auth`, `Post`, `Profile`, `Notifications`).

A standard feature folder generally contains the following sub-directories:

```text
src/features/[FeatureName]/
├── components/           # UI components specific to this feature only
├── pages/                # Top-level route components for this feature (e.g., Login.jsx)
├── hooks/                # Custom React hooks containing logic tied to this feature (e.g., useAuth.js)
├── services/             # API calls (Axios endpoints) related to the feature (e.g., auth.api.js)
├── styles/               # SCSS files scoped specifically to this module
└── [feature].context.jsx # React Context Provider for managing this feature's state globally if necessary
```

#### How a Feature is Designed:
- **`pages/`**: These component files should generally act as smart containers. They grab data (using custom hooks or context), manage high-level page layout, and pass data down as props.
- **`components/`**: These are mostly "dumb" or presentational components that receive data and callbacks via props from the `pages/`. 
- **`services/`**: Keeps API logic separate from UI logic. If the endpoint path changes, it only requires a change in one single file.
- **`hooks/`**: Shared or separated complex logic (like managing form state or making specific bundled API requests).
- **`context.jsx`**: Manages shared global state pertinent only to the module (e.g. `auth.context.jsx` checking if the user is authenticated and providing profile data, `posts.context.jsx` managing feeds).

---

## Workflow: How to Build in this Architecture

When developing a new component or modifying existing logic, follow this mental model:

1. **Does this belong to an existing feature?**  
   If you're building a "Like Button", it likely belongs strictly in `src/features/Post/components/`. Keep the logic within the domain.
   
2. **Is it a brand new domain?**  
   If you are building an entirely new domain (like Direct Messaging), create a new folder: `src/features/Chat/` and scaffold the `pages`, `components`, `services`, `hooks`, and `context.jsx` pattern.

3. **Is it purely generic and used globally?**  
   If you're building a generic "Tooltip" or "Dropdown" used by Post, Profile, and Auth alike, place it in the global `src/components/`.

4. **Where does API logic go?**  
   Never place `axios.get()` or `fetch` directly inside a React component. Create an exported function in `src/features/[FeatureName]/services/[FeatureName].api.js` and call that function from your component or hook.

5. **Where does State live?**  
   Keep state as localized to components as possible. If the state must be shared across unrelated parts of the app, elevate it to the module's `[feature].context.jsx`.

6. **Where do CSS/SCSS styles go?**
   Use global rules in `src/style.scss` for resets and generic classes, but put specific overrides inside `src/features/[FeatureName]/styles/`.
