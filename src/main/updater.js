import autoUpdater from '@suen/electron-updater'

export default function initUpdater() {
    const updater = autoUpdater({
        type: 'custom',
        options: {
            url: 'https://gist.githubusercontent.com/sunzongzheng/e7b502eee0610e316ddaa6b40ea2e5c7/raw/'
        }
    })
    updater.__judgeUpdater = async (includeLinux = false) => {
        try {
            if(includeLinux) {
                await updater.checkForUpdatesAndNotify()
            } else {
                const needUpdate = await updater.checkUpdate()
                if (!needUpdate) return false
                // osx 或 windows 使用默认的更新
                if (process.platform === 'darwin' || process.platform === 'win32') {
                    updater.updateAvailableCallback()
                } else {
                    global.mainWindow.webContents.send('update-alert')
                }
            }
        } catch (e) {
            console.warn(e)
        }
        return true
    }
    global.updater = updater
}