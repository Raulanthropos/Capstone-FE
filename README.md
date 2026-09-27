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
The dog remains available while the request awaits an administrator's decision.

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

## Administrator review

Log in with a provisioned admin account using the normal login form. Public
registration creates regular users only. From the profile or main page,
choose **Review adoption requests**, or open `/admin/adoptions`.

The page shows pending requests by default, with applicant profile details,
dog details, status filters, and pages of 20 requests. **Approve request**
and **Decline request** open a confirmation dialog describing the effect.
Approval marks the dog adopted, removes it from the available-dog list, and
declines competing pending requests for the same dog. Declining affects only
the selected application. Review metadata is stored by the backend.

Saving disables repeated clicks. Failures remain visible and allow retry.
A conflicting decision refreshes the list; reviewed requests cannot be
overwritten. Both the page and the API require admin access. Expired tokens
return to login; a revoked admin role produces a permission error.

Apply the backend migration that adds `reviewed_by` and `reviewed_at` before
using review. Admin credentials are local data and are not stored in source.
Email notifications and a separate request-history screen for regular users
are not implemented yet.

Sessions are stored under a new Redux Persist key scoped to the API URL.
Old Railway session data is not reused. On reload, the app verifies its saved
token through `GET /users/me` before showing authenticated screens. Expired
or unverified sessions are cleared. Logout clears the session in this browser;
it does not revoke the one-hour JWT on the server.

## Vercel build

Use Node.js 24.x in Vercel, `npm run build` as the build command, and `build`
as the output directory. Deploy the commit containing the current fixes.

Bootstrap 4.6.2 still ships a deprecated `color-adjust` declaration in its
compiled CSS. `patches/bootstrap+4.6.2.patch` removes that declaration while
preserving `print-color-adjust` and its WebKit prefix. The `postinstall` hook
applies this patch after `npm install` or `npm ci`; keep the patch committed.
`App.js` imports the patched, unminified stylesheet; CRA minifies it for
production. Review or remove the patch when replacing Bootstrap.

Keep CI warning checks enabled. Reproduce the Vercel build in Git Bash with
`CI=true npm run build`, or in PowerShell with `$env:CI = "true"` followed by
`npm.cmd run build`.

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
navigation. Admin UI tests cover access, profile navigation, applicant details,
confirmation, approve/decline, retries, conflicts, pagination and session expiry.
Backend integration tests exercise the actual MySQL endpoints in
Capstone-BE. To test the full local flow manually, leave both servers running
and register through the browser; that account will be saved in MySQL.
For adoption, log in, open `/main`, choose one demo dog and submit a request.
Refresh the page and change sorting/filtering: only that dog's card should
show **Pending review**, and MySQL should contain one `pending` row in
`adoption_requests` for that user/dog pair.

For a deployed build, set `REACT_APP_API_URL` to the intended deployed API
before building, and ensure that API permits the frontend origin.

## Profile, mobile layout and action feedback

Profiles and the navbar display each user's photo when available, otherwise their
initials in a stable color. Broken photos fall back to initials too. Photo upload
and profile editing are still unavailable.

Profile actions align in a wrapping row and stack on narrow screens. Dog cards
stack their photo and details on mobile. Navigation and the account menu work
with click, touch and keyboard; selecting a destination closes the mobile menu.

Success (green) and error (red) toasts confirm registration, login, logout,
adoption submission and admin review. Success appears only after the API confirms
the action (login also waits for the profile). Errors also stay in the form or
confirmation dialog for retry. Toasts remain across route changes, can be closed,
and pause on hover or when the browser loses focus. Persistent notifications and
Socket.IO messaging are described below.


## Design, notifications and messaging

The current UI is inspired by the layout, spacing, typography and rounded
photography of [IsoMeet](https://www.isomeet.com/), adapted to Woof Paws.
The homepage, authentication, profile, dogs, stories, review and inbox pages
share the same theme. Existing project photos are served locally.
The story examples are illustrative, not live adoption metrics.

**Updates** in the navbar opens persistent notifications; its badge is the
unread count. Mark one or all notifications read. New requests notify admins,
review decisions notify applicants (including competing declined requests),
and incoming messages notify the other participants.

**Messages** opens conversations grouped by adoption request, including
requests created before messaging was added. An applicant and current admins
can discuss their request even after a decision. Open a conversation from
the dogs/review page or from the inbox; load earlier messages when needed.

Messages are saved through authenticated HTTP and refreshed immediately by
Socket.IO. Both use REACT_APP_API_URL. The UI refreshes on reconnect, focus
and every 30 seconds while visible, so missed events are recovered from MySQL.
The connection label reports Live or Reconnecting. Failed sends keep the
draft and reuse its message ID on retry to avoid duplicates. Unsent drafts
are local to the open conversation and are cleared when leaving it.

Run backend migrations before using this version. For a manual local check,
open a regular browser session as the applicant and a private window as admin.
Submit a request, check the admin badge, exchange messages in both directions,
then review the request and check the applicant's Updates page. Refresh to
verify persistence. Use separate browser storage for the two accounts.

The frontend tests additionally cover toasts, avatars, click/touch navigation,
unread state, message retries, escaped text, incoming events, reconnect,
logout cleanup and expired sessions. Browser layout checks covered 320px,
390px, 768px and 1440px with representative data. Profile editing, deletion and photo
upload still await backend migration. Render deployment remains a later step.
