export interface TableRowData {
  id: string;
  [key: string]: unknown;
}

export interface TableAction {
  id: string;
  label: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
  component?: string;
  componentProps?: Record<string, any>;
  handler?: (row: TableRowData, action: TableAction) => void;
  visible?: (row: TableRowData) => boolean;
  disabled?: (row: TableRowData) => boolean;
}

export interface TableColumn {
  type:
    | 'index'
    | 'selection'
    | 'expand'
    | 'text'
    | 'image'
    | 'richText'
    | 'date'
    | 'datetime'
    | 'switch'
    | 'badge'
    | 'actions';
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  formatter?: (
    row: TableRowData,
    column: TableColumn,
    cellValue: unknown,
    index: number
  ) => string | number;
  fixed?: 'left' | 'right';
  showOverflowTooltip?: boolean;
  props?: {
    type?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
    [key: string]: unknown;
  };
  actions?: TableAction[];
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
