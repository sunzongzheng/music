#!/usr/bin/env node

const {exec} = require('child_process')

const argv = process.argv[2]
if (argv) {
    exec(`curl -o src/renderer/assets/iconfont.js https://at.alicdn.com/t/${argv}.js`, (error, stdout) => {
        console.log(stdout)
        if (error) {
            console.log('更新失败')
        }
    })
} else {
    console.log('缺少参数')
}
