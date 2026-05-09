import { useRouter } from 'vue-router';

type HookFn = (data?: any) => any;

export const useModuleHooks = () => {
  const router = useRouter();

  const hooks: Record<string, HookFn> = {
    transformDateRange: (params: any) => {
      if (params?.dateRange && params.dateRange.length === 2) {
        return {
          ...params,
          startDate: params.dateRange[0],
          endDate: params.dateRange[1],
        };
      }
      return params;
    },

    backToList: () => {
      router.back();
    },

    refreshList: () => {
      return true;
    },

    showErrorMessage: (error: any) => {
      console.error('Error:', error);
    },

    renderStatus: (status: number) => {
      return status === 1
        ? { type: 'success', text: '启用' }
        : { type: 'default', text: '禁用' };
    },

    renderRole: (role: string) => {
      const colorMap: Record<string, string> = {
        '超级管理员': 'purple',
        '产品经理': 'cyan',
        '设计师': 'green',
        '运营专员': 'blue',
        '开发工程师': 'orange',
        '测试工程师': 'geekblue',
      };
      return { color: colorMap[role] || 'default', text: role };
    },
  };

  const executeHook = (hookName: string, params?: any): any => {
    const fn = hooks[hookName];
    return fn ? fn(params) : params;
  };

  const registerHook = (name: string, fn: HookFn) => {
    hooks[name] = fn;
  };

  return {
    hooks,
    executeHook,
    registerHook,
  };
};
