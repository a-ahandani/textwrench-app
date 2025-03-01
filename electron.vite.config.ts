import { resolve } from 'path'
import { defineConfig, ElectronViteConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

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
      plugins: [
        externalizeDepsPlugin(),
        sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'textwrench',
          project: 'electron'
        })
      ]
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
      plugins: [
        externalizeDepsPlugin(),
        sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'textwrench',
          project: 'electron'
        })
      ]
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@shared': resolve('src/shared')
        }
      },
      build: {
        sourcemap: true
      },
      plugins: [
        react(),
        sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'textwrench',
          project: 'electron'
        })
      ]
    }
  })
}
