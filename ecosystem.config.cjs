/**
 * PM2 на FastFox RU 5.44.41.186 (srv-1793837301).
 *
 * Занято: 3000–3006 (lishkov, psyinst, masterskayvaryg, strahovaniesmirnov,
 * demidovpark, investdemidov, sglonass). Этот проект — порт 3007.
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
      args: "start -H 127.0.0.1 -p 3007",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
