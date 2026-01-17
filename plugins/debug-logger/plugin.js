/**
 * Debug Logger Plugin
 * 
 * Enhanced debug logging for skill loading, execution, and message flow.
 * 
 * Solves: https://github.com/github/copilot-cli/issues/993
 * 
 * Provides visibility into what's happening under the hood.
 */

export class DebugLoggerPlugin {
  name = 'debug-logger';
  logFile = null;
  startTime = null;

  async onLoad() {
    this.startTime = Date.now();
    console.log('🐛 ═══ DEBUG LOGGER ENABLED ═══');
    console.log('   All interactions will be logged');
    console.log('   Timestamps, message lengths, tool calls, etc.\n');
  }

  async onSessionCreated(context) {
    const timestamp = new Date().toISOString();
    console.log(`🐛 [${timestamp}] SESSION CREATED`);
    console.log(`   Session ID: ${context.sessionId || 'N/A'}`);
    console.log(`   Context data: ${context.data ? 'present' : 'none'}\n`);
  }

  async onBeforeSend(context, options) {
    const timestamp = new Date().toISOString();
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log(`🐛 [${timestamp}] [+${elapsed}s] BEFORE SEND`);
    
    // Log message details
    const message = options.message || options.prompt || 'N/A';
    const messagePreview = typeof message === 'string' 
      ? message.substring(0, 80) 
      : JSON.stringify(message).substring(0, 80);
    
    console.log(`   Message: "${messagePreview}${message.length > 80 ? '...' : ''}"`);
    console.log(`   Length: ${message.length} chars`);
    
    // Log tools if present
    if (options.tools) {
      console.log(`   Tools: ${options.tools.length} available`);
    }
    
    // Log model if present
    if (options.model) {
      console.log(`   Model: ${options.model}`);
    }
    
    // Log messages array if present (conversation history)
    if (Array.isArray(options.messages)) {
      console.log(`   Conversation history: ${options.messages.length} messages`);
      const toolCalls = options.messages.filter(m => m.role === 'assistant' && m.tool_calls).length;
      const toolResults = options.messages.filter(m => m.role === 'tool').length;
      if (toolCalls > 0 || toolResults > 0) {
        console.log(`   Tool calls: ${toolCalls}, Tool results: ${toolResults}`);
      }
    }
    
    console.log();
    return options;
  }

  async onAfterReceive(context, response) {
    const timestamp = new Date().toISOString();
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log(`🐛 [${timestamp}] [+${elapsed}s] AFTER RECEIVE`);
    
    // Analyze response
    if (response) {
      const responseType = typeof response;
      console.log(`   Type: ${responseType}`);
      
      if (response.error) {
        console.log(`   ❌ Error: ${response.error}`);
      } else if (response.content) {
        const preview = response.content.substring(0, 80);
        console.log(`   Content: "${preview}${response.content.length > 80 ? '...' : ''}"`);
        console.log(`   Length: ${response.content.length} chars`);
      } else if (response.type) {
        console.log(`   Response type: ${response.type}`);
      }
      
      if (response.tool_calls) {
        console.log(`   Tool calls: ${response.tool_calls.length}`);
        response.tool_calls.forEach((tc, i) => {
          console.log(`     [${i}] ${tc.function?.name || tc.name || 'unknown'}`);
        });
      }
    } else {
      console.log(`   ⚠️  Response is null/undefined`);
    }
    
    console.log();
    return response;
  }

  async onCompactionStart(context, data) {
    const timestamp = new Date().toISOString();
    console.log(`🐛 [${timestamp}] ⚠️  COMPACTION START`);
    console.log(`   Pre-compaction tokens: ${data.preCompactionTokens || 'unknown'}`);
    console.log(`   Messages: ${data.preCompactionMessagesLength || 'unknown'}\n`);
  }

  async onCompactionComplete(context, data) {
    const timestamp = new Date().toISOString();
    console.log(`🐛 [${timestamp}] ✅ COMPACTION COMPLETE`);
    if (data.success) {
      console.log(`   Tokens removed: ${data.tokensRemoved || 'unknown'}`);
      console.log(`   Messages removed: ${data.messagesRemoved || 'unknown'}`);
    } else {
      console.log(`   ❌ Failed: ${data.error}`);
    }
    console.log();
  }

  async onSessionEnd() {
    const timestamp = new Date().toISOString();
    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`🐛 [${timestamp}] SESSION END`);
    console.log(`   Total session time: ${totalTime}s\n`);
  }

  async onUnload() {
    console.log('🐛 Debug Logger unloaded');
  }
}

// Default export for registry loading
export default DebugLoggerPlugin;
