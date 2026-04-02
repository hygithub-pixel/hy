/// <reference types="vite/client" />

declare module '@wangeditor/editor' {
  export interface IDomEditor {}
  export interface IEditorConfig {}
  export interface IToolbarConfig {}
  export function createEditor(options: any): IDomEditor;
}

declare module '@wangeditor/editor-for-vue' {
  import { DefineComponent } from 'vue';
  import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';

  export const Editor: DefineComponent<{
    modelValue?: string;
    defaultConfig?: Partial<IEditorConfig>;
    mode?: string;
    onCreated?: (editor: IDomEditor) => void;
  }>;

  export const Toolbar: DefineComponent<{
    editor?: IDomEditor | null;
    defaultConfig?: Partial<IToolbarConfig>;
    mode?: string;
  }>;
}

declare global {
  interface Window {
    announceToScreenReader?: (message: string) => void;
  }
}

export {};
