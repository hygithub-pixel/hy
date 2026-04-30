/**
 * 插件系统使用示例
 */
import { validationPluginManager } from './validation';
import { dataProcessingPluginManager } from './dataProcessing';
import { formBehaviorPluginManager } from './formBehavior';

// 注册自定义验证规则插件
validationPluginManager.register({
  name: 'domainCheck',
  validate: (value, rule) => {
    if (!value) return true;
    return value.endsWith(`@${rule.domain}`);
  },
  message: (rule) => rule.message || `邮箱必须为 ${rule.domain} 域名`
});

// 注册自定义数据处理插件
dataProcessingPluginManager.register({
  name: 'customFormatter',
  process: (value, options) => {
    if (!value) return '';
    return options.prefix + value + options.suffix;
  }
});

// 注册自定义表单行为插件
formBehaviorPluginManager.register({
  name: 'customBehavior',
  install: (_form) => {
    console.log('Custom behavior plugin installed');
  },
  uninstall: (_form) => {
    console.log('Custom behavior plugin uninstalled');
  }
});

// 示例表单配置
export const exampleFormConfig = {
  items: [
    {
      type: 'component',
      field: 'email',
      label: '企业邮箱',
      placeholder: '请输入企业邮箱',
      rules: [
        { type: 'required', message: '请输入邮箱' },
        { type: 'email', message: '请输入有效的邮箱地址' },
        {
          type: 'domainCheck',
          domain: 'company.com',
          message: '请使用公司邮箱'
        }
      ],
      component: 'el-input'
    },
    {
      type: 'component',
      field: 'phone',
      label: '手机号码',
      placeholder: '请输入手机号码',
      dataProcessing: {
        output: {
          phoneFormat: {}
        }
      },
      component: 'el-input'
    },
    {
      type: 'component',
      field: 'salary',
      label: '薪资',
      placeholder: '请输入薪资',
      dataProcessing: {
        output: {
          numberFormat: { minDigits: 2 }
        }
      },
      component: 'el-input-number'
    },
    {
      type: 'component',
      field: 'customField',
      label: '自定义字段',
      placeholder: '请输入自定义字段',
      dataProcessing: {
        output: {
          customFormatter: { prefix: '前缀-', suffix: '-后缀' }
        }
      },
      component: 'el-input'
    }
  ]
};
