/**
 * Session Lifecycle Plugin
 * 
 * Provides proper session start/end tracking (not per-prompt).
 * 
 * Solves: https://github.com/github/copilot-cli/issues/991
 * 
 * Problem: sessionStart and sessionEnd hooks fire per-prompt instead of per-session
 * Solution: Track ACTUAL session lifecycle with proper start/end events
 */

export class SessionLifecyclePlugin {
  name = 'session-lifecycle';
  actualSessionStart = null;
  messageCount = 0;
  sessionData = new Map();

  async onLoad() {
    console.log('🔵 SessionLifecyclePlugin loaded');
  }

  async onSessionCreated(context) {
    // Track ACTUAL session start (only once)
    if (!this.actualSessionStart) {
      this.actualSessionStart = Date.now();
      this.messageCount = 0;
      console.log('\n🔵 ═══ ACTUAL SESSION START ═══');
      console.log(`   Session ID: ${context.sessionId || 'unknown'}`);
      console.log(`   Started: ${new Date().toISOString()}\n`);
      
      // Call user's actual session start hook
      await this.onActualSessionStart(context);
    }
  }

  async onBeforeSend(context, options) {
    this.messageCount++;
    return options;
  }

  async onSessionEnd(context) {
    // Only fire actual end on real session end
    if (this.actualSessionStart) {
      const duration = Date.now() - this.actualSessionStart;
      const durationSec = (duration / 1000).toFixed(2);
      
      console.log('\n🔴 ═══ ACTUAL SESSION END ═══');
      console.log(`   Duration: ${durationSec}s`);
      console.log(`   Messages sent: ${this.messageCount}`);
      console.log(`   Ended: ${new Date().toISOString()}\n`);
      
      // Call user's actual session end hook
      await this.onActualSessionEnd(context, duration);
      
      // Reset tracking
      this.actualSessionStart = null;
      this.messageCount = 0;
      this.sessionData.clear();
    }
  }

  /**
   * Override this in your code for actual session start logic
   */
  async onActualSessionStart(context) {
    // User's custom logic goes here
    // Example: Initialize databases, start timers, etc.
  }

  /**
   * Override this in your code for actual session end logic
   */
  async onActualSessionEnd(context, durationMs) {
    // User's custom logic goes here
    // Example: Save to database, generate reports, cleanup, etc.
  }

  /**
   * Helper: Store session-scoped data
   */
  setSessionData(key, value) {
    this.sessionData.set(key, value);
  }

  /**
   * Helper: Get session-scoped data
   */
  getSessionData(key) {
    return this.sessionData.get(key);
  }

  async onUnload() {
    console.log('🔵 SessionLifecyclePlugin unloaded');
  }
}

// Default export for registry loading
export default SessionLifecyclePlugin;
