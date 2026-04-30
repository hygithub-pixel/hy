import { authService } from './authService';
import { apiService } from './apiService';
import { notificationService } from './notificationService';
import { loadingService } from './loadingService';
import { container } from './container';
import type { App } from 'vue';

export function registerServices() {
  container.register('authService', authService);
  container.register('apiService', apiService);
  container.register('notificationService', notificationService);
  container.register('loadingService', loadingService);
}

export function provideServices(app: App) {
  app.provide('authService', authService);
  app.provide('apiService', apiService);
  app.provide('notificationService', notificationService);
  app.provide('loadingService', loadingService);
}

export { authService, apiService, notificationService, loadingService, container };
