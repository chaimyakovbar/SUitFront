// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@mui/styles'],
            three: ['@react-three/fiber', '@react-three/drei', 'three'],
            animations: ['framer-motion'],
            utils: ['jotai', 'axios', 'react-router-dom'],
          },
        },
      },
      // Enable source maps for debugging
      sourcemap: false,
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        'framer-motion',
        'jotai',
        'axios',
      ],
    },
    // Enable compression
    server: {
      compress: true,
    },
  }

  // Only add S3 proxy in development mode
  if (command === 'serve') {
    config.plugins.push({
      name: 's3-assets-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/assets/')) {
            const s3Url = `https://ch-suits.s3.us-east-1.amazonaws.com${req.url}`
            console.log(`[S3 Proxy] ${req.method} ${req.url} -> ${s3Url}`)

            // Handle Vite module imports (?import, ?url, etc.)
            if (req.url.includes('?import') || req.url.includes('?url') || req.url.includes('?raw')) {
              const pathOnly = req.url.split('?')[0]
              const finalS3Url = `https://ch-suits.s3.us-east-1.amazonaws.com${pathOnly}`
              res.setHeader('Content-Type', 'application/javascript')
              res.end(`export default ${JSON.stringify(finalS3Url)};`)
              return
            }

            // Redirect direct requests to S3
            res.writeHead(302, { Location: s3Url })
            res.end()
            return
          }
          next()
        })
      },
    })
  }

  return config
})
