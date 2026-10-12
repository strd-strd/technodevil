/**
 * PM2 на Beget VPS (рядом с proect-1 :3000 и ollmet :3001).
 *
 *   sudo -u nodejs pm2 start ecosystem.config.cjs
 *   sudo -u nodejs pm2 save
 */
module.exports = {
  apps: [
    {
      name: "technodevil",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3002",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
