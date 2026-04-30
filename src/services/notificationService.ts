/**
 * 通知服务
 * 提供统一的消息提示和确认对话框功能
 */
import { showMessage, showConfirm } from '../utils/message';

/**
 * 通知服务类
 */
export class NotificationService {
  /**
   * 显示成功消息
   * @param message - 消息内容
   */
  success(message: string) {
    showMessage.success(message);
  }

  /**
   * 显示错误消息
   * @param message - 消息内容
   */
  error(message: string) {
    showMessage.error(message);
  }

  /**
   * 显示警告消息
   * @param message - 消息内容
   */
  warning(message: string) {
    showMessage.warning(message);
  }

  /**
   * 显示信息消息
   * @param message - 消息内容
   */
  info(message: string) {
    showMessage.info(message);
  }

  /**
   * 显示确认对话框
   * @param message - 确认消息内容
   * @param title - 对话框标题，默认为'提示'
   * @param confirmText - 确认按钮文本，默认为'确定'
   * @param cancelText - 取消按钮文本，默认为'取消'
   * @returns Promise<boolean> - 用户点击确认返回true，取消返回false
   */
  confirm(
    message: string,
    title: string = '提示',
    confirmText: string = '确定',
    cancelText: string = '取消'
  ): Promise<boolean> {
    return showConfirm(message, title, confirmText, cancelText);
  }
}

/**
 * 通知服务实例
 */
export const notificationService = new NotificationService();
