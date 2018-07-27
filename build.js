const {exec} = require('child_process')

exec('npm run build-file && npm run build:normal', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    if (process.platform !== 'linux') {
        exec('npm run build:win')
    }
})
