type EventCallback = (data?: unknown) => void;

class EventBus {
    private events: Map<string, EventCallback[]> = new Map();
    private moduleReadyStates: Map<string, boolean> = new Map();
    private pendingEvents: Array<{ module: string; event: string; data: unknown }> = [];

    // Subscribe to events
    on(event: string, callback: EventCallback): () => void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    // Unsubscribe from events
    off(event: string, callback: EventCallback): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    // Emit events
    emit(event: string, data?: unknown): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    // Mark module as ready
    setModuleReady(moduleName: string): void {
        this.moduleReadyStates.set(moduleName, true);
        console.log(`[EventBus] Module ${moduleName} is ready`);

        // Process pending events for this module
        this.processPendingEvents(moduleName);
    }

    // Check if module is ready
    isModuleReady(moduleName: string): boolean {
        return this.moduleReadyStates.get(moduleName) === true;
    }

    // Wait for module to be ready before emitting
    emitWhenReady<T>(moduleName: string, event: string, data?: T): void {
        if (this.isModuleReady(moduleName)) {
            this.emit(event, data);
        } else {
            this.pendingEvents.push({ module: moduleName, event, data });
            console.log(`[EventBus] Queued event ${event} for ${moduleName}`);
        }
    }

    // Process pending events for a module
    private processPendingEvents(moduleName: string): void {
        const remaining: typeof this.pendingEvents = [];

        this.pendingEvents.forEach(item => {
            if (item.module === moduleName) {
                this.emit(item.event, item.data);
            } else {
                remaining.push(item);
            }
        });

        this.pendingEvents = remaining;
    }

    // Wait for multiple modules before executing
    whenAllReady(modules: string[], callback: () => void): void {
        const checkReady = () => {
            if (modules.every(module => this.isModuleReady(module))) {
                callback();
                return true;
            }
            return false;
        };

        if (!checkReady()) {
            // Poll every 100ms until all modules are ready
            const interval = setInterval(() => {
                if (checkReady()) {
                    clearInterval(interval);
                }
            }, 100);

            // Timeout after 30 seconds
            setTimeout(() => {
                clearInterval(interval);
                const notReady = modules.filter(m => !this.isModuleReady(m));
                console.error(`[EventBus] Timeout waiting for modules: ${notReady.join(', ')}`);
            }, 30000);
        }
    }

    // Clear all events and state
    clear(): void {
        this.events.clear();
        this.moduleReadyStates.clear();
        this.pendingEvents = [];
    }
}

// Singleton instance
export const eventBus = new EventBus();

// Common event types
export const EventTypes = {
    // Auth events
    AUTH_LOGIN: 'auth:login',
    AUTH_LOGOUT: 'auth:logout',
    AUTH_TOKEN_REFRESH: 'auth:token:refresh',

    // Navigation events
    NAV_CHANGE: 'nav:change',

    // Data events
    DATA_UPDATED: 'data:updated',
    DATA_SYNC: 'data:sync',

    // Module lifecycle
    MODULE_READY: 'module:ready',
    MODULE_ERROR: 'module:error',

    // Theme events
    THEME_CHANGE: 'theme:change',

    // Language events
    LANGUAGE_CHANGE: 'language:change',
};