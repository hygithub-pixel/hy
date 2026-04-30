import type { Component } from 'vue';

export interface ComponentRegistry {
  [key: string]: Component;
}

export class ComponentManager {
  private components: ComponentRegistry = {};

  register(name: string, component: Component) {
    this.components[name] = component;
  }

  get(name: string): Component | undefined {
    return this.components[name];
  }

  getAll(): ComponentRegistry {
    return { ...this.components };
  }
}

export const componentManager = new ComponentManager();