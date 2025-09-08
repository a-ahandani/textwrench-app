import { resolve } from 'path'
import { defineConfig, ElectronViteConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default ({ mode }): ElectronViteConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    main: {
      resolve: {
        alias: {
          '@shared': resolve('src/shared')
        }
      },
      build: {
        sourcemap: true
      },
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      resolve: {
        alias: {
          '@shared': resolve('src/shared')
        }
      },
      build: {
        sourcemap: true
      },
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@shared': resolve('src/shared')
        }
      },
      build: {
        sourcemap: true,
        rollupOptions: {
          input: {
            webview: resolve(__dirname, 'src/renderer/index.html'),
            toolbar: resolve(__dirname, 'src/renderer/toolbar.html')
          }
        }
      },
      plugins: [react()]
    }
  })
}
