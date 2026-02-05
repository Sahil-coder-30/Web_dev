# React Router DOM – Complete Notes

## 1. What is React Router DOM?

**React Router DOM** is a library used in React to handle **client-side routing**.

In simple terms:

- It allows you to create **multiple pages (routes)** in a **single-page application**
- Page reload does **not** happen
- Only the required component is rendered

---

## 2. Installation

```bash
npm install react-router-dom

```

---

## 3. Core Components Used in Routing

| Component | Purpose |
| --- | --- |
| `BrowserRouter` | Wraps the app and enables routing |
| `Routes` | Container for all routes |
| `Route` | Defines a path and its component |
| `Link` | Used for navigation (no page reload) |
| `useParams` | Reads dynamic values from URL |
| `Outlet` | Used in nested routing |

---

## 4. Setting Up Routing (Basic Structure)

### index.js / main.jsx

```jsx
importReactfrom"react";
importReactDOMfrom"react-dom/client";
importAppfrom"./App";
import {BrowserRouter }from"react-router-dom";

const root =ReactDOM.createRoot(document.getElementById("root"));

root.render(
<BrowserRouter>
<App />
</BrowserRouter>
);

```

### Why BrowserRouter?

- It enables **HTML5 history API**
- Without it, routing will not work

---

## 5. Routes and Route

### App.jsx

```jsx
import {Routes,Route }from"react-router-dom";
importHomefrom"./Home";
importAboutfrom"./About";
importContactfrom"./Contact";

constApp = () => {
return (
<Routes>
<Routepath="/"element={<Home />} />
<Routepath="/about"element={<About />} />
<Routepath="/contact"element={<Contact />} />
</Routes>
  );
};

exportdefaultApp;

```

### Explanation

- `Routes` → wrapper for all routes
- `Route`:
    - `path` → URL
    - `element` → component to render

---

## 6. Navigation Using Link

```jsx
import {Link }from"react-router-dom";

constNavbar = () => {
return (
<>
<Linkto="/">Home</Link>
<Linkto="/about">About</Link>
<Linkto="/contact">Contact</Link>
</>
  );
};

exportdefaultNavbar;

```

### Why not `<a>` tag?

- `<a>` reloads the page
- `<Link>` changes route **without reload**

---

## 7. Dynamic Routing & useParams

### What is useParams?

`useParams()` is a hook that allows you to **read dynamic values from the URL**.

Example URL:

```
/user/101

```

Here, `101` is dynamic.

---

### Route Setup

```jsx
<Route path="/user/:id" element={<User />} />

```

`:id` → dynamic parameter

---

### User.jsx

```jsx
import { useParams }from"react-router-dom";

constUser = () => {
const params =useParams();

return (
<div>
<h2>User ID: {params.id}</h2>
</div>
  );
};

exportdefaultUser;

```

### Explanation

- `useParams()` returns an object
- `{ id: "101" }`
- Always returned as **string**

---

## 8. Multiple Params Example

### Route

```jsx
<Route path="/product/:category/:id" element={<Product />} />

```

### Component

```jsx
import { useParams }from"react-router-dom";

constProduct = () => {
const { category, id } =useParams();

return (
<h2>
      Category: {category} | Product ID: {id}
</h2>
  );
};

exportdefaultProduct;

```

---

## 9. Nested Routing (Very Important)

### What is Nested Routing?

Nested routing means:

- A route **inside another route**
- Used for **dashboards, profiles, settings pages**

Example:

```
/dashboard
/dashboard/profile
/dashboard/settings

```

---

## 10. Nested Routing Setup

### App.jsx

```jsx
import {Routes,Route }from"react-router-dom";
importDashboardfrom"./Dashboard";
importProfilefrom"./Profile";
importSettingsfrom"./Settings";

constApp = () => {
return (
<Routes>
<Routepath="/dashboard"element={<Dashboard />}>
<Routepath="profile"element={<Profile />} />
<Routepath="settings"element={<Settings />} />
</Route>
</Routes>
  );
};

exportdefaultApp;

```

