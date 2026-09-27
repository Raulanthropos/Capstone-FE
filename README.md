# Woof Paws Dog Adoption Webpage

Woof Paws connects people who want to adopt dogs with shelters and dogs looking
for homes. The original 2023 bootcamp application used the MERN stack. The
backend is being migrated to MySQL one feature at a time.

## Run locally

Use Node.js 24 LTS, matching Capstone-BE. Install dependencies with `npm ci`
if they are not already installed.

Start the MySQL container and backend from Capstone-BE first. Its API should
listen at `http://127.0.0.1:3001`. In this frontend directory:

```sh
npm start
```

Open `http://localhost:3000`. In PowerShell, use `npm.cmd` if execution policy
blocks `npm.ps1`.

All API requests use `src/api/client.js`. Its local default is
`http://127.0.0.1:3001`. To choose another backend, copy `.env.example` to
`.env.local` (or update an existing file) and set:

```dotenv
REACT_APP_API_URL=http://127.0.0.1:3001
```

Restart the frontend after changing this setting. It is a public, build-time
CRA setting; never place the backend JWT secret or database credentials here.
See the [CRA environment variable documentation](https://create-react-app.dev/docs/adding-custom-environment-variables/).

## Current local flow

Register a new account, then log in with its email and password. Registration
uses text-only FormData. Login completes only after both authentication and
the protected profile request succeed. Validation, duplicate-email, login,
and connection errors appear in the form.

MySQL users have no profile picture yet, so the interface uses an existing
local placeholder. Edit/Delete Profile and admin dog controls are temporarily
disabled while their backend endpoints await migration. Dog requests use the
local API and display a friendly message when the service returns 503.
Adoption submission is not connected to the new backend yet.

Sessions are stored under a new Redux Persist key scoped to the API URL.
Old Railway session data is not reused. On reload, the app verifies its saved
token through `GET /users/me` before showing authenticated screens. Expired
or unverified sessions are cleared. Logout clears the session in this browser;
it does not revoke the one-hour JWT on the server.

## Checks

```sh
npm test -- --watchAll=false --runInBand
npm run build
```

The UI tests cover register/login/profile/logout, rejected credentials, profile
lookup failures, saved sessions, and unavailable services using mocked HTTP
responses. Backend integration tests exercise the actual MySQL endpoints in
Capstone-BE. To test the full local flow manually, leave both servers running
and register through the browser; that account will be saved in MySQL.

For a deployed build, set `REACT_APP_API_URL` to the intended deployed API
before building, and ensure that API permits the frontend origin.
