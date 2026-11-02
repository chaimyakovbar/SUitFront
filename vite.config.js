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
          // Group only the packages themselves (not their shared helpers),
          // so heavy lazy-only libraries like three.js stay off the home page.
          manualChunks(id) {
            // Vite's own helpers must live in the entry-side vendor chunk,
            // otherwise they can land in 'three' and drag it onto every page.
            if (id.includes('vite/preload-helper') || id.includes('commonjsHelpers')) return 'vendor'
            if (!id.includes('node_modules')) return
            const pkg = (name) => id.includes(`/node_modules/${name}/`)
            if (pkg('three') || pkg('@react-three/fiber') || pkg('@react-three/drei')) return 'three'
            if (pkg('@mui/material') || pkg('@mui/icons-material') || pkg('@mui/styles') || pkg('@mui/system')) return 'mui'
            if (pkg('react') || pkg('react-dom') || pkg('scheduler')) return 'vendor'
            if (pkg('framer-motion')) return 'animations'
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
