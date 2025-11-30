# Auth Architecture & Usage

This document explains the authentication design and implementation for the Voyago project (frontend + backend). It describes endpoints, payloads, token handling, middleware, frontend store usage, and how to test and debug the auth flow.

---

## Overview

- Auth type: JWT-based stateless authentication.
- Backend: Express + MongoDB (Mongoose) with password hashing (bcrypt) and JWT token generation (jsonwebtoken).
- Frontend: React with Zustand (`useAuthStore`) to manage auth state; user stored in `localStorage` for session persistence.
- Protected routes: Backend uses an `authMiddleware` to validate JWT and attach `req.user`.

---

## Backend

Relevant files:

- `server/server.js` - server entrypoint and middleware setup.
- `server/routes/auth.js` - exposes `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
- `server/controllers/authController.js` - `registerUser`, `loginUser`, `getMe` handlers.
- `server/models/user.js` - Mongoose user schema.
- `server/middleware/authMiddleware.js` - verifies JWT and attaches user to `req`.

### Environment variables

The server expects environment variables (set in `.env` or your host environment):

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret key used to sign JWTs
- `PORT` - optional server port (defaults to 5000 in many setups)

Do not commit these secrets to source control.

### Register flow (POST /api/auth/register)

- Request body: JSON `{ "name": "Alice", "email": "alice@example.com", "password": "s3cret" }`.
- Server steps:
  - Validate required fields.
  - Check for an existing user by email.
  - Hash password with bcrypt (e.g., `bcrypt.hash(password, saltRounds)`).
  - Save user document to MongoDB.
  - Generate JWT (e.g., `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })`).
  - Return 201 (or 200) with JSON: `{ _id, name, email, token }`.
- Common errors: 400 (missing fields), 409 (email already exists), 500 (server error).

### Login flow (POST /api/auth/login)

- Request body: JSON `{ "email": "alice@example.com", "password": "s3cret" }`.
- Server steps:
  - Validate request fields.
  - Find user by email.
  - Compare password with `bcrypt.compare`.
  - On success, generate and return `{ _id, name, email, token }`.
- Common errors: 400 (missing fields), 401 (invalid credentials), 500 (server error).

### Get current user (GET /api/auth/me)

- Protected endpoint — client must include `Authorization: Bearer <token>` header.
- Middleware verifies token, finds user (or uses decoded id), attaches `req.user`.
- Handler returns current user data (commonly `{ _id, name, email }`).

### authMiddleware (high level)

- Reads `Authorization` header.
- Extracts token (strip `Bearer ` prefix).
- Verifies token with `jwt.verify(token, JWT_SECRET)`.
- Optionally fetches user from DB using decoded id and attaches to `req.user`.
- On failure, returns 401.

---

## Frontend

Relevant files:

- `src/store/useAuthStore.js` - Zustand store: `user`, `isLoading`, `error`, and actions `register`, `login`, `logout`.
- `src/features/auth/components/RegisterForm.jsx` - UI form for registration.
- `src/features/auth/components/LoginForm.jsx` - UI form for login.
- `src/components/Modal/Modal.jsx` and `src/features/auth/components/AuthModal.module.css` - modal UI wrapping the forms.
- `src/store/useAppStore.js` - app-level store used to open/close auth modal.

### How the frontend stores the user

- After a successful register/login API call, the frontend stores the returned user object (including token) into `localStorage` under the key `user` (or similar). Example:

  `localStorage.setItem('user', JSON.stringify(user))`

- The Zustand `useAuthStore` keeps the `user` in state so React components can read auth status via `useAuthStore(state => state.user)`.
- On app startup, the store may hydrate state from `localStorage` so the user remains signed-in across page refreshes.

### API calls from frontend

- `register` action does a `POST /api/auth/register` with `{ name, email, password }` and expects `{ _id, name, email, token }` on success.
- `login` action does a `POST /api/auth/login` with `{ email, password }` and expects `{ _id, name, email, token }`.
- Protected API requests should include `Authorization: Bearer <token>` where `<token>` is `user.token` from store/localStorage.

### Example: `register` (pseudo implementation)

```js
// src/store/useAuthStore.js (conceptual)
async function register(name, email, password) {
  try {
    set({ isLoading: true });
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data, isLoading: false });
    useAppStore.getState().closeAuthModal();
    return data;
  } catch (err) {
    set({ error: err.message, isLoading: false });
    throw err;
  }
}
```

### Example: including token in requests

Use a helper that reads the user token and sets the header. For single requests:

```js
const token = JSON.parse(localStorage.getItem('user') || 'null')?.token;
axios.get('/api/protected', { headers: { Authorization: `Bearer ${token}` } });
```

Or configure an axios instance with an interceptor:

```js
axios.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
```

### UI behavior & validation

- `RegisterForm.jsx` performs client-side required-field validation before calling `register`.
- The project UI requires the user to accept terms (`agreed` checkbox) before enabling the register submit button.
- `RegisterForm.jsx` will call `useAuthStore.register` and handle `isLoading` state and errors from the store.
- On success, the auth modal is closed via `useAppStore` and `user` state is available in the app.

### Logout

- `logout` action typically clears `localStorage.removeItem('user')` and sets `user` to `null` in the store.
- UI components subscribed to the auth store update automatically.

---

## Example requests (curl / PowerShell)

PowerShell curl-like examples (Windows PowerShell):

Register:

```powershell
curl -Method POST -Uri http://localhost:5000/api/auth/register -Body (@{ name='Alice'; email='alice@example.com'; password='s3cret' } | ConvertTo-Json) -ContentType 'application/json'
```

Login:

```powershell
curl -Method POST -Uri http://localhost:5000/api/auth/login -Body (@{ email='alice@example.com'; password='s3cret' } | ConvertTo-Json) -ContentType 'application/json'
```

Get current user (protected):

```powershell
$token = 'REPLACE_WITH_TOKEN'
curl -Method GET -Uri http://localhost:5000/api/auth/me -Headers @{ Authorization = "Bearer $token" }
```

---

## Debugging & Common Issues

- 401 on protected endpoints: ensure the `Authorization` header is present and token not expired; verify `JWT_SECRET` is the same between token issuance and verification.
- 409 or "email already exists": occurs when attempting to register with an email that already exists in DB.
- CORS errors: ensure backend CORS allows frontend origin while developing.
- Token persisted but UI still shows logged out: ensure initial store hydration reads `localStorage` on load and sets `user` accordingly.
- Password hashing mismatch: ensure `bcrypt.compare` is used for login checks and same hashing rounds are used.

---

## Local dev instructions

Open two terminals (PowerShell). From project root:

Start backend:

```powershell
cd server; npm install; npm run start
```

Start frontend:

```powershell
cd ..; npm install; npm run dev
```

Adjust commands if your project uses different npm scripts (e.g., `npm run dev` or `npm run start` for server).

---

## Security Considerations

- Keep `JWT_SECRET` private and rotate/refresh tokens in production.
- Consider using HTTP-only secure cookies for tokens in production to mitigate XSS token theft.
- Enforce strong password policies and rate-limit auth endpoints to mitigate brute-force attacks.
- Add server-side validation and sanitization for all user-provided values.

---

## Files to inspect when modifying auth

- `server/controllers/authController.js`
- `server/routes/auth.js`
- `server/middleware/authMiddleware.js`
- `server/models/user.js`
- `src/store/useAuthStore.js`
- `src/features/auth/components/RegisterForm.jsx`
- `src/features/auth/components/LoginForm.jsx`

---

## Next steps / Enhancements

- Add refresh tokens for long-lived sessions.
- Replace localStorage with secure, httpOnly cookies for token storage in production.
- Add password reset flow (email + token verification).
- Add email verification during registration.

---

If you want, I can also:

- Generate an `AUTH.md` inside a `docs/` folder instead, or
- Add example `axios` interceptor code to `src/lib/api.js`, or
- Run the dev servers here and reproduce a sample register + login flow and report any issues.


