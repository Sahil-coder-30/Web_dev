#  macOS Portfolio OS

A highly interactive, web-based operating system built to showcase my journey as a Full Stack Developer. This project mimics the macOS Monterey/Ventura interface, featuring draggable windows, functional apps, and a responsive glassmorphism design.

## 🚀 Key Features

*   **Window Management System**: Fully functional windowing system with dragging, minimizing, maximizing, and z-index layering logic.
*   **System-Wide Theming**: Dynamic Dark/Light mode toggles that affect all system components (Dock, Menu Bar, Windows).
*   **Interactive Applications**:
    *   **Terminal**: A Zsh-inspired CLI environment to explore skills and projects.
    *   **Safari**: A functioning browser simulation for viewing live project demos.
    *   **Finder**: A file system interface to navigate through repositories and "files".
    *   **Messages/Mail**: Simulated communication apps demonstrating UI layouts.
*   **Performance First**: Optimized for high frame rates and low memory usage using modern React patterns.

---

## 🖥 The Advanced Dock System

The core centerpiece of this project is the custom-built **macOS Dock**. It is not just a static CSS bar but a highly engineered interactive component designed to replicate the native macOS feel perfectly.

### ✨ Dock Features
1.  **Authentic Magnification**: The dock features a "fisheye" magnification effect that tracks mouse movement precisely.
2.  **60fps+ Smoothness**: Unlike many web implementations that lag, this dock is buttery smooth.
3.  **Smart Hitboxing**: Icons expand and contract based on proximity, ensuring you never "miss" a click.
4.  **Active State Indicators**: Dynamic dots appear below open applications, just like the real OS.
5.  **Glassmorphism**: Uses advanced CSS `backdrop-filter` and layers to create the premium "frosted glass" look of macOS Big Sur/Ventura.

### ⚙️ How It Works (Under the Hood)
To achieve native-level performance, we bypassed standard React state updates for the animation loop.

*   **Direct DOM Manipulation**: We use `useRef` to get direct access to the icon DOM elements.
*   **Animation Loop**: The magnification logic runs inside a `requestAnimationFrame` loop. This decouples the visual updates from React's render cycle, ensuring no frame drops even during heavy app usage.
*   **Cosine Interpolation**: Instead of simple linear scaling, we use a cosine curve method (`Math.cos`) to calculate the icon size based on the mouse distance. This gives the magnification that signature "snappy" and "organic" curve found in the real macOS dock, rather than a robotic linear zoom.
*   **Sub-Pixel Rendering**: Calculations are done with high precision to avoid jittering or "shaking" icons during slow mouse movements.

---

## 🎮 How to Use

### General Navigation
*   **Open Apps**: Click any icon in the Dock to launch the application. If it's already open, it will focus the window.
*   **Minimize/Close**: Use the traffic light buttons (Red/Yellow/Green) on any open window to manage its state.
*   **Drag & Drop**: Click and hold the header of any window to move it around the desktop space.

### Dock Interactions
*   **Hover**: Move your cursor over the dock to see the magnification wave in action.
*   **Launch**: Click an icon; notice the active indicator dot appear.
*   **Tooltips**: Hover briefly over an icon to see the application name.

---

## 🛠 Tech Stack

*   **Frontend**: React 19 (Hooks, Context API, Refs)
*   **Styling**: SCSS (Variables, Mixins, Glassmorphism), CSS Modules
*   **State Management**: React Context & Custom Hooks
*   **Animation**: `requestAnimationFrame` (Custom Physics), CSS Transitions
*   **Build Tool**: Vite (Lightning fast HMR)
