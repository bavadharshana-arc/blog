# DevSphere — Full-Stack Blog Platform with Comments

> A modern, production-grade blogging and publishing platform built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**.

---

## 🚀 Live Demo & Project Overview

**DevSphere** is a complete full-stack web application designed for publishing tech articles, discovering tutorials, and fostering discussions through a real-time, threaded comment system. The project strictly enforces REST API conventions, role-based authorization, centralized error handling, and responsive user interfaces.

---

## ✨ Key Features

### 🔐 1. Authentication & Security
* **JWT (JSON Web Token)** based stateless authentication.
* **Bcrypt password hashing** with 10 salt rounds (plain-text passwords never stored).
* **Token persistence** in `localStorage` with automatic token verification on page reloads.
* **Protected routes** on both frontend (`<ProtectedRoute>`) and backend (`authMiddleware`).
* **Input validation** on client & server using `express-validator`.

### 🛡️ 2. Strict Authorization (RBAC)
* Users can only **edit or delete their own posts**.
* Users can only **edit or delete their own comments**.
* Modification attempts by unauthorized users return standard `403 Forbidden` responses.

### 📝 3. Blog Post Management (CRUD)
* **Create Post**: Title, category, tag chips, cover image preview, and markdown-friendly content.
* **Explore Feed**: Responsive grid of cards displaying cover image, category badge, estimated reading time, author, date, and comment counts.
* **Article Details**: Beautiful layout with author bio card, tag pills, formatted typography, and social share links.
* **Edit & Delete**: Seamless editing interface and accessible confirmation dialogs for destructive deletions.
* **Cascade Deletions**: Deleting a post automatically deletes all of its associated comments in MongoDB.

### 💬 4. Interactive Comment System
* Add comments to any post with instantaneous UI updates.
* **Inline comment editing** with Save / Cancel controls for comment authors.
* **Delete comments** with modal confirmation.
* Helpful empty states: *"No comments yet. Be the first to comment."*
* Unauthenticated prompt guiding visitors to log in before commenting.

### 🔍 5. Search, Filter & Sorting
* **Instant search**: Debounced real-time query searching title, content, and tags.
* **Category filtering**: Filter articles by *Technology*, *Web Development*, *AI & Future*, *Design & UI*, *Tutorials*, *Productivity*, or *General*.
* **Sorting**: Sort by *Newest First* or *Oldest First*.

### 📊 6. Author Dashboard
* Live statistics: **Total Articles Published**, **Total Comments Received**, and **Member Since**.
* Searchable table/card view of authored articles with quick View, Edit, and Delete action buttons.

### 🎨 7. Modern UI / UX
* Clean typography with Plus Jakarta Sans & Inter font stacks.
* Toast notification system (success, error, info alerts).
* Shimmer loading skeletons during data fetches.
* Fully responsive across desktop, tablet, and mobile screens with mobile navigation drawer.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v7, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `morgan`, `express-validator` |
| **Database** | MongoDB (Local MongoDB or MongoDB Atlas Cloud) |

---

## 📂 Project Structure

```text
blog/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive header with auth states
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── PostCard.jsx         # Card with image, category, author, comment count
│   │   │   ├── CommentSection.jsx   # Comments list, add form, inline edit & delete
│   │   │   ├── ConfirmModal.jsx     # Accessible confirmation dialog
│   │   │   ├── SkeletonLoader.jsx   # Shimmer skeleton placeholders
│   │   │   └── ProtectedRoute.jsx   # Route guard for auth pages
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Global authentication state
│   │   │   └── ToastContext.jsx     # Global alert toasts
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Feed, search, category filters, sorting
│   │   │   ├── PostDetailPage.jsx   # Article view, author bio, discussion
│   │   │   ├── CreatePostPage.jsx   # Post creation form with image preview
│   │   │   ├── EditPostPage.jsx     # Pre-filled edit form with ownership check
│   │   │   ├── DashboardPage.jsx    # User statistics & post management
│   │   │   ├── LoginPage.jsx        # Login form + 1-click demo accounts
│   │   │   ├── RegisterPage.jsx     # Registration form with validation
│   │   │   └── NotFoundPage.jsx     # 404 page
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with interceptors
│   │   ├── utils/
│   │   │   └── formatters.js        # Date, reading time, and styling helpers
│   │   ├── App.jsx                  # React Router routes definition
│   │   ├── index.css                # Tailwind directives & glassmorphic utilities
│   │   └── main.jsx                 # Client entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js                    # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js        # register, login, getMe, updateProfile
│   │   ├── postController.js        # getAll, getById, create, update, delete, stats
│   │   └── commentController.js     # getComments, addComment, update, delete
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protect middleware
│   │   ├── errorMiddleware.js       # Centralized 404 and error handler
│   │   └── validationMiddleware.js  # express-validator rules
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt hooks
│   │   ├── Post.js                  # Post schema with indexes & virtuals
│   │   └── Comment.js               # Comment schema linked to Post & User
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth endpoints
│   │   ├── postRoutes.js            # /api/posts endpoints
│   │   └── commentRoutes.js         # /api/comments endpoints
│   ├── utils/
│   │   ├── jwt.js                   # Token generation and verification
│   │   └── seed.js                  # Database seed script
│   ├── .env.example
│   ├── server.js                    # Express application entry point
│   └── package.json
│
├── package.json                     # Root scripts runner
├── .gitignore
└── README.md                        # Comprehensive documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **MongoDB** (Local MongoDB Community Server or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### 1. Clone or Open the Repository
```bash
cd blog
```

### 2. Install Dependencies
You can install dependencies for both the backend and frontend at once using the root command:
```bash
npm run install:all
```
*Or install individually:*
```bash
cd server && npm install
cd ../client && npm install
```

---

## 🔑 Environment Variables Configuration

Create a `.env` file in the `server/` directory (a pre-filled `server/.env.example` is provided):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> **Using MongoDB Atlas?**
> Replace `MONGO_URI` with your connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog_platform?retryWrites=true&w=majority`

