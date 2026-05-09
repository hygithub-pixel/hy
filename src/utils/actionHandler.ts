import type { Ref } from 'vue';

export type ActionHandler = (context: ActionContext) => void | Promise<void>;

export interface ActionContext {
  action: string;
  record?: any;
  selectedRows?: any[];
  selectedRowKeys?: any[];
  tableData?: any[];
  loadData?: () => void;
  router?: any;
}

export interface ActionDefinition {
  name: string;
  handler: ActionHandler;
}

const actionRegistry: Record<string, ActionHandler> = {
  create: ({ router }) => {
    if (router) {
      router.push({ path: '/users/add' });
    }
  },
  edit: ({ record, router }) => {
    if (router && record) {
      router.push({ path: `/users/edit/${record.id}` });
    }
  },
  view: ({ record, router }) => {
    if (router && record) {
      router.push({ path: `/users/view/${record.id}` });
    }
  },
  delete: async ({ record, loadData }) => {
    console.log('Delete:', record);
    if (loadData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      loadData();
    }
  },
  search: ({ loadData }) => {
    if (loadData) {
      loadData();
    }
  },
  reset: ({ selectedRows, selectedRowKeys }) => {
    if (selectedRows) selectedRows.length = 0;
    if (selectedRowKeys) selectedRowKeys.length = 0;
  },
  batchDelete: async ({ selectedRowKeys, loadData }) => {
    console.log('Batch delete:', selectedRowKeys);
    if (loadData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      loadData();
    }
  },
  export: () => {
    console.log('Export');
  },
};

export const registerAction = (name: string, handler: ActionHandler) => {
  actionRegistry[name] = handler;
};

export const executeAction = async (context: ActionContext) => {
  const { action } = context;
  const handler = actionRegistry[action];
  if (handler) {
    await handler(context);
  } else {
    console.warn(`Action "${action}" not found in registry`);
  }
};

export const getRegisteredActions = (): string[] => {
  return Object.keys(actionRegistry);
};
