# Frontend Activity — Book Library (Parts 1 & 2)


- [Part 1 — CRUD API (Iterations 0–5)](#part-1--crud-front-end)
- [Part 2 — Authentication & Route Protection (Iterations 6–7)](#part-2--authentication--route-protection)


---

# Part 1 — CRUD Front-End

## Overview

In this activity you will connect a **React** front-end to an **Express + MongoDB** back-end.  
By the end you will have a working app that can **Create, Read, Update and Delete** (CRUD) books — all through regular (non-protected) API routes. No authentication is involved.

**How to use this project:**

| Folder | Purpose |
|---|---|
| `backend/` | The fully working Express API. You do **not** need to change anything here. |
| `frontend/` | Your **starting point**. Copy this folder and work inside the copy. |


### What You Will Learn

- How to send HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) from React to an Express API using `fetch`.
- How to use **controlled inputs** (form values stored in React state with `useState`).
- How to fetch data when a component mounts using `useEffect`.
- How to use React Router (`Routes`, `Route`, `Link`, `useParams`, `useNavigate`) for navigation.
- How to structure a React app with **pages** and **components**.

### Activity Structure

There are **5 iterations** (plus a setup step). Each iteration adds one CRUD feature:

| Iteration | Feature | HTTP Method | Files You Will Change |
|---|---|---|---|
| 0 | Setup | — | — |
| 1 | Add a book | `POST` | `AddBookPage.jsx` |
| 2 | List all books | `GET` | `HomePage.jsx`, `BookListings.jsx`, `BookListing.jsx` |
| 3 | View one book | `GET` | `App.jsx`, `BookListing.jsx`, `BookPage.jsx` |
| 4 | Delete a book | `DELETE` | `BookPage.jsx` |
| 5 | Edit a book | `PUT` | `App.jsx`, `BookPage.jsx`, `EditBookPage.jsx` |

> **Important:** Commit your work after each iteration.

### Commit Messages (Best Practice)

Use small commits that describe *what* changed. Recommended format:

- `feat(add-book): send POST request from AddBookPage form`
- `feat(list-books): fetch and display all books on HomePage`
- `refactor(book-listing): accept book prop and display data`
- `chore: install dependencies`

Rule of thumb: one commit = one idea you can explain in one sentence.

---

## The Backend API (Reference)

The backend is already built. Here is everything you need to know about it.

**Base URL:** `http://localhost:4000`  
(The Vite proxy in `vite.config.js` forwards any request starting with `/api` to this URL, so in your React code you only write `/api/books`.)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/books` | Create a new book | JSON (see below) |
| `GET` | `/api/books` | Get all books | — |
| `GET` | `/api/books/:bookId` | Get a single book by ID | — |
| `PUT` | `/api/books/:bookId` | Update a book by ID | JSON (see below) |
| `DELETE` | `/api/books/:bookId` | Delete a book by ID | — |

**Book JSON shape** (what the API expects and returns):

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "publisher": "Scribner",
  "genre": "Fiction",
  "availability": {
    "isAvailable": true,
    "dueDate": null,
    "borrower": ""
  }
}
```

> **Tip:** You can test the API with a tool such as VS Code REST Client, Postman, or `curl` before writing any React code. That way you will know exactly what the API returns.

---

## Instructions

### Iteration 0: Setup

1. Clone [the starter repository](https://github.com/tx00-resources-en/week6-fepp-option-b) into a separate folder.
   - After cloning, **delete** the `.git` directory so you can start your own Git history (`git init`).

2. **Start the backend:**
   ```bash
   cd backend
   cp .env.example .env      # create your .env file (edit MONGO_URI if needed)
   npm install
   npm run dev
   ```
   You should see `Server running on port 4000` and `MongoDB Connected`.

3. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

**You are done with Iteration 0 when:**

- The backend is running on `http://localhost:4000`.
- The frontend is running on `http://localhost:5173`.
- You can see the basic UI (Navbar with "Home" and "Add Book" links).

**Commit:** `chore: install dependencies and set up project`

---

### Iteration 1: Add a Book (`POST`)

**Goal:** Make the "Add Book" form actually save a new book to the database.

**File to change:** `src/pages/AddBookPage.jsx`

Right now the form is there but nothing happens when you press "Add Book" — the `submitForm` function only logs to the console and the inputs are not connected to state.

**What to do:**

1. **Create state for each form field** using `useState`:
   ```jsx
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const [isbn, setIsbn] = useState("");
   const [publisher, setPublisher] = useState("");
   const [genre, setGenre] = useState("");
   const [isAvailable, setIsAvailable] = useState("true");
   const [dueDate, setDueDate] = useState("");
   const [borrower, setBorrower] = useState("");
   ```

2. **Connect each input to its state** (controlled inputs). For example:
   ```jsx
   <input
     type="text"
     required
     value={title}
     onChange={(e) => setTitle(e.target.value)}
   />
   ```
   Do the same for every `<input>` and `<select>` in the form, including the new `publisher`, `genre`, and `dueDate` fields.

3. **Write an `addBook` function** that sends a POST request:
   ```jsx
   const addBook = async (newBook) => {
     try {
       const res = await fetch("/api/books", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newBook),
       });
       if (!res.ok) throw new Error("Failed to add book");
     } catch (error) {
       console.error(error);
     }
   };
   ```

4. **Update `submitForm`** to build a book object from the state and call `addBook`, then navigate home:
   ```jsx
   import { useNavigate } from "react-router-dom";
   // inside the component:
   const navigate = useNavigate();

   const submitForm = (e) => {
     e.preventDefault();
     const newBook = {
       title,
       author,
       isbn,
       publisher,
       genre,
       availability: {
         isAvailable: isAvailable === "true",
         dueDate: dueDate || null,
         borrower,
       },
     };
     addBook(newBook);
     navigate("/");
   };
   ```

   > **Note:** The `isAvailable` state is a string (`"true"` or `"false"`) because HTML `<select>` values are always strings. We convert it to a boolean with `isAvailable === "true"` when building the request body.

5. **Add the new form fields** to the JSX. Your form should include inputs for `publisher`, `genre`, a date picker for `dueDate`, and the existing `borrower` field. For example:
   ```jsx
   <label>Publisher:</label>
   <input
     type="text"
     required
     value={publisher}
     onChange={(e) => setPublisher(e.target.value)}
   />
   <label>Genre:</label>
   <input
     type="text"
     required
     value={genre}
     onChange={(e) => setGenre(e.target.value)}
   />
   <label>Due Date:</label>
   <input
     type="date"
     value={dueDate}
     onChange={(e) => setDueDate(e.target.value)}
   />
   ```

> **Note:** A sample solution is available at [step1/src/pages/AddBookPage.jsx](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step1/src/pages/AddBookPage.jsx), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The structure and patterns are otherwise identical — only the fields differ.

**You are done with Iteration 1 when:**

- You fill in the form and click "Add Book".
- The page navigates back to Home.
- If you check MongoDB (e.g., MongoDB Compass or the API with `GET /api/books`), the new book is there with `publisher`, `genre`, and `availability.dueDate` saved.

> **Note:** The home page does not show books yet — that is the next iteration.

**Commit:** `feat(add-book): send POST request from AddBookPage form`

---

### Iteration 2: Fetch and Display All Books (`GET`)

**Goal:** When the Home page loads, fetch all books from the API and display them as a list.

**Files to change:** `src/pages/HomePage.jsx`, `src/components/BookListings.jsx`, `src/components/BookListing.jsx`

#### Step A — Fetch books in `HomePage.jsx`

1. Import `useState` and `useEffect` from React.
2. Create three pieces of state:
   ```jsx
   const [books, setBooks] = useState(null);
   const [isPending, setIsPending] = useState(true);
   const [error, setError] = useState(null);
   ```
3. Use `useEffect` to fetch books when the component mounts:
   ```jsx
   useEffect(() => {
     const fetchBooks = async () => {
       try {
         const res = await fetch("/api/books");
         if (!res.ok) throw new Error("Could not fetch books");
         const data = await res.json();
         setBooks(data);
         setIsPending(false);
       } catch (err) {
         setError(err.message);
         setIsPending(false);
       }
     };
     fetchBooks();
   }, []);
   ```
4. Render loading, error, and success states:
   ```jsx
   return (
     <div className="home">
       {error && <div>{error}</div>}
       {isPending && <div>Loading...</div>}
       {books && <BookListings books={books} />}
     </div>
   );
   ```

#### Step B — Accept and map books in `BookListings.jsx`

The component currently renders a single hard-coded `<BookListing />`. Change it to accept a `books` prop and map over the array:

```jsx
const BookListings = ({ books }) => {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookListing key={book.id} book={book} />
      ))}
    </div>
  );
};
```

#### Step C — Display book data in `BookListing.jsx`

Accept a `book` prop and display the actual values, including the new `publisher` and `genre` fields:

```jsx
const BookListing = ({ book }) => {
  return (
    <div className="book-preview">
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Genre: {book.genre}</p>
      <p>Available: {book.availability.isAvailable ? "Yes" : "No"}</p>
    </div>
  );
};
```

> **Note:** A sample solution is available at [step2](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step2/), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The fetching and rendering patterns are otherwise identical — only the displayed fields differ.

**Compare your solution with the sample:**

- Where is the books state stored?
- When does `fetch` run? (Hint: only once, on mount — because of the `[]` dependency array.)
- How do you handle loading and error states?

**You are done with Iteration 2 when:**

- The Home page shows all books from the database, including `publisher` and `genre`.
- When you add a new book (Iteration 1) and navigate back to Home, the new book appears in the list (the page re-fetches on mount).

**Commit:** `feat(list-books): fetch and display all books on HomePage`

---

### Iteration 3: View a Single Book (`GET` one)

**Goal:** Click a book in the list to open a detail page that shows all its information.

**Files to change:** `src/App.jsx`, `src/components/BookListing.jsx`, `src/pages/BookPage.jsx`

#### Step A — Add a new route in `App.jsx`

Import `BookPage` and add a route for it:

```jsx
import BookPage from "./pages/BookPage";
// inside <Routes>:
<Route path="/books/:id" element={<BookPage />} />
```

The `:id` is a **URL parameter**. React Router will match URLs like `/books/abc123` and make `abc123` available via the `useParams` hook.

#### Step B — Link each book to its detail page in `BookListing.jsx`

Import `Link` from `react-router-dom` and wrap the book title:

```jsx
import { Link } from "react-router-dom";

// inside the return:
<Link to={`/books/${book.id}`}>
  <h2>{book.title}</h2>
</Link>
```

> **Why `Link` instead of `<a href>`?** `<Link>` navigates without a full page reload, keeping React state alive. `<a href>` reloads the entire page.

#### Step C — Fetch and display the book in `BookPage.jsx`

1. Import `useParams`, `useNavigate`, `useEffect`, and `useState`.
2. Get the `id` from the URL and fetch the single book:
   ```jsx
   const { id } = useParams();
   const [book, setBook] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
     const fetchBook = async () => {
       try {
         const res = await fetch(`/api/books/${id}`);
         if (!res.ok) throw new Error("Network response was not ok");
         const data = await res.json();
         setBook(data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     fetchBook();
   }, [id]);
   ```
3. Display loading, error, and book data — include all fields: `title`, `author`, `isbn`, `publisher`, `genre`, `availability.isAvailable`, `availability.dueDate`, and `availability.borrower`:
   ```jsx
   {book && (
     <div>
       <h2>{book.title}</h2>
       <p>Author: {book.author}</p>
       <p>ISBN: {book.isbn}</p>
       <p>Publisher: {book.publisher}</p>
       <p>Genre: {book.genre}</p>
       <p>Available: {book.availability.isAvailable ? "Yes" : "No"}</p>
       <p>Due Date: {book.availability.dueDate
         ? new Date(book.availability.dueDate).toLocaleDateString()
         : "—"}
       </p>
       <p>Borrower: {book.availability.borrower || "—"}</p>
     </div>
   )}
   ```
4. Add a "Back" button:
   ```jsx
   const navigate = useNavigate();
   // inside the return:
   <button onClick={() => navigate("/")}>Back</button>
   ```

> **Note:** A sample solution is available at [step3](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step3/), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The fetching and routing patterns are otherwise identical — only the displayed fields differ.

**You are done with Iteration 3 when:**

- You can click a book title on the Home page and see all its details (including `publisher`, `genre`, and `dueDate`) on a dedicated page.
- The "Back" button returns you to the Home page.

**Commit:** `feat(book-page): add route and fetch single book by id`

**Discussion Questions:**

- What is the difference between a **page** and a **component** in this app?
- Why do we pass `[id]` as the dependency array in `useEffect`?

---

### Iteration 4: Delete a Book (`DELETE`)

**Goal:** Add a "Delete" button to the book detail page that removes the book from the database.

**File to change:** `src/pages/BookPage.jsx`

The route and the detail page already exist from Iteration 3. You only need to add delete functionality.

**What to do:**

1. **Write a `deleteBook` function:**
   ```jsx
   const deleteBook = async (bookId) => {
     try {
       const res = await fetch(`/api/books/${bookId}`, {
         method: "DELETE",
       });
       if (!res.ok) throw new Error("Failed to delete book");
     } catch (error) {
       console.error("Error deleting book:", error);
     }
   };
   ```

2. **Write a click handler** with a confirmation dialog:
   ```jsx
   const onDeleteClick = (bookId) => {
     const confirm = window.confirm("Are you sure you want to delete this book?");
     if (!confirm) return;
     deleteBook(bookId);
     navigate("/");
   };
   ```

3. **Add a "Delete" button** in the JSX (next to or instead of the "Back" button):
   ```jsx
   <button onClick={() => onDeleteClick(book._id)}>Delete</button>
   ```

> **Note:** A sample solution is available at [step4](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step4/), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The delete logic is otherwise identical.

**You are done with Iteration 4 when:**

- You click "Delete" on a book detail page.
- A confirmation dialog appears.
- After confirming, the app navigates to Home and the deleted book is no longer in the list.

**Commit:** `feat(book-page): add delete button with confirmation dialog`

---

### Iteration 5: Edit a Book (`PUT`)

**Goal:** Add an "Edit" button on the book detail page that opens a pre-filled form. Submitting the form updates the book in the database.

**Files to change:** `src/App.jsx`, `src/pages/BookPage.jsx`, `src/pages/EditBookPage.jsx`

#### Step A — Add a new route in `App.jsx`

Import `EditBookPage` and add a route:

```jsx
import EditBookPage from "./pages/EditBookPage";
// inside <Routes>:
<Route path="/edit-book/:id" element={<EditBookPage />} />
```

#### Step B — Add an "Edit" button in `BookPage.jsx`

Add a button that navigates to the edit page:

```jsx
<button onClick={() => navigate(`/edit-book/${book._id}`)}>Edit</button>
```

#### Step C — Build the edit form in `EditBookPage.jsx`

This is the most complex page. It combines patterns you already used in earlier iterations:

1. **Get the `id` from the URL** with `useParams` (same pattern as `BookPage`).

2. **Create state for each form field** with `useState`:
   ```jsx
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const [isbn, setIsbn] = useState("");
   const [publisher, setPublisher] = useState("");
   const [genre, setGenre] = useState("");
   const [isAvailable, setIsAvailable] = useState("true");
   const [dueDate, setDueDate] = useState("");
   const [borrower, setBorrower] = useState("");
   ```

3. **Fetch the existing book** and **pre-fill the form** — after fetching, set each state variable to the fetched value:
   ```jsx
   useEffect(() => {
     const fetchBook = async () => {
       const res = await fetch(`/api/books/${id}`);
       const data = await res.json();
       setTitle(data.title);
       setAuthor(data.author);
       setIsbn(data.isbn);
       setPublisher(data.publisher);
       setGenre(data.genre);
       setIsAvailable(data.availability.isAvailable ? "true" : "false");
       setDueDate(
         data.availability.dueDate
           ? data.availability.dueDate.split("T")[0]
           : ""
       );
       setBorrower(data.availability.borrower || "");
     };
     fetchBook();
   }, [id]);
   ```

   > **Note:** `dueDate.split("T")[0]` extracts just the `YYYY-MM-DD` part from the ISO date string so it can be pre-filled into an `<input type="date">`.

4. **Write an `updateBook` function** that sends a PUT request:
   ```jsx
   const updateBook = async (updatedBook) => {
     try {
       const res = await fetch(`/api/books/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(updatedBook),
       });
       if (!res.ok) throw new Error("Failed to update book");
       return true;
     } catch (error) {
       console.error("Error updating book:", error);
       return false;
     }
   };
   ```

5. **Handle form submission:**
   ```jsx
   const submitForm = (e) => {
     e.preventDefault();
     const updatedBook = {
       title,
       author,
       isbn,
       publisher,
       genre,
       availability: {
         isAvailable: isAvailable === "true",
         dueDate: dueDate || null,
         borrower,
       },
     };
     updateBook(updatedBook);
     navigate(`/books/${id}`);
   };
   ```

6. **Render the form** — this is almost identical to `AddBookPage`, including all the new fields (`publisher`, `genre`, `dueDate`), but with an "Update Book" button and a loading check before the form renders.

> **Note:** A sample solution is available at [step5](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step5/), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The structure and patterns are otherwise identical — only the fields differ.

**You are done with Iteration 5 when:**

- You can click "Edit" on a book detail page.
- The edit form opens with all current values pre-filled, including `publisher`, `genre`, and `dueDate`.
- After submitting, you are redirected to the detail page showing the updated data.
- The updated data also appears correctly in the books list on the Home page.

**Commit:** `feat(edit-book): add route and pre-filled edit form with PUT request`

---

## Part 1 Summary

Congratulations! You have built a complete front-end with all CRUD features:

| Operation | HTTP Method | Page / Component |
|---|---|---|
| Create | `POST` | `AddBookPage.jsx` |
| Read all | `GET` | `HomePage.jsx`, `BookListings.jsx`, `BookListing.jsx` |
| Read one | `GET` | `BookPage.jsx` |
| Update | `PUT` | `EditBookPage.jsx` |
| Delete | `DELETE` | `BookPage.jsx` |

**Next steps to explore:**
- Show a loading spinner instead of plain "Loading…" text
- Handle and display form validation errors from the API
- Add authentication (covered in Part 2!)

---

# Part 2 — Authentication & Route Protection

## Overview

In Part 1 you built a full CRUD front-end for books using the **unprotected** `backend/` API.  
In Part 2 you will add **user registration & login** (Iteration 6) and then **protect routes** so that only logged-in users can create, edit, or delete books (Iteration 7).

**How to use this project:**

| Folder | Purpose |
|---|---|
| `backend-auth/` | Express API with user signup/login endpoints. No route protection. |
| `backend-protect/` | Express API with user signup/login **and** `requireAuth` middleware on POST/PUT/DELETE book routes. |
| `frontend/step5/` | Your **starting point** for Iteration 6. Copy this folder and work inside the copy. |
| `frontend/step6/` | Sample solution for Iteration 6. Only look at it **after** you have tried on your own. |
| `frontend/step7/` | Sample solution for Iteration 7. Only look at it **after** you have tried on your own. |

### What You Will Learn

- How to manage form state with `useState` and handle form submissions with `fetch`.
- How to store a JWT token in `localStorage` and read it back on page load.
- How to add `Authorization: Bearer <token>` headers to protected API requests.
- How to **conditionally render** UI elements (Navbar links, Edit/Delete buttons) based on authentication state.
- How to **protect client-side routes** using `<Navigate>` from React Router.

### Activity Structure

| Iteration | Feature | Backend Used | New / Changed Files |
|---|---|---|---|
| 6 | User signup & login | `backend-auth/` | `Signup.jsx`, `Login.jsx`, `Navbar.jsx`, `App.jsx` |
| 7 | Route protection & token headers | `backend-protect/` | `App.jsx`, `Navbar.jsx`, `Signup.jsx`, `Login.jsx`, `BookPage.jsx`, `AddBookPage.jsx`, `EditBookPage.jsx` |

> **Important:** Commit your work after each iteration.

---

## The Backend APIs (Reference)

### `backend-auth/` — Authentication Endpoints (Iteration 6)

This backend is identical to `backend/` but adds **user routes**. All book routes remain **unprotected**.

**Base URL:** `http://localhost:4000`

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/users/signup` | Register a new user | JSON (see below) |
| `POST` | `/api/users/login` | Log in an existing user | JSON (see below) |
| `GET` | `/api/books` | Get all books | — |
| `GET` | `/api/books/:bookId` | Get a single book | — |
| `POST` | `/api/books` | Create a book | JSON |
| `PUT` | `/api/books/:bookId` | Update a book | JSON |
| `DELETE` | `/api/books/:bookId` | Delete a book | — |

**Signup body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "phone_number": "040-1234567",
  "gender": "Female",
  "date_of_birth": "1995-06-15",
  "membership_status": "Active"
}
```