---

## 🗄️ Database Seeding (Demo Data)

Populate the database with realistic demo users, multi-category articles, and comments:

```bash
npm run seed
```

### 👤 Pre-configured Demo Accounts:
| User | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@example.com` | `Password123!` | Full Stack Engineer |
| **Sophia Chen** | `sophia@example.com` | `Password123!` | UI/UX Designer |
| **Marcus Vance** | `marcus@example.com` | `Password123!` | AI Researcher |

*(The login page also includes 1-click demo autofill buttons for instant testing).*

---

## 🏃 Running the Application

### Option A: Run Server and Client in Separate Terminals

**Terminal 1 (Backend Server):**
```bash
npm run server:dev
# Backend starts on http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Frontend runs on http://localhost:5173
```

---

## 📚 REST API Documentation

All API responses follow a consistent JSON envelope structure:
```json
{
  "success": true,
  "message": "Optional descriptive status message",
  "data": {}
}
```

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user | `{ name, email, password, confirmPassword }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & get token | `{ email, password }` |
| `GET` | `/api/auth/me` | Private | Get current authenticated user profile | Header: `Authorization: Bearer <token>` |
| `PUT` | `/api/auth/profile` | Private | Update user profile info | `{ name, bio, avatar }` |

### 2. Blog Posts Endpoints (`/api/posts`)

| Method | Endpoint | Access | Description | Query / Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | List posts with search & filters | Query: `?search=&category=&sort=newest\|oldest&page=1` |
| `GET` | `/api/posts/categories` | Public | Get list of distinct categories | None |
| `GET` | `/api/posts/user/me` | Private | Get current user's posts & stats | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/posts/:id` | Public | Get post details & comments | Params: `:id` (Post ID) |
| `POST` | `/api/posts` | Private | Create a new blog post | `{ title, content, coverImage, category, tags }` |
| `PUT` | `/api/posts/:id` | Private (Owner) | Update an existing post | `{ title, content, coverImage, category, tags }` |
| `DELETE` | `/api/posts/:id` | Private (Owner) | Delete post & associated comments | Params: `:id` (Post ID) |

### 3. Comments Endpoints (`/api/posts/:postId/comments` & `/api/comments`)

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/posts/:postId/comments` | Public | Get all comments on a post | None |
| `POST` | `/api/posts/:postId/comments` | Private | Add comment to a post | `{ content }` |
| `PUT` | `/api/comments/:id` | Private (Owner) | Edit comment | `{ content }` |
| `DELETE` | `/api/comments/:id` | Private (Owner) | Delete comment | None |

---

## 🧪 Testing Checklist & Verification Flow

You can verify the complete end-to-end functionality using this flow:

- [x] **User Registration**: Register a new user (`POST /api/auth/register`) with matching passwords.
- [x] **User Login**: Log in with demo account (`alex@example.com` / `Password123!`).
- [x] **Create Post**: Publish an article with title, category, tags, cover image, and content.
- [x] **Explore & Search**: Search posts in real time and filter by category pills.
- [x] **View Post**: Open post detail page, observe author bio, reading time, and content.
- [x] **Comment Section**: Add a comment, observe immediate list update.
- [x] **Comment Authorization**: Edit comment inline; log in with a different user and verify edit/delete buttons are hidden and API returns `403 Forbidden` if manipulated.
- [x] **Post Authorization**: Verify only the author can see Edit and Delete buttons on the post detail page and dashboard.
- [x] **Cascade Deletion**: Delete a post and verify its comments are cleaned up.
- [x] **Session Persistence**: Refresh the browser while logged in and verify state is maintained.
- [x] **Log Out**: Log out and verify redirection and state cleanup.

---

## 🔮 Future Enhancements
* Rich Text / WYSIWYG Editor (TipTap or Quill integration)
* Direct image uploads with Cloudinary / AWS S3
* Post bookmarks and reading list
* Claps / Likes reactions system
* Real-time notifications via WebSockets

---

## 📄 License
This project is licensed under the MIT License.
