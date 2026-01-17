# Message Repair Plugin

Fixes orphaned `tool_calls` and `tool_results` that cause API validation errors in GitHub Copilot CLI.

## Problem

The GitHub Copilot CLI has a bug in its `K8l` function that only handles one direction of orphaned messages:
- ✅ Orphaned `tool_calls` (adds fake "interrupted" results)
- ❌ Orphaned `tool_results` (results without matching tool_calls) - **CAUSES CRASHES**

This leads to API validation errors from both Anthropic and OpenAI:
> "An assistant message with 'tool_calls' must be followed by tool messages responding to each 'tool_call_id'"

## What This Plugin Does

**Intercepts messages at the SDK layer** BEFORE they reach the API and:
1. ✅ Removes orphaned `tool_results` (no matching `tool_call`)
2. ✅ Adds fake results for orphaned `tool_calls` (no matching result)
3. ✅ Prevents API validation errors
4. ✅ Works for ALL models (GPT, Claude, etc.)
5. ✅ Handles session resume AND model switching

## Solves

- [GitHub Copilot CLI Issue #1005](https://github.com/github/copilot-cli/issues/1005) - Orphaned tool_results crash long sessions
- [GitHub Copilot CLI Issue #994](https://github.com/github/copilot-cli/issues/994) - Model switching causes crashes

## Usage

```javascript
import { PluginClient } from '@barrersoftware/copilot-plugins';

const client = new PluginClient();
await client.start();
const session = await client.createSession();

// Install from registry
await session.sendAndWait({ message: '/plugins install message-repair' });

// Plugin is now active - no more crashes!
```

## How It Works

```
User Message → Plugin → Clean Messages → SDK → API ✅
                  ↓
           Removes orphaned tool_results
           Adds fake results for orphaned tool_calls
           Prevents validation errors
```

## Example Output

```
⚠️  MessageRepairPlugin: Removing orphaned tool_result: call_abc123
⚠️  MessageRepairPlugin: Adding 2 fake results for orphaned tool_calls

🔧 MessageRepairPlugin Session Summary:
   Repairs performed: 3
   Orphaned results removed: 1
   Orphaned calls fixed: 2
   ✅ Prevented 3 potential API errors
```

## Technical Details

**Root Cause Analysis** (Credit: JohanVanosmaelAcerta on GitHub)

The CLI's `K8l` function:
- Scans messages backwards
- Stops at first assistant message
- Only handles orphaned tool_calls (one direction)
- Doesn't filter orphaned tool_results (other direction)

**Our Fix:**
- Scans ALL messages (not just backwards)
- Handles BOTH directions
- Runs at SDK layer (works for any session state)
- No CLI modification needed

## When You Need This

- ✅ Long running sessions with many tool executions
- ✅ Sessions that get interrupted/resumed
- ✅ Switching models mid-session
- ✅ Any time you see "unexpected tool_use_id" errors

## License

MIT

## Author

Built by Captain CP & Barrer Software  
Part of [@barrersoftware/copilot-plugins](https://www.npmjs.com/package/@barrersoftware/copilot-plugins)
