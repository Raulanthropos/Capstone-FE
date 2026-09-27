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
Adoption requests now use `POST /adoptions` and `GET /adoptions/me`. Apply the
backend migration for `adoption_requests` before using this flow.

On the main page, choose a dog and confirm the named dog in the adoption
modal. The submit button is disabled while the request is in progress.
Only a confirmed server response changes that dog's card to **Pending review**.
The dog remains available while the request awaits a future review process.

Request status is read from MySQL when opening/reloading the main page and
is tracked by dog ID, including after sorting or filtering. All pages of the
user's request history are loaded. Request state is not persisted as a Redux
flag. Existing requests of any status prevent another application for that
dog; reviewed requests display **Request approved** or **Request declined**.

If history cannot be loaded, adoption actions stay disabled until **Retry
loading requests** succeeds. Submission failures remain visible in the modal
and allow retry. A 409 reloads request history and the dog list: a duplicate
request and a dog that is no longer available are distinct outcomes. A 401
during either protected request clears the session and returns to login with
an explanation. Navigating away aborts unfinished client requests; returning
to the main page reads the server again because an aborted submission may
already have been saved.

The current flow records requests only. Email notifications, request review
controls and a separate request-history screen are not implemented yet.

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
responses. Adoption UI tests also cover confirmation/cancellation, pending
submission, retries, duplicate/unavailable-dog conflicts, expired sessions,
request pagination, remounts, sorting/filtering, and late responses after
navigation. Backend integration tests exercise the actual MySQL endpoints in
Capstone-BE. To test the full local flow manually, leave both servers running
and register through the browser; that account will be saved in MySQL.
For adoption, log in, open `/main`, choose one demo dog and submit a request.
Refresh the page and change sorting/filtering: only that dog's card should
show **Pending review**, and MySQL should contain one `pending` row in
`adoption_requests` for that user/dog pair.

For a deployed build, set `REACT_APP_API_URL` to the intended deployed API
before building, and ensure that API permits the frontend origin.
