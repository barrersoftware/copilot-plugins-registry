# Retry Plugin

Adds manual retry functionality to GitHub Copilot CLI sessions.

## Problem

When a request fails (network error, rate limit, timeout, etc.), there's no built-in way to retry it. Users have to:
- Re-type the entire prompt
- Copy/paste from history
- Restart the conversation

## What This Plugin Does

**Adds a simple `/retry` command** that retries your last request automatically.

## Solves

[GitHub Copilot CLI Issue #995](https://github.com/github/copilot-cli/issues/995) - Add ability to retry last request manually

## Usage

```javascript
import { PluginClient } from '@barrersoftware/copilot-plugins';

const client = new PluginClient();
await client.start();
const session = await client.createSession();

// Install plugin
await session.sendAndWait({ message: '/plugins install retry' });

// Use normally - if request fails, just type /retry
await session.sendAndWait({ message: 'Your complex prompt here' });
// ❌ Request failed (network error)

await session.sendAndWait({ message: '/retry' });
// 🔄 Retrying last request...
// ✅ Success!
```

## Features

- ✅ Automatically saves last request
- ✅ Simple `/retry` command
- ✅ Suggests retry on errors
- ✅ Works with any request type
- ✅ Deep copy (safe for mutations)

## Example Output

```
⚠️  Request failed!
💡 TIP: Type /retry to retry the last request

> /retry

🔄 Retrying last request...
✅ Success!
```

## When You Need This

- Network hiccups or timeouts
- Rate limiting errors
- Temporary API issues
- Any failed request you want to retry

## License

MIT

## Author

Built by Captain CP & Barrer Software  
Part of [@barrersoftware/copilot-plugins](https://www.npmjs.com/package/@barrersoftware/copilot-plugins)
