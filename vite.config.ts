import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  console.log(`Running in ${mode} mode with command: ${command}`)

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
      host: true,
      port: 5173,
      cors: true,
      proxy: {
        '/v1': {
          target: 'https://csupgrade-go-api.fly.dev',
          changeOrigin: true,
          secure: true,
          xfwd: true,
        },
        '/auth': {
          target: 'https://csupgrade-go-api.fly.dev',
          changeOrigin: true,
          secure: true,
          xfwd: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log(`Proxying ${req.method} ${req.url} → ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
              
              // Log request headers for debugging
              console.log('Request headers:', JSON.stringify(proxyReq.getHeaders(), null, 2));
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log(`Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);
            });
          }
        },
        '/ws': {
          target: 'https://csupgrade-go-api.fly.dev',
          changeOrigin: true,
          secure: true,
          ws: true,
          xfwd: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log(`Proxying ${req.method} ${req.url} → ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
              
              // Log request headers for debugging
              console.log('Request headers:', JSON.stringify(proxyReq.getHeaders(), null, 2));
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log(`Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);
            });
          }
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
