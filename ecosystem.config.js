module.exports = {
  apps: [
    {
      name: 'expo-app',
      script: 'npx',
      args: 'expo start --web --port 3000',
      cwd: '/var/www/expo-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/expo-app-error.log',
      out_file: '/var/log/pm2/expo-app-out.log',
      log_file: '/var/log/pm2/expo-app.log'
    }
  ]
};
