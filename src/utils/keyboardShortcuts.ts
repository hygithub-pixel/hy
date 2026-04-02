// 键盘快捷键管理工具

interface ShortcutAction {
  key: string;
  description: string;
  action: () => void;
  global?: boolean;
}

class KeyboardShortcuts {
  private shortcuts: Map<string, ShortcutAction> = new Map();
  private isListening: boolean = false;

  // 注册快捷键
  register(key: string, description: string, action: () => void, global: boolean = true) {
    this.shortcuts.set(key.toLowerCase(), { key, description, action, global });
  }

  // 注销快捷键
  unregister(key: string) {
    this.shortcuts.delete(key.toLowerCase());
  }

  // 开始监听键盘事件
  startListening() {
    if (this.isListening) return;

    document.addEventListener('keydown', this.handleKeydown.bind(this));
    this.isListening = true;
  }

  // 停止监听键盘事件
  stopListening() {
    if (!this.isListening) return;

    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    this.isListening = false;
  }

  // 处理键盘事件
  private handleKeydown(event: KeyboardEvent) {
    // 忽略在输入框、文本区域等输入元素中的按键
    const target = event.target as HTMLElement;
    if (target.isContentEditable || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT') {
      return;
    }

    // 构建按键组合字符串
    let keyCombination = '';
    if (event.ctrlKey || event.metaKey) keyCombination += 'ctrl+';
    if (event.altKey) keyCombination += 'alt+';
    if (event.shiftKey) keyCombination += 'shift+';
    keyCombination += event.key.toLowerCase();

    // 查找并执行对应的操作
    const shortcut = this.shortcuts.get(keyCombination);
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  // 获取所有注册的快捷键
  getShortcuts() {
    return Array.from(this.shortcuts.values());
  }

  // 清除所有快捷键
  clear() {
    this.shortcuts.clear();
  }
}

// 导出单例实例
export const keyboardShortcuts = new KeyboardShortcuts();

// 常用快捷键注册函数
export const registerCommonShortcuts = () => {
  // 保存操作
  keyboardShortcuts.register('ctrl+s', '保存', () => {
    console.log('保存操作');
    // 这里可以触发保存逻辑
  });

  // 撤销操作
  keyboardShortcuts.register('ctrl+z', '撤销', () => {
    console.log('撤销操作');
    // 这里可以触发撤销逻辑
  });

  // 重做操作
  keyboardShortcuts.register('ctrl+y', '重做', () => {
    console.log('重做操作');
    // 这里可以触发重做逻辑
  });

  // 刷新页面
  keyboardShortcuts.register('f5', '刷新页面', () => {
    console.log('刷新页面');
    window.location.reload();
  });

  // 打开搜索
  keyboardShortcuts.register('ctrl+f', '打开搜索', () => {
    console.log('打开搜索');
    // 这里可以触发搜索逻辑
  });

  // 切换侧边栏
  keyboardShortcuts.register('ctrl+b', '切换侧边栏', () => {
    console.log('切换侧边栏');
    // 这里可以触发侧边栏切换逻辑
  });

  // 开始监听
  keyboardShortcuts.startListening();
};
