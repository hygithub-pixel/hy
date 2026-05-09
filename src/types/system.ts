export interface SystemConfig {
  app: {
    name: string;
    logo: string;
  };
  iconMap: Record<string, string>;
  menuCategories: Record<string, {
    title: string;
    icon: string;
    modules: string[];
  }>;
  hooks: Record<string, any>;
  renderers: Record<string, any>;
  routes: {
    home: string;
    notFound: string;
  };
}
