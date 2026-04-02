export const useAccessibility = () => {
  const announceToScreenReader = (message: string) => {
    if ('announceToScreenReader' in window) {
      (window as any).announceToScreenReader(message);
    }
  };

  const handleKeyPress = (
    event: KeyboardEvent,
    handlers: {
      enter?: () => void;
      space?: () => void;
      escape?: () => void;
      arrowUp?: () => void;
      arrowDown?: () => void;
      arrowLeft?: () => void;
      arrowRight?: () => void;
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

  const setFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  };

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
    announceToScreenReader,
    handleKeyPress,
    setFocus,
    trapFocus
  };
};

export default useAccessibility;
