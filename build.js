const shell = require('shelljs')

shell.exec('npm run build-file && npm run build:normal')
if (process.platform !== 'linux') {
  shell.exec('npm run build:win')
}
