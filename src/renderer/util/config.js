import { remote } from 'electron'

const { app } = remote
let platform
switch (process.platform) {
    case 'darwin':
        platform = 'osx'
        break
    case 'win32':
        platform = 'windows'
        break
    default:
        platform = 'linux'
}

function parseVersionNum(versionStr) {
    return versionStr.split('.').map(i => parseInt(i)).reduce((a, b, i) => a * 1000 + b)
}

export default {
    platform,
    aboveVersion(str) {
        return parseVersionNum(app.getVersion()) >= parseVersionNum(str)
    },
}