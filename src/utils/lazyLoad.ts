// 按需加载工具函数

// 按需加载富文本编辑器
export const loadWangEditor = async () => {
  const { createEditor } = await import('@wangeditor/editor') as any;
  const { Editor, Toolbar } = await import('@wangeditor/editor-for-vue') as any;
  return { createEditor, Editor, Toolbar };
};

// 按需加载Excel处理库
export const loadXLSX = async () => {
  const XLSX = await import('xlsx');
  return XLSX;
};

// 按需加载Element Plus组件（如果需要）
export const loadElementPlus = async () => {
  const ElementPlus = await import('element-plus');
  return ElementPlus;
};

// 按需加载大组件
export const loadLargeComponent = async (componentPath: string) => {
  try {
    const module = await import(`../${componentPath}.vue`);
    return module.default || module;
  } catch (error) {
    console.error('Failed to load component:', error);
    throw error;
  }
};

// 按需加载ECharts
export const loadECharts = async () => {
  const echarts = await import('echarts');
  return echarts;
};
