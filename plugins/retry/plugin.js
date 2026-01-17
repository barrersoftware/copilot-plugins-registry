/**
 * Retry Plugin
 * 
 * Adds manual retry functionality for failed requests.
 * 
 * Solves: https://github.com/github/copilot-cli/issues/995
 * 
 * Usage:
 *   When a request fails, type: /retry
 *   The last request will be retried automatically
 */

export class RetryPlugin {
  name = 'retry';
  lastRequest = null;
  lastError = null;

  async onLoad() {
    console.log('🔄 RetryPlugin loaded');
    console.log('   Type /retry to retry the last request');
  }

  async onBeforeSend(context, options) {
    // Check if this is a retry command
    if (options.message === '/retry' || options.prompt === '/retry') {
      if (this.lastRequest) {
        console.log('🔄 Retrying last request...');
        return this.lastRequest;
      } else {
        // Return error message
        return {
          ...options,
          message: '❌ No previous request to retry',
          prompt: '❌ No previous request to retry'
        };
      }
    }

    // Save request for potential retry (deep copy)
    this.lastRequest = JSON.parse(JSON.stringify(options));
    return options;
  }

  async onAfterReceive(context, response) {
    // Check for errors in response
    if (response && (response.error || response.type === 'error')) {
      this.lastError = response;
      console.log('\n⚠️  Request failed!');
      console.log('💡 TIP: Type /retry to retry the last request\n');
    } else {
      // Clear error on success
      this.lastError = null;
    }
    
    return response;
  }

  async onSessionEnd() {
    console.log('🔄 RetryPlugin session ended');
  }

  async onUnload() {
    console.log('🔄 RetryPlugin unloaded');
  }
}

// Default export for registry loading
export default RetryPlugin;
