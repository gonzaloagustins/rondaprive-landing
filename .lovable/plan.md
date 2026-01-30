
# Dynamic Copyright Year in Footer

## Summary
Replace the hardcoded year "2025" with a dynamic JavaScript expression that automatically displays the current year.

## Change
**File:** `src/components/Footer.tsx`

Update line 39 from:
```jsx
© 2025 Ronda Privé. Todos los derechos reservados.
```

To:
```jsx
© {new Date().getFullYear()} Ronda Privé. Todos los derechos reservados.
```

## How It Works
- `new Date()` creates a JavaScript Date object with the current date/time
- `.getFullYear()` extracts the 4-digit year (e.g., 2026, 2027, 2030)
- The year updates automatically whenever a user loads the page

## Technical Details
- No additional dependencies required
- No performance impact (single Date object creation)
- Works client-side, so the year reflects the user's system time
