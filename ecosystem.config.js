// PM2 process definitions for Retain.
//   cd backend  && npm run build
//   cd frontend && npm run build
// Then from anywhere: pm2 start /path/to/ecosystem.config.js

const path = require('path')

module.exports = {
  apps: [
    {
      name: 'retain-backend',
      cwd: path.join(__dirname, 'backend'),
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        // DATABASE_URL, JWT_SECRET and JWT_EXPIRES_IN are read from backend/.env
      },
    },
    {
      // PM2's built-in static server. PM2_SERVE_SPA routes unknown paths to
      // index.html so client-side routes (e.g. /expenses, /admin) work.
      name: 'retain-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: path.join(__dirname, 'frontend', 'dist'),
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
    },
  ],
}
