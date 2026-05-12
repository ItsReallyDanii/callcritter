# Cost Control — CallCritter

## Main cost driver
Image generation is the main variable cost. GPT-5.5 scene analysis is secondary.

## Required controls before public launch
- One generation per browser session.
- Server-side IP/time-window throttle.
- Demo scene mode available without repeated generation.
- Pre-generated fallback companions.
- No batch generation in MVP.

## Recommended defaults

```txt
MAX_GENERATIONS_PER_SESSION=1
MAX_GENERATIONS_PER_IP_WINDOW=3
RATE_LIMIT_WINDOW_MINUTES=10
```

## Public launch rule
Do not post the playable link publicly until rate limiting is active.

## Spend stop rule
If estimated spend exceeds $100 before final submission, stop adding generation features and use fallback assets for polish/testing.
