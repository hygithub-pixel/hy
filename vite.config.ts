import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { fileURLToPath, URL } from 'node:url';
import viteCompression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    base: '/mgmt-cli-ebank/',
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        dts: 'src/components.d.ts',
      }),
      // 生产环境启用gzip压缩
      isProduction &&
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 10240,
          deleteOriginFile: false,
        }),
      // 生产环境启用brotli压缩
      isProduction &&
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 10240,
          deleteOriginFile: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.scss" as *;`,
          silenceDeprecations: ['import'],
        },
      },
    },
    build: {
      // 代码分割
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia', 'axios'],
            'ant-design-vue': ['ant-design-vue', '@ant-design/icons-vue'],
            echarts: ['echarts'],
            editor: ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
            xlsx: ['xlsx'],
            utilities: ['dompurify', 'nprogress'],
          },
        },
      },
      // 压缩选项
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 生成sourcemap
      sourcemap: !isProduction,
      // 配置输出目录
      outDir: 'dist',
      // 配置资源文件名哈希
      assetsDir: 'assets',
      // 配置资源文件名
      assetsInlineLimit: 4096,
      // chunk大小警告限制
      chunkSizeWarningLimit: 1000,
    },
    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
      // 代理配置
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    // 优化选项
    optimizeDeps: {
      // 预构建依赖
      include: ['vue', 'vue-router', 'pinia', 'echarts'],
      // 强制预构建
      force: false,
    },
    // 缓存配置
    cacheDir: './node_modules/.vite',
  };
});
