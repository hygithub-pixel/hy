class Container {
  private services = new Map<string, any>();

  register(key: string, service: any) {
    this.services.set(key, service);
  }

  resolve<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found`);
    }
    return service;
  }

  has(key: string): boolean {
    return this.services.has(key);
  }
}

export const container = new Container();
