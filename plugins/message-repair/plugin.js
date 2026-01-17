/**
 * Message Repair Plugin
 * 
 * Fixes orphaned tool_calls and tool_results that cause API validation errors.
 * 
 * Solves:
 * - https://github.com/github/copilot-cli/issues/1005 (orphaned tool_results)
 * - https://github.com/github/copilot-cli/issues/994 (model switching crashes)
 * 
 * Root Cause: The K8l function in Copilot CLI only handles orphaned tool_calls
 * (adds fake results) but doesn't filter orphaned tool_results (results without
 * matching tool_calls). This causes API validation errors from both Anthropic
 * and OpenAI.
 * 
 * This plugin intercepts messages at the SDK layer BEFORE they reach the API
 * and cleans up both directions of orphaned messages.
 */

export class MessageRepairPlugin {
  name = 'message-repair';
  private repairedCount = 0;
  private orphanedResultsRemoved = 0;
  private orphanedCallsFixed = 0;

  async onLoad() {
    console.log('🔧 MessageRepairPlugin loaded');
    console.log('   Fixing orphaned tool_calls and tool_results');
  }

  async onBeforeSend(context, options) {
    // Extract messages from options
    const messages = this.extractMessages(options);
    if (!messages || messages.length === 0) {
      return options;
    }

    // Repair messages
    const repairedMessages = this.repairMessages(messages);
    
    // Update options with repaired messages
    return this.updateMessages(options, repairedMessages);
  }

  extractMessages(options) {
    // Handle different message formats
    if (Array.isArray(options.messages)) {
      return options.messages;
    }
    if (Array.isArray(options)) {
      return options;
    }
    return null;
  }

  updateMessages(options, messages) {
    if (Array.isArray(options.messages)) {
      return { ...options, messages };
    }
    if (Array.isArray(options)) {
      return messages;
    }
    return options;
  }

  repairMessages(messages) {
    let needsRepair = false;

    // Step 1: Collect ALL tool_call IDs from ALL assistant messages
    const allToolCallIds = new Set();
    messages.forEach(msg => {
      if (msg.role === 'assistant' && msg.tool_calls) {
        msg.tool_calls.forEach(tc => allToolCallIds.add(tc.id));
      }
    });

    // Step 2: Filter out orphaned tool_results (no matching tool_call)
    const cleanedMessages = messages.filter(msg => {
      if (msg.role === 'tool' && msg.tool_call_id) {
        if (!allToolCallIds.has(msg.tool_call_id)) {
          console.log(`⚠️  MessageRepairPlugin: Removing orphaned tool_result: ${msg.tool_call_id}`);
          this.orphanedResultsRemoved++;
          needsRepair = true;
          return false;
        }
      }
      return true;
    });

    // Step 3: Find orphaned tool_calls (calls without results)
    const seenResultIds = new Set(
      cleanedMessages
        .filter(m => m.role === 'tool' && m.tool_call_id)
        .map(m => m.tool_call_id)
    );
    
    const orphanedCallIds = [...allToolCallIds].filter(id => !seenResultIds.has(id));

    // Step 4: Add fake results for orphaned tool_calls
    if (orphanedCallIds.length > 0) {
      console.log(`⚠️  MessageRepairPlugin: Adding ${orphanedCallIds.length} fake results for orphaned tool_calls`);
      const fakeResults = orphanedCallIds.map(id => ({
        role: 'tool',
        tool_call_id: id,
        content: 'The execution of this tool was interrupted.'
      }));
      cleanedMessages.push(...fakeResults);
      this.orphanedCallsFixed += orphanedCallIds.length;
      needsRepair = true;
    }

    if (needsRepair) {
      this.repairedCount++;
    }

    return cleanedMessages;
  }

  async onSessionEnd() {
    if (this.repairedCount > 0) {
      console.log(`\n🔧 MessageRepairPlugin Session Summary:`);
      console.log(`   Repairs performed: ${this.repairedCount}`);
      console.log(`   Orphaned results removed: ${this.orphanedResultsRemoved}`);
      console.log(`   Orphaned calls fixed: ${this.orphanedCallsFixed}`);
      console.log(`   ✅ Prevented ${this.repairedCount} potential API errors\n`);
    }
  }

  async onUnload() {
    console.log('🔧 MessageRepairPlugin unloaded');
  }
}

// Default export for registry loading
export default MessageRepairPlugin;
