#!/usr/bin/env node

require('shelljs/global')

const argv = process.argv[2]
if (argv) {
  if (exec(`curl -o src/renderer/assets/iconfont.js https://at.alicdn.com/t/${argv}.js`).code !== 0) {
    echo('更新失败')
    exit(1)
  }
} else {
  echo('缺少参数')
}
