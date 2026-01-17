# GitHub Copilot Plugin Registry

Community-maintained registry of plugins for [@barrersoftware/copilot-plugins](https://www.npmjs.com/package/@barrersoftware/copilot-plugins).

> 🎉 **UPDATE**: Plugin system submitted to official GitHub Copilot SDK!  
> **See PR #42**: https://github.com/github/copilot-sdk/pull/42 | [Details](./UPSTREAM_PR.md)

**📦 Plugin System:** https://github.com/barrersoftware/copilot-plugin-system-js  
**📚 npm Package:** https://www.npmjs.com/package/@barrersoftware/copilot-plugins  
**🐙 Registry:** https://github.com/barrersoftware/copilot-plugins-registry (you are here)

## Usage

Install plugins directly from your Copilot CLI session:

```javascript
import { PluginClient } from '@barrersoftware/copilot-plugins';

const client = new PluginClient();
await client.start();
const session = await client.createSession();

// Install plugin from registry
await session.sendAndWait({ message: '/plugins install message-repair' });

// Use the plugin
await session.sendAndWait({ message: 'Your prompt here' });
```

## Available Plugins

| Plugin | Description | Issues Solved |
|--------|-------------|---------------|
| **message-repair** | Fixes orphaned tool_calls and tool_results that cause API crashes | [#1005](https://github.com/github/copilot-cli/issues/1005), [#994](https://github.com/github/copilot-cli/issues/994) |
| **retry** | Adds `/retry` command to retry failed requests | [#995](https://github.com/github/copilot-cli/issues/995) |
| **session-lifecycle** | Proper session start/end tracking (fixes per-prompt firing) | [#991](https://github.com/github/copilot-cli/issues/991) |
| **debug-logger** | Enhanced debug logging for skill loading and execution | [#993](https://github.com/github/copilot-cli/issues/993) |

## Contributing a Plugin

### 1. Fork this repository

### 2. Create plugin directory

```bash
mkdir plugins/your-plugin-name
cd plugins/your-plugin-name
```

### 3. Create `plugin.js`

```javascript
/**
 * Your Plugin Name
 * Description of what it does
 * 
 * Solves: https://github.com/github/copilot-cli/issues/XXX
 */

export class YourPlugin {
  name = 'your-plugin-name';
  
  async onLoad() {
    console.log('🔌 YourPlugin loaded');
  }
  
  async onBeforeSend(context, options) {
    // Your logic here
    return options;
  }
  
  async onAfterReceive(context, response) {
    // Your logic here
    return response;
  }
}

// Default export for registry loading
export default YourPlugin;
```

### 4. Create `README.md`

```markdown
# Your Plugin Name

Brief description.

## What it does

- Feature 1
- Feature 2

## Solves

- [GitHub Issue #XXX](https://github.com/github/copilot-cli/issues/XXX)

## Usage

\`\`\`javascript
/plugins install your-plugin-name
\`\`\`

## Configuration

Optional configuration options...
```

### 5. Create `package.json`

```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "Brief description",
  "author": "Your Name",
  "license": "MIT"
}
```

### 6. Submit Pull Request

Submit PR with:
- Plugin code in `plugins/your-plugin-name/`
- Updated main README.md table

## Plugin Guidelines

**Required:**
- ✅ Must export default class implementing `Plugin` interface
- ✅ Must have `name` property matching directory name
- ✅ Must include README.md with usage instructions
- ✅ Must include package.json with metadata

**Best Practices:**
- 📖 Clear documentation
- 🧪 Include example usage
- 🐛 Reference GitHub issues if solving a problem
- ⚖️ Open source license (MIT recommended)
- 🔒 No malicious code (will be reviewed)

## Security

All plugins are reviewed before merge. We check for:
- No credential theft
- No data exfiltration
- No malicious network requests
- No filesystem abuse

**Use plugins at your own risk.** Review code before installing.

## Plugin Structure

```
copilot-plugins-registry/
├── README.md (this file)
└── plugins/
    ├── message-repair/
    │   ├── plugin.js
    │   ├── README.md
    │   └── package.json
    ├── retry/
    │   ├── plugin.js
    │   ├── README.md
    │   └── package.json
    └── your-plugin/
        ├── plugin.js
        ├── README.md
        └── package.json
```

## Installation URL Format

Plugins are loaded via GitHub raw URLs:

```
https://raw.githubusercontent.com/barrersoftware/copilot-plugins-registry/main/plugins/{name}/plugin.js
```

## License

Individual plugins have their own licenses (see plugin README).
Registry structure: MIT License

---

🏴‍☠️ **Community-driven plugins for GitHub Copilot CLI**

Built with [@barrersoftware/copilot-plugins](https://www.npmjs.com/package/@barrersoftware/copilot-plugins)
