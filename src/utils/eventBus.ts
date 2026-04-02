type EventHandler = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
    
    return () => {
      this.off(event, handler);
    };
  }

  off(event: string, handler?: EventHandler): void {
    if (!this.events.has(event)) return;
    
    if (handler) {
      this.events.get(event)!.delete(handler);
    } else {
      this.events.delete(event);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) return;
    
    this.events.get(event)!.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });
  }

  once(event: string, handler: EventHandler): () => void {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }

  clear(): void {
    this.events.clear();
  }

  hasEvent(event: string): boolean {
    return this.events.has(event) && this.events.get(event)!.size > 0;
  }

  getEventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

export const eventBus = new EventBus();

export enum AppEvents {
  TABLE_DATA_UPDATED = 'table:data:updated',
  TABLE_DATA_CLEARED = 'table:data:cleared',
  MENU_CHANGED = 'menu:changed',
  USER_LOGGED_IN = 'user:logged:in',
  USER_LOGGED_OUT = 'user:logged:out',
  THEME_CHANGED = 'theme:changed',
  CACHE_CLEARED = 'cache:cleared',
  NOTIFICATION = 'notification',
  ERROR = 'error',
  SUCCESS = 'success'
}

export default eventBus;
