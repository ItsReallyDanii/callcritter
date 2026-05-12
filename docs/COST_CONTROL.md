# Cost Control - CallCritter

## Main Cost Driver

Image generation is the main variable cost. GPT-5.5 scene analysis is secondary.

## Current Controls

- One successful companion generation per browser session.
- Demo scene mode avoids camera friction.
- Fallback companion is available when generation fails.
- No batch generation.
- No persistent gallery that encourages repeated public use.

## Required Before Public Launch

Add server-side IP/time-window throttling before posting a public link broadly.

Recommended defaults:

```txt
MAX_GENERATIONS_PER_SESSION=1
MAX_GENERATIONS_PER_IP_WINDOW=3
RATE_LIMIT_WINDOW_MINUTES=10
```

## Public Launch Rule

Do not post the playable link publicly until server-side rate limiting is active or the expected audience is tightly controlled.

## Spend Stop Rule

If estimated spend exceeds `$100` before final submission, stop adding generation features and use fallback assets for testing/polish.
