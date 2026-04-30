/**
 * 加载服务
 * 管理全局加载状态，提供显示和隐藏加载动画的方法
 */

/**
 * 加载服务类
 */
export class LoadingService {
  /** 加载实例 */
  private loadingInstance: any = null;

  /**
   * 显示加载动画
   * @param text - 加载提示文本，默认为'加载中...'
   */
  show(text: string = '加载中...') {
    if (this.loadingInstance) {
      this.hide();
    }
    this.loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)',
    });
  }

  /**
   * 隐藏加载动画
   */
  hide() {
    if (this.loadingInstance) {
      this.loadingInstance.close();
      this.loadingInstance = null;
    }
  }
}

/**
 * 加载服务实例
 */
export const loadingService = new LoadingService();
