import Mock from 'mockjs';

const Random = Mock.Random;

export const generateId = () => {
  return Random.guid();
};

export const successResponse = <T>(data: T, message = '操作成功') => {
  return {
    code: 0,
    data,
    message
  };
};

export const errorResponse = (message = '操作失败', code = 500) => {
  return {
    code,
    data: null,
    message
  };
};

export default Mock;
