import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom']
          }
        }
      }
    }
  };

  if (mode === 'development') {
    config.server = {
      proxy: {
        '/v1': {
          target: 'https://csupgrade-go-api.fly.dev/v1',
          changeOrigin: true,
        },
        '/auth': {
          target: 'https://csupgrade-go-api.fly.dev/auth',
          changeOrigin: true,
        },
        '/ws': {
          target: 'ws://csupgrade-go-api.fly.dev',
          changeOrigin: true,
        }
      }
    }
  } else {
    config.server = {
      proxy: {}
    }
  }

  return config
})
