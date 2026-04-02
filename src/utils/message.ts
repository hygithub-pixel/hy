import { ElMessageBox, ElMessage } from 'element-plus';

export const showMessage = {
  success: (message: string) => {
    ElMessage.success(message);
  },
  error: (message: string) => {
    ElMessage.error(message);
  },
  warning: (message: string) => {
    ElMessage.warning(message);
  },
  info: (message: string) => {
    ElMessage.info(message);
  }
};

export const showConfirm = async (
  message: string,
  title: string = '提示',
  confirmText: string = '确定',
  cancelText: string = '取消'
): Promise<boolean> => {
  try {
    await ElMessageBox.confirm(message, title, {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      type: 'warning'
    });
    return true;
  } catch {
    return false;
  }
};

export default showMessage;
