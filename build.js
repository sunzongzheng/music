const { exec } = require('child_process')

exec('npm run build-file && npm run build:normal')
if (process.platform !== 'linux') {
  exec('npm run build:win')
}