**Login body:**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Successful response (both signup and login):**

```json
{
  "email": "jane@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The `token` is a JWT. You will store it in `localStorage` and send it in request headers in Iteration 7.

**Book JSON shape** (unchanged from Part 1):

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "publisher": "Scribner",
  "genre": "Fiction",
  "availability": {
    "isAvailable": true,
    "dueDate": null,
    "borrower": ""
  }
}
```

### `backend-protect/` — Protected Book Routes (Iteration 7)

This backend is identical to `backend-auth/` except that **creating, updating, and deleting** books requires a valid JWT in the `Authorization` header.

| Method | Endpoint | Protected? | Required Header |
|---|---|---|---|
| `GET` | `/api/books` | No | — |
| `GET` | `/api/books/:bookId` | No | — |
| `POST` | `/api/books` | **Yes** | `Authorization: Bearer <token>` |
| `PUT` | `/api/books/:bookId` | **Yes** | `Authorization: Bearer <token>` |
| `DELETE` | `/api/books/:bookId` | **Yes** | `Authorization: Bearer <token>` |
| `POST` | `/api/users/signup` | No | — |
| `POST` | `/api/users/login` | No | — |

If a protected route is called without a valid token, the API responds with:

```json
{ "error": "Authorization token required" }
```

---

## Instructions

