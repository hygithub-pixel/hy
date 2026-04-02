import type { RouteMeta } from 'vue-router';

export interface CustomRouteMeta extends RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  icon?: string;
  roles?: string[];
  keepAlive?: boolean;
  hidden?: boolean;
  order?: number;
}

export interface DynamicRouteConfig {
  path: string;
  name: string;
  component: string;
  meta: CustomRouteMeta;
  children?: DynamicRouteConfig[];
}
