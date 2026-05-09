import { useRouter } from 'vue-router';
import { loadSystemConfig } from '../utils/configScanner';

export const useModuleHooks = () => {
  const router = useRouter();

  const executeHook = async (hookName: string, params?: any): Promise<any> => {
    const system = await loadSystemConfig();
    const hookConfig = system.hooks[hookName];
    
    if (!hookConfig) return params;

    switch (hookConfig.type) {
      case 'transform':
        return transformDateRange(params);
      case 'navigation':
        return navigate(hookConfig.action);
      case 'callback':
        return params;
      default:
        return params;
    }
  };

  const transformDateRange = (params: any) => {
    if (params?.dateRange && params.dateRange.length === 2) {
      return {
        ...params,
        startDate: params.dateRange[0],
        endDate: params.dateRange[1],
      };
    }
    return params;
  };

  const navigate = (action: string) => {
    if (action === 'back') {
      router.back();
    }
  };

  return {
    executeHook,
    transformDateRange,
    navigate,
  };
};
