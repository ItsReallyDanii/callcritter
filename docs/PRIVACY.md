# Privacy — CallCritter

## Camera access
Camera access is requested only after the user clicks `Use My Camera`. If camera access is denied, users can use demo mode.

## Snapshot handling
A snapshot is sent to the server only when the user chooses to analyze/generate. The app should not store snapshots in a database for the contest MVP.

## No account requirement
The app requires no login and stores no persistent user profile.

## Data flow disclosure
The app sends the selected/captured image to a server-side API route, which forwards it to OpenAI for scene analysis. The generated companion image is returned to the browser.

## MVP policy
- No persistent gallery.
- No account system.
- No hidden recording.
- No automatic camera access on page load.
