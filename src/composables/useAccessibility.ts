/**
 * 可访问性组合函数
 * @returns 可访问性相关方法
 * @example
 * ```typescript
 * const { handleKeyPress, setFocus } = useAccessibility();
 * 
 * // 处理键盘事件
 * const handleKeyDown = (event: KeyboardEvent) => {
 *   handleKeyPress(event, {
 *     enter: () => console.log('Enter pressed'),
 *     space: () => console.log('Space pressed'),
 *     escape: () => console.log('Escape pressed')
 *   });
 * };
 * ```
 */
export const useAccessibility = () => {
  /**
   * 向屏幕阅读器宣布消息
   * @param message - 要宣布的消息
   */
  const announceToScreenReader = (message: string) => {
    if ('announceToScreenReader' in window) {
      (window as any).announceToScreenReader(message);
    }
  };

  /**
   * 处理键盘按键事件
   * @param event - 键盘事件
   * @param handlers - 按键处理函数
   */
  const handleKeyPress = (
    event: KeyboardEvent,
    handlers: {
      /** Enter键处理函数 */
      enter?: () => void;
      /** 空格键处理函数 */
      space?: () => void;
      /** Escape键处理函数 */
      escape?: () => void;
      /** 上箭头键处理函数 */
      arrowUp?: () => void;
      /** 下箭头键处理函数 */
      arrowDown?: () => void;
      /** 左箭头键处理函数 */
      arrowLeft?: () => void;
      /** 右箭头键处理函数 */
      arrowRight?: () => void;
      /** Tab键处理函数 */
      tab?: () => void;
    }
  ) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        handlers.enter?.();
        break;
      case ' ':
        event.preventDefault();
        handlers.space?.();
        break;
      case 'Escape':
        event.preventDefault();
        handlers.escape?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        handlers.arrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        handlers.arrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        handlers.arrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handlers.arrowRight?.();
        break;
      case 'Tab':
        handlers.tab?.();
        break;
    }
  };

  /**
   * 设置元素焦点
   * @param element - 要设置焦点的元素
   */
  const setFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  };

  /**
   * 焦点陷阱
   * @param container - 容器元素
   * @param initialElement - 初始焦点元素
   * @returns 清理函数
   */
  const trapFocus = (container: HTMLElement, initialElement?: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])' 
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    if (initialElement) {
      initialElement.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  return {
    /** 向屏幕阅读器宣布消息 */
    announceToScreenReader,
    /** 处理键盘按键事件 */
    handleKeyPress,
    /** 设置元素焦点 */
    setFocus,
    /** 焦点陷阱 */
    trapFocus,
  };
};

export default useAccessibility;
