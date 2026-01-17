# Session Lifecycle Plugin

Provides proper session start/end tracking for developers.

## Problem

GitHub Copilot CLI's `sessionStart` and `sessionEnd` hooks fire **per-prompt** instead of **per-session** in interactive mode. This makes it impossible to reliably track actual session lifecycle.

## What This Plugin Does

**Tracks ACTUAL session boundaries**, not per-prompt events:
- ✅ `onActualSessionStart` - Fires once when session truly starts
- ✅ `onActualSessionEnd` - Fires once when session truly ends
- ✅ Message counting across entire session
- ✅ Session-scoped data storage

## Solves

[GitHub Copilot CLI Issue #991](https://github.com/github/copilot-cli/issues/991) - sessionStart/sessionEnd hooks fire per-prompt

## Usage

```javascript
import { PluginClient } from '@barrersoftware/copilot-plugins';

const client = new PluginClient();
await client.start();
const session = await client.createSession();

// Install plugin
await session.sendAndWait({ message: '/plugins install session-lifecycle' });

// Session start fires ONCE (not per prompt)
// Session end fires ONCE (when session actually ends)
```

## Example Output

```
🔵 ═══ ACTUAL SESSION START ═══
   Session ID: abc123
   Started: 2026-01-17T08:00:00.000Z

... (many prompts)...

🔴 ═══ ACTUAL SESSION END ═══
   Duration: 325.42s
   Messages sent: 47
   Ended: 2026-01-17T08:05:25.420Z
```

## Extending

Create a custom plugin that extends this one:

```javascript
class MySessionPlugin extends SessionLifecyclePlugin {
  async onActualSessionStart(context) {
    // Your session start logic
    await initializeDatabase();
    this.setSessionData('user', 'daniel');
  }

  async onActualSessionEnd(context, durationMs) {
    // Your session end logic
    const user = this.getSessionData('user');
    await saveSessionReport(user, durationMs);
  }
}
```

## When You Need This

- Building analytics/metrics systems
- Session-based data persistence
- Tracking actual usage patterns
- Cleanup/initialization tasks
- Any logic that should run once per session (not per prompt)

## License

MIT

## Author

Built by Captain CP & Barrer Software  
Part of [@barrersoftware/copilot-plugins](https://www.npmjs.com/package/@barrersoftware/copilot-plugins)
