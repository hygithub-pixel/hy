import { message, Modal } from 'ant-design-vue';

export const showMessage = {
  success: (msg: string) => {
    message.success(msg);
  },
  error: (msg: string) => {
    message.error(msg);
  },
  warning: (msg: string) => {
    message.warning(msg);
  },
  info: (msg: string) => {
    message.info(msg);
  },
};

export const showConfirm = async (
  msg: string,
  title: string = '提示',
  confirmText: string = '确定',
  cancelText: string = '取消'
): Promise<boolean> => {
  return new Promise((resolve) => {
    Modal.confirm({
      title: title,
      content: msg,
      okText: confirmText,
      cancelText: cancelText,
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      },
    });
  });
};

export default showMessage;
