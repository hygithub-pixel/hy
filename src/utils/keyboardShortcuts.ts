import { performanceMonitor } from './performance';

/**
 * 快捷键动作接口
 */
interface ShortcutAction {
  /** 快捷键组合 */
  key: string;
  /** 快捷键描述 */
  description: string;
  /** 执行动作 */
  action: () => void;
  /** 是否全局生效 */
  global?: boolean;
}

/**
 * 键盘快捷键管理类
 * @example
 * ```typescript
 * import { keyboardShortcuts } from './keyboardShortcuts';
 * 
 * // 注册快捷键
 * keyboardShortcuts.register('ctrl+s', '保存', () => {
 *   console.log('保存操作');
 * });
 * 
 * // 开始监听
 * keyboardShortcuts.startListening();
 * ```
 */
class KeyboardShortcuts {
  /** 快捷键映射 */
  private shortcuts: Map<string, ShortcutAction> = new Map();
  /** 是否正在监听 */
  private isListening: boolean = false;

  /**
   * 注册快捷键
   * @param key - 快捷键组合
   * @param description - 快捷键描述
   * @param action - 执行动作
   * @param global - 是否全局生效，默认为true
   */
  register(key: string, description: string, action: () => void, global: boolean = true) {
    this.shortcuts.set(key.toLowerCase(), { key, description, action, global });
  }

  /**
   * 取消注册快捷键
   * @param key - 快捷键组合
   */
  unregister(key: string) {
    this.shortcuts.delete(key.toLowerCase());
  }

  /**
   * 开始监听键盘事件
   */
  startListening() {
    if (this.isListening) return;

    document.addEventListener('keydown', this.handleKeydown.bind(this));
    this.isListening = true;
  }

  /**
   * 停止监听键盘事件
   */
  stopListening() {
    if (!this.isListening) return;

    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    this.isListening = false;
  }

  /**
   * 处理键盘按下事件
   * @param event - 键盘事件
   */
  private handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (
      target.isContentEditable ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    ) {
      return;
    }

    let keyCombination = '';
    if (event.ctrlKey || event.metaKey) keyCombination += 'ctrl+';
    if (event.altKey) keyCombination += 'alt+';
    if (event.shiftKey) keyCombination += 'shift+';
    keyCombination += event.key.toLowerCase();

    const shortcut = this.shortcuts.get(keyCombination);
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  /**
   * 获取所有快捷键
   * @returns 快捷键数组
   */
  getShortcuts() {
    return Array.from(this.shortcuts.values());
  }

  /**
   * 清除所有快捷键
   */
  clear() {
    this.shortcuts.clear();
  }
}

/**
 * 键盘快捷键实例
 */
export const keyboardShortcuts = new KeyboardShortcuts();

/**
 * 注册常用快捷键
 * @example
 * ```typescript
 * import { registerCommonShortcuts } from './keyboardShortcuts';
 * 
 * // 注册常用快捷键
 * registerCommonShortcuts();
 * ```
 */
export const registerCommonShortcuts = () => {
  /** 注册切换侧边栏快捷键 */
  keyboardShortcuts.register('ctrl+b', '切换侧边栏', () => {
    const sidebarState = (window as any).__SIDEBAR_STATE__;
    if (sidebarState?.toggleSidebar) {
      sidebarState.toggleSidebar();
    }
  });

  /** 注册显示快捷键帮助快捷键 */
  keyboardShortcuts.register('ctrl+/', '显示快捷键帮助', () => {
    const shortcuts = keyboardShortcuts.getShortcuts();
    console.group('⌨️ 键盘快捷键');
    console.table(
      shortcuts.map(s => ({
        快捷键: s.key,
        描述: s.description,
      }))
    );
    console.groupEnd();
  });

  /** 注册显示性能报告快捷键 */
  keyboardShortcuts.register('ctrl+shift+p', '显示性能报告', () => {
    performanceMonitor.logReport();
  });

  // 开始监听
  keyboardShortcuts.startListening();
};
