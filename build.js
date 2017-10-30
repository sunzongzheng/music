const shell = require('shelljs')

shell.exec('npm run build:normal')
if (process.platform !== 'linux') {
  shell.exec('npm run build:win')
}
