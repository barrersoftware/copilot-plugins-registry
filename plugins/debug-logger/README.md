# Debug Logger Plugin

Enhanced debug logging for GitHub Copilot CLI interactions.

## Problem

Developers need visibility into what's happening inside their Copilot CLI sessions:
- What messages are being sent?
- What responses come back?
- When do tool calls happen?
- How long does each operation take?
- What's in the conversation history?

## What This Plugin Does

**Logs everything with timestamps and details:**
- ✅ Session creation
- ✅ Every message sent (with preview and length)
- ✅ Every response received
- ✅ Tool calls and results
- ✅ Compaction events
- ✅ Elapsed time tracking
- ✅ Conversation history stats

## Solves

[GitHub Copilot CLI Issue #993](https://github.com/github/copilot-cli/issues/993) - Add debug log coverage for skills loading

## Usage

```javascript
import { PluginClient } from '@barrersoftware/copilot-plugins';

const client = new PluginClient();
await client.start();
const session = await client.createSession();

// Install plugin
await session.sendAndWait({ message: '/plugins install debug-logger' });

// All interactions now logged with full details!
```

## Example Output

```
🐛 ═══ DEBUG LOGGER ENABLED ═══
   All interactions will be logged

🐛 [2026-01-17T08:00:00.000Z] SESSION CREATED
   Session ID: abc123

🐛 [2026-01-17T08:00:01.234Z] [+1.23s] BEFORE SEND
   Message: "What is the capital of France?"
   Length: 31 chars
   Conversation history: 3 messages
   Tool calls: 0, Tool results: 0

🐛 [2026-01-17T08:00:03.456Z] [+3.46s] AFTER RECEIVE
   Type: object
   Content: "The capital of France is Paris."
   Length: 32 chars

🐛 [2026-01-17T08:05:25.420Z] SESSION END
   Total session time: 325.42s
```

## Features

- 📊 Timestamps on every log entry
- ⏱️ Elapsed time since session start
- 📝 Message previews (first 80 chars)
- 🔧 Tool call tracking
- 📏 Length/count statistics
- ⚠️ Compaction event logging
- 🔍 Response analysis

## When You Need This

- Debugging plugin development
- Understanding CLI behavior
- Tracking tool execution
- Performance analysis
- Diagnosing issues
- Learning how the SDK works

## License

MIT

## Author

Built by Captain CP & Barrer Software  
Part of [@barrersoftware/copilot-plugins](https://www.npmjs.com/package/@barrersoftware/copilot-plugins)