---

## 11. Outlet (Required for Nested Routing)

### Dashboard.jsx

```jsx
import {Outlet,Link }from"react-router-dom";

constDashboard = () => {
return (
<div>
<h2>Dashboard</h2>

<Linkto="profile">Profile</Link>
<Linkto="settings">Settings</Link>

<Outlet />
</div>
  );
};

exportdefaultDashboard;

```

### Explanation

- `<Outlet />` is the place where **child routes render**
- Without Outlet, nested routes will not show

## Universal Route (404 / Not Found Route) – React Router DOM

### What is a Universal Route?

A **Universal Route** (also called a **404 Route** or **Not Found Route**) is used to handle **all undefined URLs** in a React application.

In simple terms:

If a user enters a URL that **does not match any defined route**, the **universal route** is rendered.

Example:

```
/about      → valid
/contact   → valid
/abc123    → invalid → Universal Route

```

## Basic Universal Route Setup

### App.jsx

```jsx
import {Routes,Route }from"react-router-dom";
importHomefrom"./Home";
importAboutfrom"./About";
importNotFoundfrom"./NotFound";

constApp = () => {
return (
<Routes>
<Routepath="/"element={<Home />} />
<Routepath="/about"element={<About />} />

      {/* Universal Route */}
<Routepath="*"element={<NotFound />} />
</Routes>
  );
};

exportdefaultApp;

```

---

## NotFound Component

### NotFound.jsx

```jsx
import {Link }from"react-router-dom";

constNotFound = () => {
return (
<div>
<h1>404 - Page Not Found</h1>
<p>The page you are looking for does not exist.</p>

<Linkto="/">Go Back to Home</Link>
</div>
  );
};

exportdefaultNotFound;








##- Day - 2 Notes








## . `useNavigate()`

**What:** Hook used to **navigate programmatically** (via JavaScript, not clicks).

**Why:** Redirect after login, submit, logout, or any condition.

```jsx
import { useNavigate }from"react-router-dom";

functionLogin() {
const navigate =useNavigate();

functionhandleLogin() {
// login logic
navigate("/dashboard");// redirect
  }

return<buttononClick={handleLogin}>Login</button>;
}

```

**Key Points**

- Replaces `useHistory` (older versions)
- Used **inside components only**
- `navigate(-1)` → go back

---

## 2. `Outlet`

**What:** Placeholder to render **child (nested) routes**.

**Why:** Needed when using **nested routing**.

```jsx
import {Outlet }from"react-router-dom";

functionLayout() {
return (
<>
<h1>Navbar</h1>
<Outlet />
</>
  );
}

```

```jsx
{
path:"/",
element:<Layout />,
children: [
    {path:"home",element:<Home /> },
    {path:"about",element:<About /> }
  ]
}

```

**Key Points**

- Parent component must contain `<Outlet />`
- Child routes render **inside Outlet**

---

## 3. `createBrowserRouter`

**What:** Modern way to define routes (v6.4+).

**Why:** Cleaner, object-based routing with nesting.

```jsx
import { createBrowserRouter,RouterProvider }from"react-router-dom";

const router =createBrowserRouter([
  {
path:"/",
element:<Layout />,
children: [
      {path:"home",element:<Home /> },
      {path:"about",element:<About /> }
    ]
  }
]);

functionApp() {
return<RouterProviderrouter={router} />;
}

```

**Key Points**

- Replaces `<BrowserRouter>` + `<Routes>`
- Supports nested routes naturally
- Used with `<RouterProvider />`

---

## 4. `NavLink`

**What:** Special version of `Link` that knows **active route state**.

**Why:** To apply styles to the active link.

```jsx
import {NavLink }from"react-router-dom";

functionNavbar() {
return (
<NavLink
to="/home"
className={({isActive }) => (isActive ? "active" : "")}
    >
      Home
</NavLink>
  );
}

```

**Key Points**

- `isActive` helps style active links
- Best for navbars
- Use instead of `Link` when active styling is needed
Displaying Day 80 Notes.md.


```