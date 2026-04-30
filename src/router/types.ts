import type { RouteMeta, RouteRecordRedirectOption } from 'vue-router';

export interface AppRouteMeta extends RouteMeta {
  title: string;
  requiresAuth?: boolean;
}

export type AppRouteRecordRaw = (
  | {
      path: string;
      redirect: RouteRecordRedirectOption;
    }
  | {
      path: string;
      name?: string;
      component: any;
      meta: AppRouteMeta;
      children?: AppRouteRecordRaw[];
    }
);
