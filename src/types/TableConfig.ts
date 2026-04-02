export interface TableRowData {
  id: string;
  [key: string]: unknown;
}

export interface TableColumn {
  type: 'index' | 'selection' | 'expand' | 'text' | 'image' | 'richText' | 'date' | 'datetime' | 'switch' | 'badge' | 'actions';
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  formatter?: (row: TableRowData, column: TableColumn, cellValue: unknown, index: number) => string | number;
  fixed?: 'left' | 'right';
  showOverflowTooltip?: boolean;
  props?: Record<string, unknown>;
  actions?: {
    label: string;
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    handler: (row: TableRowData) => void;
  }[];
}

export interface TablePagination {
  currentPage: number;
  pageSize: number;
  pageSizes: number[];
  total: number;
  layout?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  data: TableRowData[];
  height?: string | number;
  maxHeight?: string | number;
  size?: 'large' | 'default' | 'small';
  border?: boolean;
  stripe?: boolean;
  showHeader?: boolean;
  showSummary?: boolean;
  pagination?: boolean | TablePagination;
  virtual?: boolean; // 是否启用虚拟列表
  itemHeight?: number; // 每一项的高度（用于虚拟列表）
  overscan?: number; // 虚拟列表的过度渲染数量
}
