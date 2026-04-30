// 动态 Vue 组件类型声明
// 此文件由 unplugin-vue-components 自动生成，不要手动修改

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