### Iteration 6: User Signup & Login (`POST`)

**Goal:** Add signup, login, and logout functionality. After signing up or logging in, the user's email and JWT token are saved to `localStorage`. The Navbar shows links to Login and Signup pages and a Log out button.

**Backend to use:** Stop the old backend and start `backend-auth/`:

```bash
cd backend-auth
cp .env.example .env      # create your .env file (edit MONGO_URI / SECRET if needed)
npm install
npm run dev
```

**New files to create:** `src/pages/Signup.jsx`, `src/pages/Login.jsx`  
**Files to change:** `src/App.jsx`, `src/components/Navbar.jsx`

#### Step A — Create the Signup page

Create `src/pages/Signup.jsx`. This page uses `useState` for each form field and sends a POST request to the signup endpoint. On success, the returned user (email + token) is saved to `localStorage`:

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [error, setError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        phone_number: phoneNumber,
        gender,
        date_of_birth: dateOfBirth,
        membership_status: membershipStatus,
      }),
    });
    const user = await response.json();

    if (!response.ok) {
      setError(user.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    console.log("success");
    navigate("/");
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email address:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <label>Gender:</label>
        <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
        <label>Date of Birth:</label>
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        <label>Membership Status:</label>
        <input type="text" value={membershipStatus} onChange={(e) => setMembershipStatus(e.target.value)} />
        <button>Sign up</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
```

> **Key concept:** `localStorage.setItem("user", JSON.stringify(user))` saves the object `{ email, token }` so it persists across page refreshes. You can read it back later with `JSON.parse(localStorage.getItem("user"))`.

#### Step B — Create the Login page

Create `src/pages/Login.jsx`:

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const user = await response.json();

    if (!response.ok) {
      setError(user.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    console.log("success");
    navigate("/");
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Email address:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Log in</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
```

#### Step C — Update `App.jsx` to add auth routes

Import the new pages and add routes for `/signup` and `/login`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddBookPage from "./pages/AddBookPage";
import BookPage from "./pages/BookPage";
import EditBookPage from "./pages/EditBookPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/books/add-book" element={<AddBookPage />} />
            <Route path="/edit-book/:id" element={<EditBookPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
```

> **What changed compared to step 5?**
> - Imported `Navigate`, `Login`, and `Signup`.
> - Added two new `<Route>` entries for `/signup` and `/login`.

#### Step D — Update `Navbar.jsx` with Login, Signup, and Logout links

Replace the old Navbar with one that shows Login/Signup links and a Log out button:

```jsx
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleClick = () => {
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Book Library</h1>
      </Link>
      <div className="links">
        <div>
          <Link to="/books/add-book">Add Book</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <button onClick={handleClick}>Log out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

> **What changed compared to step 5?**
> - Changed `<a>` tags to `<Link>` components (no full page reload).
> - Added Login and Signup links.
> - Added a Log out button that removes the user from `localStorage`.

> **Note:** A sample solution is available at [step6](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step6/), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The authentication and routing logic is otherwise identical.

**You are done with Iteration 6 when:**

- You can open the Signup page, fill in all fields, and click "Sign up".
- After signing up, you are redirected to the Home page.
- If you open your browser's DevTools → Application → Local Storage, you can see a `user` key containing `{ "email": "...", "token": "..." }`.
- You can open the Login page, enter the email and password, and log in successfully.
- Clicking "Log out" removes the `user` entry from Local Storage.
- All CRUD operations (add, list, view, edit, delete books) still work as before.

**Commit:** `feat(auth): add Signup and Login pages with localStorage and Navbar links`

**Discussion Questions:**

- Why do we store the token in `localStorage` instead of React state?
- What happens if the API returns an error during signup? How does the component handle it?

---

### Iteration 7: Protect Routes (`Authorization` header + conditional rendering)

**Goal:** Only logged-in users can add, edit, or delete books. The Navbar adapts based on authentication state — showing the user's email and a Log out button when logged in, or Login/Signup links when logged out. Protected pages redirect unauthenticated users to the Signup page.

**Backend to use:** Stop `backend-auth/` and start `backend-protect/`:

```bash
cd backend-protect
cp .env.example .env      # create your .env file (edit MONGO_URI / SECRET if needed)
npm install
npm run dev
```

> **What is different in `backend-protect/`?** The book router now uses a `requireAuth` middleware on POST, PUT, and DELETE. Any request to these endpoints **must** include an `Authorization: Bearer <token>` header, or it will be rejected with a 401 error.

**Files to change:** `src/App.jsx`, `src/components/Navbar.jsx`, `src/pages/Signup.jsx`, `src/pages/Login.jsx`, `src/pages/BookPage.jsx`, `src/pages/AddBookPage.jsx`, `src/pages/EditBookPage.jsx`

#### Step A — Add `isAuthenticated` state to `App.jsx`

The app needs to know whether a user is logged in. We store this in a top-level state variable, initialized from `localStorage` so it survives page refreshes:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddBookPage from "./pages/AddBookPage";
import BookPage from "./pages/BookPage";
import EditBookPage from "./pages/EditBookPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/books/:id"
              element={<BookPage isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/books/add-book"
              element={
                isAuthenticated ? <AddBookPage /> : <Navigate to="/signup" />
              }
            />
            <Route
              path="/edit-book/:id"
              element={
                isAuthenticated ? <EditBookPage /> : <Navigate to="/signup" />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
```

> **What changed compared to step 6?**
> - Added `isAuthenticated` state initialized from `localStorage`.
> - `Navbar` receives `isAuthenticated` and `setIsAuthenticated` as props.
> - `BookPage` receives `isAuthenticated` to conditionally show Edit/Delete buttons.
> - `AddBookPage` and `EditBookPage` routes redirect to `/signup` if not authenticated.
> - `Signup` and `Login` routes redirect to `/` if already authenticated.
> - `Signup` and `Login` receive `setIsAuthenticated` so they can update it on success.

> **Why `<Navigate to="/signup" />`?** This is React Router's way of doing a redirect. If a non-authenticated user tries to visit `/books/add-book`, they are immediately taken to the Signup page instead.

#### Step B — Update `Navbar.jsx` for conditional rendering

The Navbar should show different links depending on whether the user is logged in:

```jsx
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleClick = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Book Library</h1>
      </Link>
      <div className="links">
        {isAuthenticated && (
          <div>
            <Link to="/books/add-book">Add Book</Link>
            <span>{JSON.parse(localStorage.getItem("user")).email}</span>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

> **What changed compared to step 6?**
> - Accepts `isAuthenticated` and `setIsAuthenticated` props.
> - When authenticated: shows "Add Book" link, the user's email, and a "Log out" button.
> - When not authenticated: shows "Login" and "Signup" links only.
> - `handleClick` now also calls `setIsAuthenticated(false)` to re-render the entire app.

#### Step C — Update `Signup.jsx` to set authentication state

Accept `setIsAuthenticated` as a prop and call it after a successful signup:

```jsx
const Signup = ({ setIsAuthenticated }) => {
  // ... same as step 6 ...
```

Inside `handleFormSubmit`, after `localStorage.setItem(...)`, add:

```jsx
    localStorage.setItem("user", JSON.stringify(user));
    console.log("success");
    setIsAuthenticated(true);   // <-- ADD THIS LINE
    navigate("/");
```

#### Step D — Update `Login.jsx` to set authentication state

Same pattern — accept `setIsAuthenticated` as a prop:

```jsx
const Login = ({ setIsAuthenticated }) => {
  // ... same as step 6 ...
```

Inside `handleFormSubmit`, after `localStorage.setItem(...)`, add:

```jsx
    localStorage.setItem("user", JSON.stringify(user));
    console.log("success");
    setIsAuthenticated(true);   // <-- ADD THIS LINE
    navigate("/");
```

#### Step E — Send the token when adding a book (`AddBookPage.jsx`)

The `backend-protect/` API requires a JWT in the `Authorization` header for POST requests. Read the token from `localStorage` and include it in the `fetch` call. The book object must also include the new `publisher`, `genre`, and `dueDate` fields:

1. **Read the token** at the top of the component:
   ```jsx
   const user = JSON.parse(localStorage.getItem("user"));
   const token = user ? user.token : null;
   ```

2. **Add the `Authorization` header** to the `addBook` function:
   ```jsx
   const addBook = async (newBook) => {
     try {
       const res = await fetch("/api/books", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,    // <-- ADD THIS
         },
         body: JSON.stringify(newBook),
       });
       if (!res.ok) throw new Error("Failed to add book");
       return true;
     } catch (error) {
       console.error("Error adding book:", error);
       return false;
     }
   };
   ```

3. Make sure `submitForm` still builds a book object that includes `publisher`, `genre`, and `dueDate` (same as Iteration 1 of Part 1).

#### Step F — Send the token when deleting a book and conditionally show buttons (`BookPage.jsx`)

1. **Accept the `isAuthenticated` prop:**
   ```jsx
   const BookPage = ({ isAuthenticated }) => {
   ```

2. **Read the token** at the top of the component:
   ```jsx
   const user = JSON.parse(localStorage.getItem("user"));
   const token = user ? user.token : null;
   ```

3. **Add the `Authorization` header** to the `deleteBook` function:
   ```jsx
   const deleteBook = async (bookId) => {
     try {
       const res = await fetch(`/api/books/${bookId}`, {
         method: "DELETE",
         headers: {
           Authorization: `Bearer ${token}`,    // <-- ADD THIS
         },
       });
       if (!res.ok) throw new Error("Failed to delete book");
       navigate("/");
     } catch (error) {
       console.error("Error deleting book:", error);
     }
   };
   ```

4. **Conditionally render** the Edit and Delete buttons — only show them when authenticated:
   ```jsx
   {isAuthenticated && (
     <>
       <button onClick={() => navigate(`/edit-book/${book._id}`)}>Edit</button>
       <button onClick={() => onDeleteClick(book._id)}>Delete</button>
     </>
   )}
   ```

#### Step G — Send the token when updating a book (`EditBookPage.jsx`)

Same pattern as `AddBookPage`. The book object must also include `publisher`, `genre`, and `dueDate`:

1. **Read the token:**
   ```jsx
   const user = JSON.parse(localStorage.getItem("user"));
   const token = user ? user.token : null;
   ```

2. **Add the `Authorization` header** to the `updateBook` function:
   ```jsx
   const updateBook = async (book) => {
     try {
       const res = await fetch(`/api/books/${id}`, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,    // <-- ADD THIS
         },
         body: JSON.stringify(book),
       });
       if (!res.ok) throw new Error("Failed to update book");
       return true;
     } catch (error) {
       console.error("Error updating book:", error);
       return false;
     }
   };
   ```

3. Make sure `submitForm` still builds a book object that includes `publisher`, `genre`, and `dueDate` (same as Iteration 5 of Part 1).

> **Note:** A sample solution is available at [step7](https://github.com/tx00-resources-en/w7-exam-practice-frontend/tree/main/book-app/frontend/step7/), but it was written for a slightly different book model (without `publisher`, `genre`, and `dueDate`). The authentication and token header patterns are otherwise identical — only the book fields differ.

**You are done with Iteration 7 when:**

- **Logged out:** The Navbar shows only "Login" and "Signup" links.
- **Logged out:** Visiting `/books/add-book` or `/edit-book/:id` redirects to `/signup`.
- **Logged out:** The book detail page does **not** show Edit or Delete buttons.
- **Logged out:** Already-authenticated users visiting `/signup` or `/login` are redirected to `/`.
- **Logged in:** The Navbar shows "Add Book", the user's email, and "Log out".
- **Logged in:** You can add, edit, and delete books (the API accepts the token).
- **Logged in:** Clicking "Log out" clears the user from `localStorage`, updates the Navbar, and re-applies route protection.
- Viewing and listing books (GET) still works for everyone — no token needed.

**Commit:** `feat(auth): add route protection, token headers, and conditional rendering`

**Discussion Questions:**

- What does the `Authorization: Bearer <token>` header do? Why doesn't the GET endpoint need it?
- What is the difference between **client-side route protection** (`<Navigate>`) and **server-side route protection** (`requireAuth` middleware)? Do you need both?
- Why do we initialize `isAuthenticated` with a function (`useState(() => { ... })`) instead of just `useState(false)`?
- What happens if a user manually deletes the token from `localStorage` while the app is open?

---

## Part 2 Summary

Congratulations! You have extended the Book Library front-end with authentication and route protection:

| Feature | Logged Out | Logged In |
|---|---|---|
| View book list | ✅ | ✅ |
| View book detail | ✅ | ✅ |
| Add a book | ❌ → redirect to `/signup` | ✅ |
| Edit a book | ❌ → redirect to `/signup` | ✅ |
| Delete a book | ❌ button hidden | ✅ |
| Signup / Login pages | ✅ | ❌ → redirect to `/` |

**What changed from Part 1:**

| File | Change |
|---|---|
| `src/App.jsx` | Added `isAuthenticated` state; added `/signup` and `/login` routes; added protected route redirects |
| `src/components/Navbar.jsx` | Conditionally renders links based on auth state |
| `src/pages/Signup.jsx` | **New** — Signup form with `localStorage` save |
| `src/pages/Login.jsx` | **New** — Login form with `localStorage` save |
| `src/pages/AddBookPage.jsx` | Reads token from `localStorage`; sends `Authorization` header |
| `src/pages/EditBookPage.jsx` | Reads token from `localStorage`; sends `Authorization` header |
| `src/pages/BookPage.jsx` | Reads token; conditionally shows Edit/Delete; sends `Authorization` header on delete |

**Next steps to explore:**
- Restrict edit and delete so users can only modify **their own** books
- Add a profile page (`/profile`) that reads and displays `req.user` from a protected `GET /api/users/me` endpoint
- Add token expiry handling — detect 401 responses and automatically log the user out
- Write automated tests for auth flows with React Testing Library
